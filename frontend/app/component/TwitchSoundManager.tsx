"use client";

import { useEffect, useRef, useState } from "react";
import tmi from "tmi.js";

interface TwitchSoundManagerProps {
  channel: string;
}

type CommandType = "!plant" | "!pas" | "!defuse";

const SOUND_FILES: Record<CommandType, string> = {
  "!plant": "/sounds/plant.mp3",
  "!pas": "/sounds/pas.mp3",
  "!defuse": "/sounds/defuse.mp3",
};

const COOLDOWN_MS = 60000; // 1 minute
const MAX_DELAY_MS = 15000; // 15 seconds

export function TwitchSoundManager({ channel }: TwitchSoundManagerProps) {
  const clientRef = useRef<tmi.Client | null>(null);
  const cooldowns = useRef<Record<string, number>>({});
  const [needsInteraction, setNeedsInteraction] = useState(false);
  
  useEffect(() => {
    if (!channel) return;

    // cleanup previous client if any
    if (clientRef.current) {
        clientRef.current.disconnect().catch(console.error);
    }

    const client = new tmi.Client({
      channels: [channel],
    });

    client.connect().then(() => {
        console.log(`Connected to ${channel}`);
    }).catch(console.error);

    client.on("message", (channel, tags, message, self) => {
      if (self) return;

      const msg = message.trim().toLowerCase();
      if (isValidCommand(msg)) {
        handleCommand(msg as CommandType);
      }
    });

    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect().catch(console.error);
      }
    };
  }, [channel]);

  const isValidCommand = (msg: string): msg is CommandType => {
    return Object.keys(SOUND_FILES).includes(msg);
  };

  const handleCommand = (command: CommandType) => {
    const now = Date.now();
    const lastPlayed = cooldowns.current[command] || 0;

    if (now - lastPlayed < COOLDOWN_MS) {
      console.log(`Cooldown active for ${command}`);
      return;
    }

    // Set cooldown immediately to prevent double firing
    cooldowns.current[command] = now;

    const delay = Math.random() * MAX_DELAY_MS;
    console.log(`Scheduling ${command} in ${Math.round(delay / 1000)}s`);

    setTimeout(() => {
      playSound(command);
    }, delay);
  };

  const playSound = (command: CommandType) => {
    const audio = new Audio(SOUND_FILES[command]);
    audio.volume = 0.5; // Adjustable volume
    audio.play().catch((err) => {
      console.error("Error playing sound:", err);
      if (err.name === "NotAllowedError") {
        setNeedsInteraction(true);
      }
    });
  };

  if (needsInteraction) {
    return (
      <button
        onClick={() => setNeedsInteraction(false)}
        className="fixed top-4 left-4 z-50 bg-red-600/90 text-white px-6 py-3 rounded-xl font-bold shadow-2xl backdrop-blur-sm animate-pulse hover:bg-red-700 transition-colors border-2 border-white/20"
      >
        🔊 Click to Enable Sound
      </button>
    );
  }

  return null; // Invisible component
}
