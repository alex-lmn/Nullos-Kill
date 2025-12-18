import React from "react";
import { IconButton } from "./IconButton";
import { Player } from "../types";

interface PlayerCardProps {
  player: Player;
  otherPlayers: Player[];
  onUpdate: (id: number, data: Partial<Player>) => void;
  onUpdateMultiplier: (id: number, multiplier: number) => void;
  onDelete: (id: number) => void;
  onUploadAvatar: (id: number, file: File) => void;
  onDeleteAvatar: (id: number) => void;
  formatCurrency: (cents: number) => string;
  areRevivesVisible: boolean;
}

export function PlayerCard({
  player,
  otherPlayers,
  onUpdate,
  onUpdateMultiplier,
  onDelete,
  onUploadAvatar,
  onDeleteAvatar,
  formatCurrency,
  areRevivesVisible,
}: PlayerCardProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadAvatar(player.id, e.target.files[0]);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between text-white w-full xl:w-[calc(50%-12px)]">
      <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
            {player.avatarUrl ? (
              <img src={player.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">upload</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-sm">edit</span>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
          <IconButton
              onClick={() => onDeleteAvatar(player.id)}
              icon="close_small"
              iconClassName="text-sm"
              className="bg-red-500/20 text-red-500 w-8 h-8 rounded-xl hover:bg-red-500/40"
            />
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
