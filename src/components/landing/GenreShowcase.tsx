import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, Info, Check, Rocket, Ghost, Flame, Eye, Smile, Clapperboard, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Category, Movie } from '../../types';
import { Reveal } from '../common/Reveal';

interface GenreShowcaseProps {
  categories: Category[];
  onMovieClick: (movie: Movie) => void;
  selectedPicks: Record<string, string>; // categoryId -> movieId
  onSelectMovie: (categoryId: string, movieId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  showIntro?: boolean;
  showCategoryTabs?: boolean;
}

export const GenreShowcase: React.FC<GenreShowcaseProps> = ({
  categories,
  onMovieClick,
  selectedPicks,
  onSelectMovie,
  isLoading = false,
  error = null,
  onRetry,
  showIntro = true,
  showCategoryTabs = true,
}) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeNomineeIndex, setActiveNomineeIndex] = useState(0);

  // Guard active index within bounds
  const safeIndex = categories.length > 0 ? Math.min(activeCategoryIndex, categories.length - 1) : 0;
  const currentCategory = categories[safeIndex];
  const carouselCards = currentCategory
    ? [
        ...currentCategory.nominees.map((movie) => ({ key: movie.id, movie, isPlaceholder: false as const })),
        ...Array.from(
          { length: Math.max(0, 6 - currentCategory.nominees.length) },
          (_, index) => ({ key: `${currentCategory.id}-nominee-slot-${index}`, movie: null, isPlaceholder: true as const })
        ),
      ]
    : [];
  const safeNomineeIndex = Math.min(activeNomineeIndex, Math.max(0, carouselCards.length - 1));

  const moveNominee = (direction: -1 | 1) => {
    if (carouselCards.length === 0) return;
    setActiveNomineeIndex((index) => (index + direction + carouselCards.length) % carouselCards.length);
  };

  // ── Drag / swipe support ─────────────────────────────────────────────────
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const DRAG_THRESHOLD = 50; // px needed to trigger a slide

  const onDragStart = useCallback((clientX: number) => {
    dragStartX.current = clientX;
    isDragging.current = false;
  }, []);

  const onDragEnd = useCallback((clientX: number) => {
    if (dragStartX.current === null) return;
    const delta = clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      isDragging.current = true; // flag to suppress click handlers
      moveNominee(delta < 0 ? 1 : -1);
      // Reset the flag after the synthetic click event has been processed
      setTimeout(() => { isDragging.current = false; }, 0);
    }
  }, [carouselCards.length]); // eslint-disable-line react-hooks/exhaustive-deps

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
    <section id={showCategoryTabs ? 'categories' : undefined} className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      {showIntro && <div className="text-center max-w-3xl mx-auto mb-12">
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
      </div>}

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
            Nominations are currently being finalized by the SPark Editorial Committee. Please check back soon.
          </p>
        </div>
      )}

      {/* 4. SUCCESS POPULATED STATE */}
      {!isLoading && !error && currentCategory && (
        <>
          {/* Genre Category Pills / Tabs (Horizontally scrollable on mobile) */}
          {showCategoryTabs && <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
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
          </div>}

          {/* Active Category Description Header — re-keyed so Reveal re-fires on category switch */}
          <Reveal key={`header-${currentCategory.id}`} delay={0} className="w-full">
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
          </Reveal>

          {/* Featured nominee carousel */}
          <div
            className="relative mx-auto mt-8 h-[440px] max-w-5xl overflow-hidden sm:h-[470px] select-none"
            style={{ cursor: 'grab' }}
            /* Mouse drag */
            onMouseDown={(e) => onDragStart(e.clientX)}
            onMouseUp={(e) => onDragEnd(e.clientX)}
            onMouseLeave={() => { dragStartX.current = null; }}
            /* Touch swipe */
            onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
            onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
          >
            {carouselCards.map((card, index) => {
              // Wrap offset to shortest circular distance for infinite-loop carousel
              const n = carouselCards.length;
              const rawOffset = index - safeNomineeIndex;
              const normalizedOffset = n > 1 ? ((rawOffset % n) + n) % n : 0;
              const offset = normalizedOffset > n / 2 ? normalizedOffset - n : normalizedOffset;
              const isVisible = Math.abs(offset) <= 1;
              const isActive = offset === 0;
              const movie = card.movie;
              const isSelected = movie !== null && selectedPicks[currentCategory.id] === movie.id;

              return (
                <article
                  key={card.key}
                  aria-hidden={!isVisible}
                  inert={!isVisible}
                  className={`absolute top-2 left-1/2 flex h-[410px] w-[min(78vw,290px)] flex-col overflow-hidden rounded-xl border transition-[translate,transform,opacity,border-color,box-shadow] duration-500 ease-out sm:h-[438px] ${
                    card.isPlaceholder
                      ? 'border-[#00c2e0]/15 bg-[#050d1a]/90'
                      : isSelected
                        ? 'border-[#00f5d4] bg-[#050d1a] shadow-[0_0_34px_rgba(0,245,212,0.35)] nominee-selected-ring'
                        : 'border-[#00c2e0]/25 bg-[#050d1a]'
                  } ${isActive && !card.isPlaceholder ? 'ring-1 ring-[#00f5d4]/55 shadow-[0_0_28px_rgba(0,194,224,0.25)]' : ''}`}
                  style={{
                    translate: `${offset * 108}% 0`,
                    transform: `translateX(-50%) scale(${isActive ? 1 : 0.88})`,
                    opacity: isVisible ? (isActive ? 1 : 0.58) : 0,
                    zIndex: isActive ? 3 : 2 - Math.abs(offset),
                    pointerEvents: isVisible ? 'auto' : 'none',
                  }}
                >
                  {movie ? (
                    <>
                      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#02050b]">
                        <img
                          src={movie.poster_url}
                          alt={movie.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={(event) => { event.currentTarget.style.opacity = '0.3'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a] via-transparent to-transparent opacity-90" />
                        <div className="absolute right-3 top-3 z-10">
                          <button
                            type="button"
                            onClick={() => onMovieClick(movie)}
                            className="rounded-full border border-[#00c2e0]/35 bg-black/65 p-1.5 text-[#a5f3fc] transition hover:bg-[#062831] hover:text-white"
                            title="Read synopsis"
                            aria-label={`Read synopsis for ${movie.title}`}
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {isSelected && (
                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#00c2e0] to-[#00f5d4] py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#02050b]">
                            <Check className="h-3.5 w-3.5 stroke-[3]" /> Selected for {currentCategory.title}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          <h4 className="line-clamp-2 font-['Cinzel',serif] text-base font-bold leading-tight text-white">{movie.title}</h4>
                          {movie.movie && (
                            <h5 className="mt-1 line-clamp-2 text-sm font-semibold leading-tight text-[#a5f3fc]/80">
                              {movie.movie}
                            </h5>
                          )}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => onSelectMovie(currentCategory.id, movie.id)}
                            className={`flex-1 rounded-lg py-2.5 text-[11px] font-bold uppercase tracking-wider transition ${
                              isSelected
                                ? 'bg-[#00f5d4] text-[#02050b]'
                                : 'bg-[#062831] text-[#a5f3fc] hover:bg-[#00c2e0]/25 hover:text-white'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Vote Now'}
                          </button>
                          <button
                            type="button"
                            onClick={() => onMovieClick(movie)}
                            className="rounded-lg border border-[#00c2e0]/20 bg-[#050d1a] p-2.5 text-[#a5f3fc] transition hover:bg-[#062831] hover:text-white"
                            title="Movie details"
                            aria-label={`Movie details for ${movie.title}`}
                          >
                            <Info className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative flex aspect-[4/3] w-full shrink-0 items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,_rgba(0,194,224,0.18),_transparent_65%),linear-gradient(145deg,#071524,#02050b)]">
                        <div className="absolute inset-3 rounded-lg border border-dashed border-[#00c2e0]/25" />
                        <img src="/spark-logo.png" alt="" aria-hidden="true" className="h-16 w-12 object-contain opacity-35" />
                        <span className="absolute bottom-3 left-3 rounded bg-black/40 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#a5f3fc]/65">Nominee slot</span>
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          <h4 className="font-['Cinzel',serif] text-base font-bold text-[#a5f3fc]/60">Nominee details pending</h4>
                          <p className="mt-2 text-xs leading-relaxed text-[#a5f3fc]/45">This display slot is not an eligible nominee and cannot be selected.</p>
                        </div>
                        <button type="button" disabled className="mt-3 w-full cursor-not-allowed rounded-lg border border-white/5 bg-[#062831]/45 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#a5f3fc]/35">Coming Soon</button>
                      </div>
                    </>
                  )}
                </article>
              );
            })}

            {carouselCards.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => moveNominee(-1)}
                  aria-label="Previous nominee card"
                  className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#00c2e0]/30 bg-[#030712]/85 p-2.5 text-[#a5f3fc] shadow-lg transition hover:border-[#00f5d4]/60 hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveNominee(1)}
                  aria-label="Next nominee card"
                  className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#00c2e0]/30 bg-[#030712]/85 p-2.5 text-[#a5f3fc] shadow-lg transition hover:border-[#00f5d4]/60 hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          <Reveal delay={80} className="w-full">
          <div className="mt-2 flex items-center justify-center gap-2" aria-label="Carousel position">
            {carouselCards.map((card, index) => (
              <button
                key={card.key}
                type="button"
                onClick={() => setActiveNomineeIndex(index)}
                aria-label={card.movie ? `Show ${card.movie.title}` : `Show nominee placeholder ${index + 1}`}
                aria-current={index === safeNomineeIndex ? 'true' : undefined}
                className={`h-1.5 rounded-full transition-all ${index === safeNomineeIndex ? 'w-6 bg-[#00f5d4]' : 'w-1.5 bg-[#00c2e0]/40 hover:bg-[#00c2e0]'}`}
              />
            ))}
          </div>
          </Reveal>
        </>
      )}
    </section>
  );
};
