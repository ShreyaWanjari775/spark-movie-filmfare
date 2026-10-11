import React from 'react';
import { X, Clock, Clapperboard } from 'lucide-react';
import type { Movie } from '../../types';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
  onSelectForVoting?: () => void;
  isSelected?: boolean;
}

export const MovieModal: React.FC<MovieModalProps> = ({ 
  movie, 
  onClose,
  onSelectForVoting,
  isSelected = false
}) => {
  if (!movie) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#050d1a] border border-[#00c2e0]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,194,224,0.3)] max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 text-[#a5f3fc] hover:text-white hover:bg-[#062831] border border-[#00c2e0]/20 transition-all"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Poster Image (Left / Top) */}
        <div className="relative w-full md:w-5/12 h-64 md:h-auto min-h-[260px] bg-[#02050b] flex-shrink-0">
          <img 
            src={movie.poster_url} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-[#050d1a]/50 to-[#050d1a]" />
          
          {/* Subtle Award Ribbon Accent */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#062831]/90 border border-[#00c2e0]/40 text-[10px] font-bold uppercase tracking-wider text-[#00f5d4] flex items-center gap-1.5 backdrop-blur-sm">
            <span>SPark Nominee</span>
          </div>
        </div>

        {/* Movie Details (Right / Bottom) */}
        <div className="p-6 md:p-8 flex flex-col justify-between flex-grow overflow-y-auto">
          <div className="space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#00c2e0]/15 text-[#00c2e0] border border-[#00c2e0]/30">
                  {movie.release_year}
                </span>
                {movie.duration && (
                  <span className="flex items-center gap-1 text-[11px] text-[#a5f3fc]/70 font-medium">
                    <Clock className="w-3 h-3 text-[#00f5d4]" />
                    {movie.duration}
                  </span>
                )}
              </div>
              <h3 className="font-['Cinzel',serif] text-xl sm:text-2xl font-bold text-white tracking-wide leading-tight">
                {movie.title}
              </h3>
              {movie.tagline && (
                <p className="text-xs italic text-[#00f5d4]/90 mt-1 font-serif">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Director */}
            <div className="flex items-center gap-2 text-xs text-[#a5f3fc]/80">
              <Clapperboard className="w-3.5 h-3.5 text-[#00c2e0]" />
              <span>Directed by <strong className="text-white">{movie.director}</strong></span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5">
              {movie.genres.map((g) => (
                <span 
                  key={g} 
                  className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#062831] text-[#a5f3fc] border border-[#00c2e0]/20"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#a5f3fc] mb-1.5">
                Storyline
              </h4>
              <p className="text-xs sm:text-sm text-[#e0f7fa]/80 leading-relaxed font-light">
                {movie.synopsis}
              </p>
            </div>
          </div>

          {/* Action button if provided */}
          {onSelectForVoting && (
            <div className="pt-6 mt-4 border-t border-[#00c2e0]/15">
              <button
                onClick={() => {
                  onSelectForVoting();
                  onClose();
                }}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-[#00f5d4] text-[#02050b] shadow-[0_0_20px_rgba(0,245,212,0.6)]'
                    : 'bg-gradient-to-r from-[#062831] via-[#00c2e0] to-[#00f5d4] text-white hover:shadow-[0_0_25px_rgba(0,194,224,0.5)]'
                }`}
              >
                {isSelected ? '✓ Selected in this Category' : 'Select as Nominee'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
