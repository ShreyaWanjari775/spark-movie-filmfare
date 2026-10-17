import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { EVENT_DETAILS } from '../../data/mockData';
import { getSubmittedPicks } from '../../lib/votingStorage';
import { ShelfSlot } from './ShelfSlot';
import { MovieRecommendationForm } from '../common/MovieRecommendationForm';
import type { SubmittedPick } from '../../types/shelf';

interface TrophyShelfProps {
  /** Optional picks passed directly from parent after fresh submit */
  initialPicks?: SubmittedPick[] | null;
}

/**
 * Responsive column count calculator:
 * 2 slots on mobile (~375px), 3 on tablets (>=640px), 4 on desktop (>=1024px).
 */
function useShelfColumns() {
  const [cols, setCols] = useState<number>(() => {
    if (typeof window === 'undefined') return 2;
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 640) return 3;
    return 2;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const nextCols = width >= 1024 ? 4 : width >= 640 ? 3 : 2;
      setCols(nextCols);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return cols;
}

/**
 * Read-only Trophy Shelf Page.
 * Displays the person's chosen movie champions on tiered album/trophy shelf rows
 * resting on realistic CSS ledges.
 */
export const TrophyShelf: React.FC<TrophyShelfProps> = ({ initialPicks }) => {
  const cols = useShelfColumns();
  const [picks] = useState<SubmittedPick[] | null>(() => {
    if (initialPicks && initialPicks.length > 0) return initialPicks;
    return getSubmittedPicks();
  });

  // Legacy case: voter has voted previously, but no picks snapshot exists in storage
  const isLegacyFallback = !picks || picks.length === 0;

  // Placeholder slots for legacy state so the shelf still renders beautifully
  const displayPicks: SubmittedPick[] = isLegacyFallback
    ? [
        { categoryId: 'legacy-1', categoryTitle: 'Best Film', nomineeId: '', nomineeTitle: '', posterUrl: '', savedAt: '' },
        { categoryId: 'legacy-2', categoryTitle: 'Audience Choice', nomineeId: '', nomineeTitle: '', posterUrl: '', savedAt: '' },
        { categoryId: 'legacy-3', categoryTitle: 'Director of the Year', nomineeId: '', nomineeTitle: '', posterUrl: '', savedAt: '' },
        { categoryId: 'legacy-4', categoryTitle: 'Cinematography', nomineeId: '', nomineeTitle: '', posterUrl: '', savedAt: '' },
      ]
    : picks;

  // Split display picks into shelf rows based on responsive column count
  const shelfRows: SubmittedPick[][] = [];
  for (let i = 0; i < displayPicks.length; i += cols) {
    shelfRows.push(displayPicks.slice(i, i + cols));
  }

  // Format saved date if available
  const savedDateFormatted = React.useMemo(() => {
    if (!picks || !picks[0]?.savedAt) return null;
    try {
      const d = new Date(picks[0].savedAt);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return null;
    }
  }, [picks]);

  return (
    <div className="relative min-h-[85vh] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting spotlight */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-[radial-gradient(ellipse_at_top,rgba(0,194,224,0.12),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#062831]/80 border border-[#00f5d4]/40 mb-3 shadow-[0_0_15px_rgba(0,245,212,0.25)]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00f5d4]" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#00f5d4]">
              Official Ballot Sealed • Read-Only
            </span>
          </div>

          <h1 className="font-['Cinzel',serif] text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wide">
            Thanks for Voting
          </h1>

          <p className="mt-2 text-sm sm:text-base text-[#a5f3fc]/80 max-w-2xl mx-auto leading-relaxed">
            Your votes have been sealed and recorded. Results to be announced in the FnC Night.
          </p>

          {/* Event Context Strip */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#a5f3fc]/70">
            <span className="inline-flex items-center gap-1.5 font-semibold text-white">
              <Award className="w-3.5 h-3.5 text-[#00c2e0]" />
              {EVENT_DETAILS.eventName} — {EVENT_DETAILS.title}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#00f5d4]" />
              {EVENT_DETAILS.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#00c2e0]" />
              {EVENT_DETAILS.venue}
            </span>
          </div>

          {savedDateFormatted && (
            <p className="mt-2 text-[11px] text-[#a5f3fc]/45">
              Ballot timestamp: {savedDateFormatted}
            </p>
          )}

          {isLegacyFallback && (
            <div className="mt-6 mx-auto max-w-md p-4 rounded-xl bg-[#062831]/40 border border-[#00c2e0]/30 text-xs text-[#a5f3fc]/75">
              <p className="font-semibold text-white mb-1">Ballot Previously Recorded</p>
              <p>
                Your vote was recorded in the ballot database on an earlier session. Your shelf slots are preserved below.
              </p>
            </div>
          )}
        </header>

        {/* Shelf Rack: Tiered rows resting on realistic CSS ledges */}
        <section aria-label="Your voted movie champions shelf" className="space-y-12 sm:space-y-16">
          {shelfRows.map((row, rowIndex) => (
            <div key={rowIndex} className="shelf-tier relative">
              {/* Slots Row */}
              <ul
                role="list"
                className={`grid gap-4 sm:gap-6 lg:gap-8 items-end ${
                  cols === 4
                    ? 'grid-cols-4'
                    : cols === 3
                    ? 'grid-cols-3'
                    : 'grid-cols-2'
                }`}
              >
                {row.map((pick, slotIndex) => {
                  const overallIndex = rowIndex * cols + slotIndex;
                  return (
                    <ShelfSlot
                      key={pick.categoryId || `slot-${overallIndex}`}
                      pick={pick}
                      index={overallIndex}
                    />
                  );
                })}
              </ul>

              {/* Shelf Ledge: Full-width continuous physical beam beneath slots */}
              <div
                className="shelf-ledge mt-3 sm:mt-4 w-full select-none"
                aria-hidden="true"
              >
                {/* Ledge Top Surface (reflective horizontal beam that slots stand upon) */}
                <div className="h-2.5 sm:h-3 w-full bg-gradient-to-r from-[#031522] via-[#0b2b3b] to-[#031522] border-t border-[#00f5d4]/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />

                {/* Ledge Front Bevel Face (thick wood/metal fascia with hardware rivets) */}
                <div className="h-4 sm:h-5 w-full bg-gradient-to-b from-[#082030] via-[#040e17] to-[#01050a] border-t border-[#00c2e0]/35 border-b border-[#00c2e0]/20 flex items-center justify-between px-3 sm:px-6 shadow-[0_12px_24px_rgba(0,0,0,0.9),0_4px_12px_rgba(0,194,224,0.12)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f5d4]/50 shadow-[0_0_3px_rgba(0,245,212,0.8)]" />
                  <div className="flex gap-4">
                    <span className="hidden sm:inline-block text-[8px] uppercase font-bold tracking-[0.2em] text-[#a5f3fc]/20">
                      Tier {rowIndex + 1}
                    </span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f5d4]/50 shadow-[0_0_3px_rgba(0,245,212,0.8)]" />
                </div>

                {/* Ambient Deep Wall Shadow underneath ledge */}
                <div className="h-5 sm:h-6 w-full bg-gradient-to-b from-black/85 to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
        </section>

        {/* Shelf Footer Note */}
        <footer className="mt-14 sm:mt-20 text-center border-t border-[#00c2e0]/15 pt-8">
          <div className="inline-flex items-center gap-2 text-xs text-[#a5f3fc]/60">
            <Trophy className="w-4 h-4 text-[#00f5d4]" />
            <span>Thank you for making your voice heard for SPark Filmfare.</span>
          </div>
          <p className="text-[11px] text-[#a5f3fc]/40 mt-1">
            See you under the stars at {EVENT_DETAILS.venue}.
          </p>
        </footer>

        <div className="mt-10 sm:mt-12">
          <MovieRecommendationForm />
        </div>
      </div>
    </div>
  );
};
