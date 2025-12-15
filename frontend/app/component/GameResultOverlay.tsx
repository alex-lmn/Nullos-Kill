import React, { useEffect, useState } from "react";

interface GameResultOverlayProps {
  result: {
    losers: string[];
    winners: string[];
    debt: number;
  } | null;
  onComplete: () => void;
}

export function GameResultOverlay({ result, onComplete }: GameResultOverlayProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (result) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onComplete, 500); // Wait for fade out
      }, 5000); // Show for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [result, onComplete]);

  if (!result) return null;

  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    });
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-black/80 absolute inset-0" />
      
      {/* Rotating Sunburst Background */}
      <div 
        className="absolute w-[900px] h-[900px] rounded-full animate-[spin_10s_linear_infinite]"
        style={{
          background: "repeating-conic-gradient(#66a866 0deg 30deg, #8b6d4d 30deg 60deg)"
        }}
      />

      {/* Central Circle */}
      <div className="relative bg-[#8b6d4d] border-4 border-[#66a866] p-12 rounded-full shadow-2xl text-center transform scale-110 animate-bounce-in w-[500px] h-[500px] flex flex-col justify-center items-center z-10">
        
        <div className="relative z-10 mb-8 flex flex-col items-center">
          <p className="text-2xl text-white mb-2 uppercase font-bold tracking-wider">Le perdant est</p>
          <p className="text-8xl text-white drop-shadow-md mb-4 animate-pulse" style={{ fontFamily: "'Sugar Bread', sans-serif" }}>
            {result.losers.join(", ")}
          </p>
          <p className="text-3xl text-white font-bold mb-2">
            Doit payer <span className="text-yellow-400 text-4xl">{formatCurrency(result.debt)}</span>
          </p>
          <p className="text-xl text-gray-300">
            à <span className="font-bold text-green-400">{result.winners.join(", ")}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
