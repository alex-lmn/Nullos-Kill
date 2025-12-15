"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { StreamPlayerCard } from "../component/StreamPlayerCard";
import { GameResultOverlay } from "../component/GameResultOverlay";
import { Player } from "../types";

const socket = io("http://localhost:3001");

export default function StreamPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [multiplier, setMultiplier] = useState(10);
  const [isVisible, setIsVisible] = useState(true);
  const [areScoresVisible, setAreScoresVisible] = useState(true);
  const [isMultiplierVisible, setIsMultiplierVisible] = useState(true);
  const [isLoserPreviewVisible, setIsLoserPreviewVisible] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3001/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Failed to fetch players:", err));

    fetch("http://localhost:3001/players/settings")
      .then((res) => res.json())
      .then((data) => {
        setMultiplier(data.multiplier);
        setIsVisible(data.isVisible);
        setAreScoresVisible(data.areScoresVisible);
        setIsMultiplierVisible(data.isMultiplierVisible);
        setIsLoserPreviewVisible(data.isLoserPreviewVisible);
      })
      .catch((err) => console.error("Failed to fetch settings:", err));

    socket.on("scoreUpdate", (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    });

    socket.on("settingsUpdate", (settings: any) => {
      setMultiplier(settings.multiplier);
      setIsVisible(settings.isVisible);
      setAreScoresVisible(settings.areScoresVisible);
      setIsMultiplierVisible(settings.isMultiplierVisible);
      setIsLoserPreviewVisible(settings.isLoserPreviewVisible);
    });

    socket.on("gameFinished", (result: any) => {
      if (result.status === 'resolved') {
        setGameResult(result.result);
      }
    });

    return () => {
      socket.off("scoreUpdate");
      socket.off("settingsUpdate");
      socket.off("gameFinished");
    };
  }, []);

  const minScore = players.length > 0 ? Math.min(...players.map(p => (p.kills + p.revives) * (p.scoreMultiplier || 1))) : 0;
  
  return (
    <>
      <GameResultOverlay 
        result={gameResult} 
        onComplete={() => setGameResult(null)} 
      />
      <div
        className={`relative transition-all duration-700 ease-in-out transform min-h-screen w-full mt-6 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
         <div className={`w-full flex justify-center transition-all duration-700 ease-in-out transform ${
          isMultiplierVisible && !gameResult ? "opacity-100 translate-y-0 max-h-20" : "opacity-0 -translate-y-10 pointer-events-none mt-0 max-h-0 overflow-hidden"
        }`}>
          <div className="bg-[#8b6d4d] text-white p-2 rounded-lg shadow-lg flex items-center gap-1 border-2 border-[#66a866]">
              <span className="text-lg font-bold font-mono">x {multiplier}</span>
          </div>
        </div>

        <div className={`bg-transparent p-4 flex flex-wrap gap-4 justify-center items-start transition-all duration-700 ease-in-out transform ${
          areScoresVisible && !gameResult ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"
        }`}>
          {players.map((player) => {
            const score = (player.kills + player.revives) * (player.scoreMultiplier || 1);
            const isLoser = score === minScore;
            return (
              <StreamPlayerCard 
                key={player.id} 
                player={player} 
                isLosing={isLoserPreviewVisible && isLoser}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
