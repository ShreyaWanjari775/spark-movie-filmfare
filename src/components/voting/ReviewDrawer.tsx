import React, { useRef, useState } from 'react';
import { X, Check, AlertCircle, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import type { Category, Movie } from '../../types';
import { MOVIES } from '../../data/mockData';
import { submitAnonymousBallot } from '../../lib/votingData';

interface ReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedPicks: Record<string, string>; // categoryId -> movieId
  onCategoryClick: (categoryId: string) => void;
  onConfirmBallot?: () => void;
  hasAlreadyVoted?: boolean;
  onVoteSuccess?: () => void;
}

export const ReviewDrawer: React.FC<ReviewDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  selectedPicks,
  onCategoryClick,
  onConfirmBallot,
  hasAlreadyVoted = false,
  onVoteSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitInProgress = useRef(false);

  if (!isOpen) return null;

  const totalCategories = categories.length;
  const selectedCount = Object.keys(selectedPicks).length;
  const requiredCategories = categories.filter((category) => category.isRequired);
  const isComplete = selectedCount > 0 && requiredCategories.every((category) => selectedPicks[category.id]);

  // Helper to find movie object by id across all nominees
  const getMovieById = (movieId: string): Movie | undefined => {
    for (const cat of categories) {
      const found = cat.nominees.find((m) => m.id === movieId);
      if (found) return found;
    }
    return Object.values(MOVIES).find((m) => m.id === movieId);
  };

  const handleSubmit = async () => {
    if (!isComplete || submitInProgress.current || hasAlreadyVoted) return;

    submitInProgress.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitAnonymousBallot(selectedPicks, categories);

      if (result.success) {
        onVoteSuccess?.();
        onConfirmBallot?.();
      } else {
        setSubmitError(result.error || 'Failed to submit ballot. Please try again.');
      }
    } finally {
      submitInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[88vh] bg-[#050d1a] border border-[#00c2e0]/30 rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-[0_0_60px_rgba(0,194,224,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#00c2e0]/20 flex items-center justify-between bg-[#030712]/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-pulse" />
              <h3 className="font-['Cinzel',serif] text-lg sm:text-xl font-bold text-white tracking-wide">
                Ballot Review
              </h3>
            </div>
            <p className="text-xs text-[#a5f3fc]/70 mt-0.5">
              {selectedCount} of {totalCategories} categories selected
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#062831]/60 hover:bg-[#062831] text-[#a5f3fc] hover:text-white border border-[#00c2e0]/30 transition-all cursor-pointer"
            aria-label="Close review"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selections List */}
        <div className="p-6 overflow-y-auto space-y-3.5 divide-y divide-[#00c2e0]/10">
          {categories.map((category) => {
            const selectedMovieId = selectedPicks[category.id];
            const movie = selectedMovieId ? getMovieById(selectedMovieId) : null;

            return (
              <div
                key={category.id}
                className="pt-3.5 first:pt-0 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#062831]/20 p-2 rounded-xl transition-colors"
                onClick={() => {
                  onCategoryClick(category.id);
                  onClose();
                }}
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#00c2e0]">
                    {category.title}
                  </span>

                  {movie ? (
                    <div className="flex items-center gap-3 mt-1">
                      <div className="w-9 h-12 rounded bg-[#02050b] overflow-hidden flex-shrink-0 border border-[#00c2e0]/30">
                        <img
                          src={movie.poster_url}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-['Cinzel',serif] text-sm font-bold text-white truncate">
                          {movie.title}
                        </p>
                        <p className="text-[11px] text-[#a5f3fc]/60 truncate">
                          {movie.release_year} • Dir. {movie.director}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#f87171]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span className="italic">No film chosen yet</span>
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0">
                  {movie ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#062831] border border-[#00f5d4]/40 text-[10px] font-bold text-[#00f5d4]">
                      <Check className="w-3 h-3" />
                      Picked
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-[#3b1219]/60 border border-red-500/40 text-[10px] font-bold text-red-400">
                      Tap to Pick
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-[#00c2e0]/20 bg-[#030712]/90 space-y-3">
          {/* Status Banners */}
          {hasAlreadyVoted ? (
            <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#062831]/80 border border-[#00f5d4]/40 text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#00f5d4] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Ballot Already Recorded</p>
                <p className="text-[11px] text-[#a5f3fc]/70 mt-0.5">
                  You've already voted on this browser. Thank you for voting!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#062831]/40 border border-[#00c2e0]/20 text-[11px] text-[#a5f3fc]/80">
              <span>Anonymous voting • browser-based duplicate-vote deterrence</span>
              <span className="text-[10px] uppercase font-bold text-[#00f5d4] px-1.5 py-0.5 rounded bg-[#00f5d4]/10 border border-[#00f5d4]/30">
                Direct
              </span>
            </div>
          )}

          {/* Submission Error Banner */}
          {submitError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-100">Unable to Submit</p>
                <p className="text-[11px] text-red-300 mt-0.5 leading-relaxed">{submitError}</p>
              </div>
            </div>
          )}

          {!isComplete && !hasAlreadyVoted && (
            <p className="text-center text-xs text-[#a5f3fc]/70">
              Please complete all required categories before submitting your ballot.
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-[#062831]/50 hover:bg-[#062831] border border-[#00c2e0]/30 text-xs font-bold uppercase tracking-wider text-[#a5f3fc] transition-colors cursor-pointer"
            >
              Continue Voting
            </button>

            <button
              onClick={handleSubmit}
              disabled={!isComplete || isSubmitting || hasAlreadyVoted}
              className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                hasAlreadyVoted
                  ? 'bg-[#062831]/40 text-[#a5f3fc]/30 border border-white/5 cursor-not-allowed'
                  : isComplete && !isSubmitting
                  ? 'bg-gradient-to-r from-[#00c2e0] to-[#00f5d4] text-[#02050b] shadow-[0_0_25px_rgba(0,245,212,0.5)] cursor-pointer hover:shadow-[0_0_35px_rgba(0,245,212,0.7)]'
                  : 'bg-[#062831]/40 text-[#a5f3fc]/30 border border-white/5 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#02050b]" />
                  <span>Submitting...</span>
                </>
              ) : hasAlreadyVoted ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Already Voted</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Submit Ballot</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
