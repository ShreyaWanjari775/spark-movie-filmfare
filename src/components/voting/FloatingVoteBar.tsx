import React from 'react';
import { Award, ChevronRight } from 'lucide-react';

interface FloatingVoteBarProps {
  totalCategories: number;
  selectedCount: number;
  requiredCount: number;
  selectedRequiredCount: number;
  onReviewClick: () => void;
}

export const FloatingVoteBar: React.FC<FloatingVoteBarProps> = ({
  totalCategories,
  selectedCount,
  requiredCount,
  selectedRequiredCount,
  onReviewClick
}) => {
  const percentage = Math.round((selectedCount / totalCategories) * 100);
  const isComplete = selectedCount > 0 && selectedRequiredCount === requiredCount;

  return (
    <aside 
      aria-label="Ballot submission progress"
      className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 bg-gradient-to-t from-[#02050b] via-[#030712]/95 to-transparent pointer-events-none animate-slide-up-bar"
    >
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <div className="p-3 sm:p-4 rounded-2xl bg-[#050d1a]/95 border border-[#00c2e0]/35 backdrop-blur-xl shadow-[0_0_35px_rgba(0,194,224,0.3)] flex items-center justify-between gap-4">
          
          {/* Left: Progress info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#a5f3fc] flex items-center gap-1.5 truncate">
                <Award className="w-3.5 h-3.5 text-[#00f5d4] flex-shrink-0" />
                <span>Your Ballot Progress</span>
              </span>
              <span className="text-xs font-extrabold text-white">
                <span className="text-[#00f5d4]">{selectedCount}</span> / {totalCategories} Genres
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[#062831] overflow-hidden border border-[#00c2e0]/20">
              <div 
                className="h-full bg-gradient-to-r from-[#062831] via-[#00c2e0] to-[#00f5d4] transition-all duration-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Right: Review CTA */}
          <button
            onClick={onReviewClick}
            className={`flex-shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
              isComplete
                ? 'bg-gradient-to-r from-[#00c2e0] to-[#00f5d4] text-[#02050b] shadow-[0_0_20px_rgba(0,245,212,0.6)] animate-pulse'
                : selectedCount > 0
                ? 'bg-[#062831] hover:bg-[#00c2e0]/30 text-white border border-[#00c2e0]/40'
                : 'bg-[#062831]/50 text-[#a5f3fc]/40 border border-white/5 cursor-not-allowed'
            }`}
            disabled={selectedCount === 0}
          >
            <span>{isComplete ? 'Review Ballot' : 'Review Picks'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
