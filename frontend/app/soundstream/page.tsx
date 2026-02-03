"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { SoundStreamCard } from "../component/SoundStreamCard";

type CommandType = "!plant" | "!pas" | "!defuse";

function SoundStreamContent() {
  const searchParams = useSearchParams();
  
  // Configuration
  const [cooldownSec, setCooldownSec] = useState(
      parseInt(searchParams.get("cooldown") || "60", 10)
  );

  const [cooldowns, setCooldowns] = useState<Record<CommandType, number>>({
    "!plant": 0, "!pas": 0, "!defuse": 0,
  });
  
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Socket Connection
    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");
    socketRef.current = socket;

    socket.on("connect", () => console.log("Stream Overlay Connected"));

    socket.on("soundSettingsUpdate", (settings: any) => {
        if (settings.cooldown !== undefined) setCooldownSec(settings.cooldown);
    });

    socket.on("playSound", (payload: { command: string }) => {
        const cmd = payload.command as CommandType;
        const now = Date.now();
        
        // Trigger Visual Cooldown
        setCooldownSec(currentCd => {
             const newExpiry = now + (currentCd * 1000);
             setCooldowns(prev => ({ ...prev, [cmd]: newExpiry }));
             return currentCd; 
        });
    });

    return () => {
        socket.disconnect();
    };
  }, []); // Run once on mount


  // Timer Tick
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-0 left-0">
      <div className="flex gap-8">
        <SoundStreamCard 
            label="Pas" 
            iconPath="/icons/footprint.svg" 
            expiry={cooldowns["!pas"]} 
            now={now} 
        />
        <SoundStreamCard 
            label="Plant" 
            iconPath="/icons/spike.svg" 
            expiry={cooldowns["!plant"]} 
            now={now} 
        />
        <SoundStreamCard 
            label="Defuse" 
            iconPath="/icons/defuse.svg" 
            expiry={cooldowns["!defuse"]} 
            now={now} 
        />
      </div>
    </div>
  );
}

export default function SoundStreamPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading config...</div>}>
      <SoundStreamContent />
    </Suspense>
  );
}
