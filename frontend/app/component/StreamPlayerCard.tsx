import React from "react";
import { AnimatedNumber } from "./AnimatedNumber";
import { Player } from "../types";

interface StreamPlayerCardProps {
  player: Player;
  isLosing?: boolean;
}

export function StreamPlayerCard({ player, isLosing }: StreamPlayerCardProps) {
  return (
    <div className={`bg-[#66a866] text-white p-2 rounded-lg flex items-center gap-3 shadow-lg animate-slide-in min-w-[300px] ${isLosing ? 'ring-4 ring-red-600 scale-105 transition-transform' : ''}`}>
      {isLosing && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-md animate-bounce z-10">
          LOSER
        </div>
      )}
      {/* Kills Box */}
      <div className="bg-[#8b6d4d] rounded-md p-1 px-3 flex items-center gap-2 min-w-[80px] justify-center">
        <span className="material-symbols-outlined text-3xl">skull</span>
        <div className="text-2xl font-bold font-mono">
          <AnimatedNumber value={player.kills} />
        </div>
      </div>

      {/* Player Name */}
      <div className="flex-1 text-center">
        <div className="text-xl font-bold truncate">{player.name}</div>
      </div>

      {/* Revives Box */}
      <div className="bg-[#8b6d4d] rounded-md p-1 px-3 flex items-center gap-2 min-w-[80px] justify-center">
        <span className="material-symbols-outlined text-3xl">
          medical_services
        </span>
        <div className="text-2xl font-bold font-mono">
          <AnimatedNumber value={player.revives} />
        </div>
      </div>
    </div>
  );
}
