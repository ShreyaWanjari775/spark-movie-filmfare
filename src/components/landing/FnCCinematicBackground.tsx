import React, { useState } from 'react';

interface FnCCinematicBackgroundProps {
  className?: string;
}

export const FnCCinematicBackground: React.FC<FnCCinematicBackgroundProps> = ({
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Base Midnight Teal Slate */}
      <div className="absolute inset-0 bg-[#02050b]" />

      {/* 2. THE APPROVED FULL-BLEED CINEMATIC REVEAL IMAGE */}
      {/* Reproduces the approved reference: Auditorium seating + cyan floor trail, solitary figure, astronaut, film reel, and posters */}
      {!hasError ? (
        <div className="absolute inset-0 w-full h-full animate-cinema-drift overflow-hidden">
          <img
            src="/images/fnc-cinematic-reveal-bg.jpg"
            alt="FnC Movie Night Cinematic Background"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover object-center filter contrast-[1.08] brightness-[0.85]"
          />
        </div>
      ) : (
        /* Graceful high-aesthetic fallback if image fails to load */
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,_#062831_0%,_#04121a_45%,_#02050b_100%)] opacity-95" />
      )}

      {/* 3. DARK GRADIENT OVERLAYS (Matches Reference: Guarantees Central Text Readability) */}
      {/* Center radial shadow keeping text and CTAs crisp */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,_rgba(2,5,11,0.88)_0%,_rgba(2,5,11,0.65)_45%,_transparent_80%)] pointer-events-none" />

      {/* Top and Bottom atmospheric vignettes */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02050b]/90 via-transparent to-[#02050b] pointer-events-none" />

      {/* Subtle SPark Cyan/Aqua atmospheric haze in the upper center */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 194, 224, 0.3) 0%, rgba(0, 245, 212, 0.1) 40%, transparent 75%)',
          filter: 'blur(35px)'
        }}
      />

      {/* 4. Fine 35mm film grain texture */}
      <div className="absolute inset-0 bg-film-grain opacity-30 pointer-events-none" />
    </div>
  );
};
