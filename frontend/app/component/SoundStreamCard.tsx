import React from 'react';

interface SoundStreamCardProps {
  label: string;
  iconPath: string;
  expiry: number;
  now: number;
}

export const SoundStreamCard: React.FC<SoundStreamCardProps> = ({ label, iconPath, expiry, now }) => {
  const remainingMs = Math.max(0, expiry - now);
  const remainingSec = Math.ceil(remainingMs / 1000);
  const isReady = remainingSec === 0;

  return (
    <div className="relative w-20 h-28 flex flex-col items-center justify-end pb-3 transition-all duration-300 transform scale-100 font-sans"> 
      
      {/* SVG Background for Border + Transparent Fill */}
      <svg 
        className="absolute inset-0 w-full h-full z-0" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }} 
      >
        <polygon 
           points="50,0 100,25 100,100 0,100 0,25"
           fill={isReady ? "rgba(0,166,123,0.2)" : "rgba(0,0,0,0.4)"}
           stroke={isReady ? "#2AEBB9" : "#6b7280"} 
           strokeWidth="4"
           strokeLinejoin="round"
           className="transition-all duration-300"
        />
      </svg>

      <div className="z-20 flex flex-col items-center gap-1 mb-1">
          <img 
              src={iconPath} 
              alt={label}
              className={`w-8 h-8 transition-all duration-300 ${isReady ? "filter brightness-0 invert opacity-100" : "filter brightness-0 invert opacity-50"}`} 
          />
          <span className="text-base font-bold tracking-wider text-white transition-colors duration-300">
               {isReady ? "Prêt" : remainingSec}
          </span>
      </div>
    </div>
  );
};
