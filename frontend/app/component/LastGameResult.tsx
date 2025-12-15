import React from "react";
import { IconButton } from "./IconButton";

interface LastGameResultProps {
  message: string | null;
  onClose: () => void;
}

export function LastGameResult({ message, onClose }: LastGameResultProps) {
  if (!message) return null;

  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6"
      role="alert"
    >
      <strong className="font-bold">Résultat de la dernière partie: </strong>
      <span className="block sm:inline">{message}</span>
      <IconButton
        onClick={onClose}
        icon="close"
        iconClassName="text-red-500 cursor-pointer"
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
      />
    </div>
  );
}
