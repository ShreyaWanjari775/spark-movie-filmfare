import React from 'react';

interface ShelfPlaqueProps {
  categoryTitle: string;
  movieTitle?: string;
  isEmpty?: boolean;
}

/**
 * Polished awards plaque/nameplate mounted directly beneath each movie slot.
 * Styled with metallic borders, gold/teal accents, and clean text truncation.
 */
export const ShelfPlaque: React.FC<ShelfPlaqueProps> = ({
  categoryTitle,
  movieTitle,
  isEmpty = false,
}) => {
  return (
    <div
      className="relative w-full mt-2.5 sm:mt-3 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-gradient-to-b from-[#0a1e2d] via-[#061420] to-[#020810] border border-[#00c2e0]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_4px_12px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center text-center transition-all duration-300"
    >
      {/* Decorative brass/metallic corner pins */}
      <span
        className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-[#00f5d4]/60 shadow-[0_0_3px_rgba(0,245,212,0.8)]"
        aria-hidden="true"
      />
      <span
        className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-[#00f5d4]/60 shadow-[0_0_3px_rgba(0,245,212,0.8)]"
        aria-hidden="true"
      />

      {/* Category Nameplate Heading */}
      <span className="w-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#00f5d4] truncate leading-tight">
        {categoryTitle}
      </span>

      {/* Movie Title or "No pick" label */}
      <span
        className={`w-full mt-0.5 font-['Cinzel',serif] text-xs sm:text-sm font-bold truncate leading-snug ${
          isEmpty ? 'italic text-[#a5f3fc]/45 font-normal text-[11px] sm:text-xs' : 'text-white'
        }`}
        title={isEmpty ? 'No pick recorded' : movieTitle}
      >
        {isEmpty ? 'No pick' : movieTitle || 'Untitled'}
      </span>
    </div>
  );
};
