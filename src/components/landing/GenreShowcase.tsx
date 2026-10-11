import React, { useState } from 'react';
import { Sparkles, Info, Check, Rocket, Ghost, Flame, Eye, Smile, Clapperboard, RefreshCw, AlertCircle } from 'lucide-react';
import type { Category, Movie } from '../../types';

interface GenreShowcaseProps {
  categories: Category[];
  onMovieClick: (movie: Movie) => void;
  selectedPicks: Record<string, string>; // categoryId -> movieId
  onSelectMovie: (categoryId: string, movieId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const GenreShowcase: React.FC<GenreShowcaseProps> = ({
  categories,
  onMovieClick,
  selectedPicks,
  onSelectMovie,
  isLoading = false,
  error = null,
  onRetry,
}) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  // Guard active index within bounds
  const safeIndex = categories.length > 0 ? Math.min(activeCategoryIndex, categories.length - 1) : 0;
  const currentCategory = categories[safeIndex];

  const getGenreIcon = (iconName: string) => {
    switch (iconName) {
      case 'Rocket': return <Rocket className="w-4 h-4" />;
      case 'Ghost': return <Ghost className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'Eye': return <Eye className="w-4 h-4" />;
      case 'Smile': return <Smile className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#062831]/60 border border-[#00c2e0]/30 text-[#00f5d4] text-[11px] uppercase tracking-widest font-semibold mb-3">
          <Clapperboard className="w-3.5 h-3.5" />
          <span>Genre-Based Nominations</span>
        </div>
        <h2 className="font-['Cinzel',serif] text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide mb-4">
          Nominated Masterpieces
        </h2>
        <p className="text-sm sm:text-base text-[#a5f3fc]/70 font-light">
          Every nominee is a celebrated film. Select one movie per genre. Notice: A movie may compete in multiple categories!
        </p>
      </div>

      {/* 1. LOADING STATE */}
      {isLoading && (
        <div className="space-y-8 animate-pulse">
          {/* Skeleton category pills */}
          <div className="flex items-center justify-start sm:justify-center gap-3 overflow-x-auto pb-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-10 w-28 rounded-full bg-[#062831]/60 border border-[#00c2e0]/20 flex-shrink-0"
              />
            ))}
          </div>

          {/* Skeleton category banner */}
          <div className="p-6 rounded-2xl bg-[#050d1a]/80 border border-[#00c2e0]/20 flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-48 rounded bg-[#062831]" />
              <div className="h-4 w-72 rounded bg-[#062831]/60" />
            </div>
            <div className="h-8 w-32 rounded bg-[#062831]" />
          </div>

          {/* Skeleton cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-[#050d1a]/80 border border-[#00c2e0]/20 aspect-[2/3] flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-2 text-[#a5f3fc]/40">
                  <Sparkles className="w-6 h-6 animate-spin text-[#00c2e0]" />
                  <span className="text-xs uppercase tracking-widest font-semibold">Loading Nominees...</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ERROR STATE */}
      {!isLoading && error && (
        <div className="p-8 rounded-2xl bg-[#140608]/80 border border-red-500/30 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-['Cinzel',serif] text-lg font-bold text-white mb-1">
              Unable to Load Categories
            </h3>
            <p className="text-xs text-[#a5f3fc]/70 leading-relaxed">
              {error}
            </p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#062831] hover:bg-[#00c2e0]/20 border border-[#00c2e0]/40 text-xs font-bold uppercase tracking-wider text-[#a5f3fc] hover:text-white transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
        </div>
      )}

      {/* 3. EMPTY STATE */}
      {!isLoading && !error && categories.length === 0 && (
        <div className="p-10 rounded-2xl bg-[#050d1a]/80 border border-[#00c2e0]/20 text-center max-w-md mx-auto space-y-3">
          <Clapperboard className="w-8 h-8 text-[#00c2e0] mx-auto opacity-70" />
          <h3 className="font-['Cinzel',serif] text-base font-bold text-white">
            No Active Categories Available
          </h3>
          <p className="text-xs text-[#a5f3fc]/60">
            Nominations are currently being finalized by the SPark Cultural Committee. Please check back soon.
          </p>
        </div>
      )}

      {/* 4. SUCCESS POPULATED STATE */}
      {!isLoading && !error && currentCategory && (
        <>
          {/* Genre Category Pills / Tabs (Horizontally scrollable on mobile) */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {categories.map((cat, idx) => {
              const isActive = idx === safeIndex;
              const isSelectedInCat = !!selectedPicks[cat.id];
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryIndex(idx)}
                  className={`flex-shrink-0 flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#062831] via-[#00c2e0]/30 to-[#00f5d4]/20 border-[#00f5d4] text-white shadow-[0_0_20px_rgba(0,194,224,0.4)]'
                      : 'bg-[#050d1a]/60 border-[#00c2e0]/20 text-[#a5f3fc]/70 hover:border-[#00c2e0]/40 hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-[#00f5d4]' : 'text-[#00c2e0]'}>
                    {getGenreIcon(cat.icon)}
                  </span>
                  <span>{cat.title}</span>
                  {isSelectedInCat && (
                    <span className="w-2 h-2 rounded-full bg-[#00f5d4] shadow-[0_0_8px_#00f5d4]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Category Description Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#050d1a] via-[#062831]/40 to-[#050d1a] border border-[#00c2e0]/20 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[#00f5d4]">{getGenreIcon(currentCategory.icon)}</span>
                <h3 className="font-['Cinzel',serif] text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {currentCategory.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#00c2e0] mt-1 font-medium">
                {currentCategory.tagline}
              </p>
              <p className="text-xs text-[#a5f3fc]/60 mt-1 max-w-2xl">
                {currentCategory.description}
              </p>
            </div>

            <div className="flex-shrink-0 px-3.5 py-1.5 rounded-lg bg-[#030712] border border-[#00c2e0]/30 text-xs text-[#a5f3fc]">
              <span className="text-white font-bold">{currentCategory.nominees.length}</span> Nominated Films
            </div>
          </div>

          {/* Nominees Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentCategory.nominees.map((movie) => {
              const isSelected = selectedPicks[currentCategory.id] === movie.id;

              return (
                <div
                  key={movie.id}
                  className={`group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-[#062831]/80 border-[#00f5d4] shadow-[0_0_30px_rgba(0,245,212,0.35)] scale-[1.01]'
                      : 'bg-[#050d1a]/80 border-[#00c2e0]/20 hover:border-[#00c2e0]/50 hover:shadow-[0_0_20px_rgba(0,194,224,0.2)]'
                  }`}
                >
                  {/* Poster Image Container */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#02050b]">
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        // Graceful fallback to dark cinema gradient if image URL fails
                        const target = e.currentTarget;
                        target.style.opacity = '0.3';
                      }}
                    />

                    {/* Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a] via-transparent to-transparent opacity-90" />

                    {/* Top Corner Pill: Year & Quick Info */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-[#a5f3fc] border border-white/10">
                        {movie.release_year || 2024}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMovieClick(movie);
                        }}
                        className="p-1.5 rounded-full bg-black/60 hover:bg-[#062831] text-[#a5f3fc] hover:text-white border border-[#00c2e0]/30 transition-all backdrop-blur-md"
                        title="Read Synopsis"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Selected Indicator Ribbon */}
                    {isSelected && (
                      <div className="absolute inset-x-0 bottom-0 py-1.5 bg-gradient-to-r from-[#00c2e0] to-[#00f5d4] text-[#02050b] text-[11px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_#00f5d4]">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Selected for {currentCategory.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="font-['Cinzel',serif] text-base font-bold text-white group-hover:text-[#a5f3fc] transition-colors line-clamp-1 mb-1">
                        {movie.title}
                      </h4>
                      <p className="text-xs text-[#a5f3fc]/60 mb-2">
                        Dir. {movie.director}
                      </p>
                      <p className="text-xs text-[#e0f7fa]/70 line-clamp-2 leading-relaxed font-light mb-4">
                        {movie.synopsis}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => onSelectMovie(currentCategory.id, movie.id)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                          isSelected
                            ? 'bg-[#00f5d4] text-[#02050b] shadow-[0_0_15px_rgba(0,245,212,0.4)]'
                            : 'bg-[#062831] hover:bg-[#00c2e0]/20 text-[#a5f3fc] hover:text-white border border-[#00c2e0]/30 hover:border-[#00c2e0]/60'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Selected
                          </>
                        ) : (
                          'Vote Movie'
                        )}
                      </button>

                      <button
                        onClick={() => onMovieClick(movie)}
                        className="p-2.5 rounded-xl bg-[#050d1a] hover:bg-[#062831] border border-[#00c2e0]/20 text-[#a5f3fc] hover:text-white transition-colors"
                        title="Movie Details"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};
