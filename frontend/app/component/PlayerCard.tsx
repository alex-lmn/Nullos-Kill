import React from "react";
import { IconButton } from "./IconButton";
import { Player } from "../types";

interface PlayerCardProps {
  player: Player;
  otherPlayers: Player[];
  onUpdate: (id: number, data: Partial<Player>) => void;
  onUpdateMultiplier: (id: number, multiplier: number) => void;
  onDelete: (id: number) => void;
  formatCurrency: (cents: number) => string;
  areRevivesVisible: boolean;
}

export function PlayerCard({
  player,
  otherPlayers,
  onUpdate,
  onUpdateMultiplier,
  onDelete,
  formatCurrency,
  areRevivesVisible,
}: PlayerCardProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between text-white w-full xl:w-[calc(50%-12px)]">
      <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-gray-700 text-xs px-2 py-1 rounded text-gray-400">
            {player.id}
          </span>
          <input
            type="text"
            value={player.name}
            onChange={(e) => onUpdate(player.id, { name: e.target.value })}
            className="bg-transparent border-b border-gray-600 text-xl font-bold w-full focus:outline-none"
          />
        </div>
        <div className="text-sm text-red-400 mt-2 font-mono">
          total : {formatCurrency(player.totalDebt)}
        </div>
        {otherPlayers.map((other) => {
          const debtAmount = player.debts?.[other.id] || 0;
          if (debtAmount <= 0) return null;
          return (
            <div
              key={other.id}
              className="text-sm text-red-400 mt-2 font-mono"
            >
              Doit à {other.name}: {formatCurrency(debtAmount)}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 sm:gap-8">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Kills</div>
          <div className="flex items-center gap-2">
            <IconButton
              onClick={() => onUpdate(player.id, { kills: player.kills - 1 })}
              icon="remove"
              iconClassName="text-sm"
              className="bg-red-500/20 text-red-500 w-8 h-8 rounded-xl hover:bg-red-500/40"
            />
            <span className="text-2xl font-mono w-12 text-center">
              {player.kills}
            </span>
            <IconButton
              onClick={() => onUpdate(player.id, { kills: player.kills + 1 })}
              icon="add"
              iconClassName="text-sm"
              className="bg-green-500/20 text-green-500 w-8 h-8 rounded-xl hover:bg-green-500/40"
            />
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">{areRevivesVisible ? "Revives" : "Deaths"}</div>
          <div className="flex items-center gap-2">
            <IconButton
              onClick={() =>
                onUpdate(player.id, { revives: player.revives - 1 })
              }
              icon="remove"
              iconClassName="text-sm"
              className="bg-red-500/20 text-red-500 w-8 h-8 rounded-xl hover:bg-red-500/40"
            />
            <span className="text-2xl font-mono w-12 text-center">
              {player.revives}
            </span>
            <IconButton
              onClick={() =>
                onUpdate(player.id, { revives: player.revives + 1 })
              }
              icon="add"
              iconClassName="text-sm"
              className="bg-green-500/20 text-green-500 w-8 h-8 rounded-xl hover:bg-green-500/40"
            />
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Coeff</div>
          <input
            type="number"
            step="0.1"
            value={player.scoreMultiplier || 1}
            onChange={(e) =>
              onUpdateMultiplier(player.id, parseFloat(e.target.value))
            }
            className="w-16 bg-gray-700 text-white text-center rounded p-1 border border-gray-600"
          />
        </div>
      </div>

      <IconButton
        onClick={() => onDelete(player.id)}
        icon="delete"
        className="text-red-400 hover:text-red-300 mt-4 sm:mt-0 sm:ml-4"
      />
    </div>
  );
}
