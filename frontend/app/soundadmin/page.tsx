"use client";

import { useEffect, useRef, useState } from "react";
import tmi from "tmi.js";
import { io, Socket } from "socket.io-client";
import { Footprints, Triangle, ShieldAlert, Copy, ExternalLink, RefreshCw, Volume2 } from "lucide-react";

type CommandType = "!plant" | "!pas" | "!defuse";

const SOUND_FILES: Record<CommandType, string> = {
  "!plant": "/sounds/plant.mp3",
  "!pas": "/sounds/pas.mp3",
  "!defuse": "/sounds/defuse.mp3",
};

export default function SoundAdminPage() {
  // Settings State
  const [channel, setChannel] = useState("alex_lmn");
  const [cooldownSec, setCooldownSec] = useState(60);
  const [maxDelaySec, setMaxDelaySec] = useState(15);
  const [mediaVolume, setMediaVolume] = useState(0.5);
  
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  // Logic State
  const [cooldowns, setCooldowns] = useState<Record<CommandType, number>>({
    "!plant": 0, "!pas": 0, "!defuse": 0,
  });
  const cooldownsRef = useRef<Record<CommandType, number>>({
    "!plant": 0, "!pas": 0, "!defuse": 0,
  });

  const socketRef = useRef<Socket | null>(null);
  const clientRef = useRef<tmi.Client | null>(null);

  // 1. Initialize Socket Connection & Listeners
  useEffect(() => {
    // Connect to backend (adjust URL if deployed elsewhere)
    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");
    socketRef.current = socket;

    socket.on("soundSettingsUpdate", (settings: any) => {
        // Only update if receiving from server (could block local loopback if needed, but fine for now)
        if (settings.channel) setChannel(settings.channel);
        if (settings.cooldown !== undefined) setCooldownSec(settings.cooldown);
        if (settings.maxDelay !== undefined) setMaxDelaySec(settings.maxDelay);
    });

    socket.on("playSound", (payload: { command: string }) => {
        const cmd = payload.command as CommandType;
        
        // Admin page plays sound locally too (monitoring)
        const audio = new Audio(SOUND_FILES[cmd]);
        audio.volume = mediaVolume;
        audio.play().catch(err => {
             if (err.name === "NotAllowedError") setNeedsInteraction(true);
        });

        // Trigger visual cooldown
        const now = Date.now();
        const newExpiry = now + (cooldownSec * 1000); // Use local state or ref? ref is safer but state is synced
        cooldownsRef.current[cmd] = newExpiry;
        setCooldowns(prev => ({ ...prev, [cmd]: newExpiry }));
    });

    return () => {
        socket.disconnect();
    };
  }, [mediaVolume, cooldownSec]); // Re-bind if volume changes to capture new closure value? Actually refs are better.
  
  // Use a ref for volume to avoid re-binding socket listener
  const volumeRef = useRef(mediaVolume);
  useEffect(() => { volumeRef.current = mediaVolume; }, [mediaVolume]);

  const cooldownSecRef = useRef(cooldownSec);
  useEffect(() => { cooldownSecRef.current = cooldownSec; }, [cooldownSec]);


  // 2. Sync Settings TO Backend
  useEffect(() => {
    if (socketRef.current) {
        socketRef.current.emit("updateSoundSettings", {
            channel,
            cooldown: cooldownSec,
            maxDelay: maxDelaySec,
        });
    }
    
    // Update Generated URL (now simpler)
    if (typeof window !== "undefined") {
        const baseUrl = `${window.location.protocol}//${window.location.host}/soundstream`;
        const params = new URLSearchParams({
            // minimal params needed, maybe volume for stream side
            volume: "1.0"
        });
        setGeneratedUrl(`${baseUrl}?${params.toString()}`);
    }

  }, [channel, cooldownSec, maxDelaySec]);


  // 3. TMI & Command Logic
  // We use Refs for settings inside TMI callback
  const settingsRef = useRef({ cooldownSec, maxDelaySec });
  useEffect(() => { settingsRef.current = { cooldownSec, maxDelaySec }; }, [cooldownSec, maxDelaySec]);

  const handleCommandLogic = (command: CommandType) => {
      const now = Date.now();
      
      // Local Cooldown Check
      if (now < cooldownsRef.current[command]) {
          console.log(`Cooldown active for ${command}`);
          return;
      }

      // 1. Set Local Cooldown immediately to prevent double firing
      const newExpiry = now + (settingsRef.current.cooldownSec * 1000);
      cooldownsRef.current[command] = newExpiry;
      setCooldowns(prev => ({ ...prev, [command]: newExpiry }));

      // 2. Calculate Random Delay
      const delay = Math.random() * (settingsRef.current.maxDelaySec * 1000);
      console.log(`Triggering ${command} in ${Math.round(delay)}ms`);
      
      // 3. Emit to Backend after delay
      // The Admin client is the "Master" that decides when the sound happens
      setTimeout(() => {
          if (socketRef.current) {
              socketRef.current.emit("triggerSound", { command });
          }
      }, delay);
  };

  useEffect(() => {
    if (clientRef.current) clientRef.current.disconnect().catch(() => {});
    
    const client = new tmi.Client({ channels: [channel] });
    client.connect()
        .then(() => setIsConnected(true))
        .catch(() => setIsConnected(false));

    client.on("message", (ch, tags, msg, self) => {
      if (self) return;
      const command = msg.trim().toLowerCase() as CommandType;
      if (Object.keys(SOUND_FILES).includes(command)) {
         handleCommandLogic(command);
      }
    });

    clientRef.current = client;
    return () => { if (clientRef.current) clientRef.current.disconnect(); };
  }, [channel]);


  // --- Render ---
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const renderCard = (command: CommandType, label: string, Icon: React.ElementType) => {
    const expiry = cooldowns[command];
    const remainingMs = Math.max(0, expiry - now);
    const remainingSec = Math.ceil(remainingMs / 1000);
    const isReady = remainingSec === 0;

    return (
      <div key={command} className={`relative w-28 h-36 flex flex-col items-center justify-center rounded-xl border-2 transition-all ${isReady ? 'border-green-400 bg-green-900/20' : 'border-gray-600 bg-gray-800/50'}`}>
          <Icon className={isReady ? "text-green-400" : "text-gray-500"} size={32} />
          <div className="mt-2 text-xl font-bold text-white">
              {isReady ? "READY" : remainingSec}
          </div>
          <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{label}</div>
           <button 
                onClick={() => handleCommandLogic(command)}
                className="absolute -bottom-3 bg-blue-600 hover:bg-blue-500 text-white text-xs px-2 py-1 rounded shadow cursor-pointer z-10"
           >
               TEST
           </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans p-8 flex flex-col gap-8">
      
      <header className="flex items-center justify-between border-b border-gray-700 pb-6">
          <div className="flex items-center gap-4">
              <div className="bg-purple-600 p-3 rounded-lg">
                  <Volume2 className="text-white" size={24} />
              </div>
              <div>
                  <h1 className="text-2xl font-bold text-white">Sound Controller</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                      {isConnected ? `Connected to #${channel}` : 'Connecting...'}
                  </div>
              </div>
          </div>
          
          {needsInteraction && (
            <button
                onClick={() => {
                    const aud = new Audio(); 
                    aud.play().catch(() => {}); 
                    setNeedsInteraction(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold animate-pulse shadow-lg flex items-center gap-2"
            >
                <Volume2 size={20} /> Enable Audio Source
            </button>
          )}
      </header>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Settings */}
          <div className="lg:col-span-1 space-y-6">
              <section className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <RefreshCw size={18} /> Configuration
                  </h2>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm text-gray-400 mb-1">Twitch Channel</label>
                          <input 
                              type="text" 
                              value={channel} 
                              onChange={(e) => setChannel(e.target.value)}
                              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                          />
                      </div>
                      <div>
                          <label className="block text-sm text-gray-400 mb-1">Cooldown</label>
                          <div className="flex items-center gap-3">
                              <input 
                                  type="range" min="1" max="300" 
                                  value={cooldownSec} 
                                  onChange={(e) => setCooldownSec(parseInt(e.target.value))}
                                  className="flex-1"
                              />
                              <span className="w-12 text-right font-mono">{cooldownSec}s</span>
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm text-gray-400 mb-1">Max Random Delay</label>
                          <div className="flex items-center gap-3">
                              <input 
                                  type="range" min="0" max="60" 
                                  value={maxDelaySec} 
                                  onChange={(e) => setMaxDelaySec(parseInt(e.target.value))}
                                  className="flex-1"
                              />
                              <span className="w-12 text-right font-mono">{maxDelaySec}s</span>
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm text-gray-400 mb-1">Local Volume (Monitoring)</label>
                          <div className="flex items-center gap-3">
                              <input 
                                  type="range" min="0" max="1" step="0.05"
                                  value={mediaVolume} 
                                  onChange={(e) => setMediaVolume(parseFloat(e.target.value))}
                                  className="flex-1"
                              />
                              <span className="w-12 text-right font-mono">{Math.round(mediaVolume * 100)}%</span>
                          </div>
                      </div>
                  </div>
              </section>

              <section className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                       <ExternalLink size={18} /> Stream Overlay URL
                  </h2>
                  <p className="text-xs text-gray-400 mb-3">
                      Add this to OBS. It will sync with these settings automatically.
                  </p>
                  <div className="flex items-center gap-2 bg-gray-900 p-2 rounded border border-gray-600">
                      <code className="flex-1 text-xs text-purple-300 truncate font-mono">
                          {generatedUrl || "Loading..."}
                      </code>
                      <button 
                        onClick={() => {
                            if(generatedUrl) {
                                navigator.clipboard.writeText(generatedUrl);
                                alert("Copied!"); 
                            }
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                          <Copy size={16} />
                      </button>
                  </div>
              </section>
          </div>

          {/* Cards */}
          <div className="lg:col-span-2 bg-black/30 p-8 rounded-2xl border border-gray-800 flex flex-col items-center justify-center">
               <h3 className="text-gray-500 uppercase tracking-widest text-sm mb-8">Live Control</h3>
               <div className="flex flex-wrap justify-center gap-8">
                    {renderCard("!pas", "Pas", Footprints)}
                    {renderCard("!plant", "Plant", Triangle)}
                    {renderCard("!defuse", "Defuse", ShieldAlert)}
               </div>
          </div>

      </div>
    </div>
  );
}

