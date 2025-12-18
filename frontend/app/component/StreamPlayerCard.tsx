import React from "react";
import { AnimatedNumber } from "./AnimatedNumber";
import { Player } from "../types";

interface StreamPlayerCardProps {
  player: Player;
  isLosing?: boolean;
  areRevivesVisible?: boolean;
  areAvatarsVisible?: boolean;
}

export function StreamPlayerCard({
  player,
  isLosing,
  areRevivesVisible = true,
  areAvatarsVisible = true,
}: StreamPlayerCardProps) {
  return (
    <div
      className={`bg-[#66a866] text-white p-2 rounded-lg flex items-center gap-3 shadow-lg animate-slide-in flex-wrap justify-center items-center min-w-[300px] ${
        isLosing ? "ring-4 ring-red-600 scale-105 transition-transform" : ""
      }`}
    >
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

      {/* Avatar */}
      {player.avatarUrl ? (
        <div
          className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-[#8b6d4d] text-white rounded-full font-bold text-sm shadow-md z-10 transition-all duration-700 ease-in-out ${
            areAvatarsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6  pointer-events-none"
          }`}
        >
          <img
            src={player.avatarUrl}
            alt={player.name}
            className={`w-16 h-16 rounded-full object-cover border-4 ${
              isLosing ? "border-red-600" : "border-white"
            }`}
          />
        </div>
      ) : (
        <div
          className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-[#8b6d4d] text-white rounded-full font-bold text-sm shadow-md flex items-center justify-center w-16 h-16 border-4 border-white z-10 transition-all duration-700 ease-in-out ${
            areAvatarsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6  pointer-events-none"
          }`}
        >
          <span className="material-symbols-outlined text-3xl">person</span>
        </div>
      )}

      {/* Player Name */}
      <div className="flex-1 text-center">
        <div className="text-xl font-bold truncate">{player.name}</div>
      </div>

      {/* Revives/Deaths Box */}
      <div
        className={`bg-[#8b6d4d] rounded-md p-1 px-3 flex items-center gap-2 min-w-[80px] justify-center ${
          !areRevivesVisible ? "bg-red-900/80" : ""
        }`}
      >
        <span className="material-symbols-outlined text-3xl">
          {areRevivesVisible ? "medical_services" : "skull"}
        </span>
        <div className="text-2xl font-bold font-mono">
          <AnimatedNumber value={player.revives} />
        </div>
      </div>
    </div>
  );
}
