import React from 'react';

interface MatchResult {
  result: 'win' | 'loss' | 'draw';
}

export interface ValoTrackOverlayProps {
  rank: string; // e.g. "SILVER 3"
  rr: number; // Rank Rating
  rankIconUrl?: string; 
  winPercent: number;
  kda: number;
  history: MatchResult[];
}

export const ValoTrackOverlay: React.FC<ValoTrackOverlayProps> = ({
  rank,
  rr,
  rankIconUrl,
  winPercent,
  kda,
  history
}) => {
  return (
    <div className="inline-flex items-center bg-[rgba(0,166,123,0.2)] border-2 border-[#2AEBB9] rounded-2xl px-5 py-3 text-white font-sans max-w-full">
      {/* Rank Icon Section */}
      <div className="relative w-16 h-16 flex-shrink-0 mr-5 flex items-center justify-center">
        {rankIconUrl ? (
           <img src={rankIconUrl} alt={rank} className="w-full h-full object-contain drop-shadow-md" />
        ) : (
           <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse" />
        )}
      </div>
      
      {/* Rating Text */}
      <div className="flex flex-col mr-10">
        <div className="flex gap-3 mb-1 justify-between">
             <div className="text-gray-200 text-xs font-bold tracking-[0.15em]">RATING</div>
             <div className="text-gray-200 text-xs font-medium">{rr} rr</div>
        </div>
        <div className="text-4xl font-black uppercase tracking-tight leading-none font-sans drop-shadow-sm whitespace-nowrap">
          {rank}
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex flex-col gap-2">
         {/* History Squares */}
         <div className="flex gap-2 mb-1 justify-between">
            {/* Display up to 7 matches for "Today" history */}
            {Array.from({ length: 7 }).map((_, i) => {
               // We map the history. If history has fewer elements, invalid ones are grey.
               // Assuming 'history' array is standard chronological or we just display what we have.
               // If history is [win, loss, win], and we want to show 7 slots.
               // Let's assume index 0 is oldest today? Or newest? 
               // Usually visual history is often Newest -> Oldest (left to right) or Oldest -> Newest.
               // But usually "dots" are just current valid games.
               
               let result: 'win' | 'loss' | 'draw' | null = null;
               if (i < history.length) {
                 result = history[i].result;
               }

               let bgClass = "bg-[#2c3d42]"; // Empty slot color (dark grey/green)
               if (result === 'win') bgClass = "bg-[#48bca0]"; // Green
               if (result === 'loss') bgClass = "bg-[#d45258]"; // Red
               if (result === 'draw') bgClass = "bg-gray-400"; 

               return (
                   <div key={i} className={`w-full h-3.5 rounded-[2px] ${bgClass}`} />
               );
            })}
         </div>

         <div className="flex gap-8">
            <div className="flex flex-col items-center">
               <div className="text-gray-300 text-[10px] font-bold uppercase tracking-wider mb-0.5">WIN % Today</div>
               <div className="text-2xl font-black leading-none drop-shadow-sm">{winPercent}%</div>
            </div>
            <div className="flex flex-col items-center">
               <div className="text-gray-300 text-[10px] font-bold uppercase tracking-wider mb-0.5">KDA Today</div>
               <div className="text-2xl font-black leading-none drop-shadow-sm">{kda.toFixed(2).replace('.', ',')}</div>
            </div>
         </div>
      </div>
    </div>
  );
};
