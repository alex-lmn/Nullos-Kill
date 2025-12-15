import React from "react";
import { Player } from "../types";

interface TieResolutionModalProps {
  tieType: "loser" | "winner" | null;
  tieCandidates: Player[] | null;
  pendingDebt: number;
  formatCurrency: (cents: number) => string;
  onResolve: (playerId: number) => void;
  onCancel: () => void;
}

export function TieResolutionModal({
  tieType,
  tieCandidates,
  pendingDebt,
  formatCurrency,
  onResolve,
  onCancel,
}: TieResolutionModalProps) {
  if (!tieCandidates) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          {tieType === "loser"
            ? "Égalité pour le PERDANT"
            : "Égalité pour le GAGNANT"}
        </h2>
        <p className="text-gray-700 mb-6">
          {tieType === "loser"
            ? `Plusieurs joueurs ont le score le plus bas. Veuillez désigner le perdant qui devra payer la dette de `
            : `Plusieurs joueurs ont le score le plus haut. Veuillez désigner le gagnant qui recevra la dette de `}
          <strong>{formatCurrency(pendingDebt)}</strong>.
        </p>
        <div className="space-y-3">
          {tieCandidates.map((player) => (
            <button
              key={player.id}
              onClick={() => onResolve(player.id)}
              className={`w-full font-semibold py-3 px-4 border rounded-xl shadow flex justify-between items-center ${
                tieType === "loser"
                  ? "bg-gray-100 hover:bg-red-100 text-gray-800 border-gray-300"
                  : "bg-gray-100 hover:bg-green-100 text-gray-800 border-gray-300"
              }`}
            >
              <span>{player.name}</span>
              <span className="text-sm text-gray-500">
                Score: {player.kills + player.revives}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={onCancel}
          className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
