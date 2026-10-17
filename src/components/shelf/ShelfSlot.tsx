import React, { useState } from 'react';
import { Film, Trophy } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { ShelfPlaque } from './ShelfPlaque';
import type { SubmittedPick } from '../../types/shelf';

interface ShelfSlotProps {
  pick: SubmittedPick;
  index: number;
}

/**
 * A single trophy slot displaying a voter's chosen movie on the awards shelf.
 * Styled like a framed album sleeve or trophy resting on a shelf pedestal,
 * with lazy loading, explicit 2:3 aspect ratio, fallbacks, and entrance animation.
 */
export const ShelfSlot: React.FC<ShelfSlotProps> = ({ pick, index }) => {
  const [ref, inView] = useInView<HTMLLIElement>({ rootMargin: '0px 0px -40px 0px' });
  const [imageError, setImageError] = useState(false);

  const hasPick = Boolean(pick.nomineeId && pick.nomineeTitle);
  const altText = hasPick
    ? `Poster for ${pick.nomineeTitle}, your pick for ${pick.categoryTitle}`
    : `Empty slot for ${pick.categoryTitle}`;

  return (
    <li
      ref={ref}
      className={`relative flex flex-col items-center justify-end group transition-transform duration-300 reveal ${
        inView ? 'reveal-visible' : ''
      }`}
      style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties}
    >
      {/* Overhead soft spotlight beam */}
      <div
        className="absolute -top-6 inset-x-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(0,194,224,0.14),transparent_75%)] pointer-events-none group-hover:bg-[radial-gradient(ellipse_at_top,rgba(0,245,212,0.22),transparent_75%)] transition-colors duration-500"
        aria-hidden="true"
      />

      {/* Main Poster Sleeve / Plinth Display */}
      <div className="relative w-full flex flex-col items-center">
        {hasPick ? (
          <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#040c17] border border-[#00c2e0]/30 shadow-[0_12px_28px_rgba(0,0,0,0.85),0_0_15px_rgba(0,194,224,0.12)] group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.95),0_0_25px_rgba(0,245,212,0.35)] group-hover:-translate-y-1 transition-all duration-300">
            {!imageError && pick.posterUrl ? (
              <img
                src={pick.posterUrl}
                alt={altText}
                loading="lazy"
                decoding="async"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              /* Fallback gradient with title if image fails */
              <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#061e2b] via-[#04111c] to-[#02060c]">
                <Film className="w-8 h-8 text-[#00c2e0]/60 mb-2" />
                <p className="font-['Cinzel',serif] text-sm font-bold text-white line-clamp-3">
                  {pick.nomineeTitle}
                </p>
                <p className="text-[10px] text-[#00f5d4] mt-1 font-semibold uppercase tracking-wider">
                  Voted Champion
                </p>
              </div>
            )}

            {/* Subtle glossy glass reflection sheen */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent pointer-events-none"
              aria-hidden="true"
            />

            {/* Trophy badge pill on top corner */}
            <div
              className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-[#030a14]/85 border border-[#00f5d4]/40 flex items-center gap-1 shadow-sm"
              aria-hidden="true"
            >
              <Trophy className="w-2.5 h-2.5 text-[#00f5d4]" />
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#00f5d4]">
                Pick
              </span>
            </div>
          </div>
        ) : (
          /* Empty category slot (e.g., optional categories or legacy state) */
          <div className="relative w-full aspect-[2/3] rounded-xl border-2 border-dashed border-[#00c2e0]/20 bg-[#061420]/30 flex flex-col items-center justify-center p-3 text-center group-hover:border-[#00c2e0]/40 transition-colors">
            <Trophy className="w-7 h-7 text-[#00c2e0]/30 mb-2 stroke-[1.5]" />
            <span className="text-[11px] font-bold text-[#a5f3fc]/50 uppercase tracking-wider">
              No Pick
            </span>
            <span className="text-[9px] text-[#a5f3fc]/35 mt-0.5">
              Category Skipped
            </span>
          </div>
        )}

        {/* Small beveled pedestal plinth base */}
        <div
          className="w-[85%] h-1.5 bg-gradient-to-r from-transparent via-[#00c2e0]/40 to-transparent mt-1 rounded-full shadow-[0_0_8px_rgba(0,194,224,0.4)]"
          aria-hidden="true"
        />

        {/* Category Plaque / Nameplate */}
        <ShelfPlaque
          categoryTitle={pick.categoryTitle}
          movieTitle={pick.nomineeTitle}
          isEmpty={!hasPick}
        />
      </div>
    </li>
  );
};
