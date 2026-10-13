import { useState, useEffect, useRef, useCallback } from 'react';
import { FlameIntro } from './components/common/FlameIntro';
import { Navbar } from './components/common/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { GenreShowcase } from './components/landing/GenreShowcase';
import { EventTeaserBanner } from './components/landing/EventTeaserBanner';
import { VotingRules } from './components/landing/VotingRules';
import { Footer } from './components/common/Footer';
import { FloatingVoteBar } from './components/voting/FloatingVoteBar';
import { MovieModal } from './components/common/MovieModal';
import { ReviewDrawer } from './components/voting/ReviewDrawer';
import { PostVoteSequence } from './components/postvote/PostVoteSequence';
import { fetchVotingCategories } from './lib/votingData';
import { hasAlreadyVoted } from './lib/votingStorage';
import type { Category, Movie } from './types';

export function App() {
  // Flame Intro: checked once per session or forced via replay
  const [showFlameIntro, setShowFlameIntro] = useState(() => {
    // Check session storage; if not seen, show intro
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('spark_intro_seen') !== 'true';
    }
    return true;
  });
  const [view, setView] = useState<'home' | 'event' | 'voting' | 'rules'>('home');
  const [returnView, setReturnView] = useState<'event' | 'voting'>('voting');

  // Dynamic Supabase Categories & Nominees state
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Voting ballot state: categoryId -> movieId (nomineeId)
  const [selectedPicks, setSelectedPicks] = useState<Record<string, string>>({});

  // Active modal movie inspection
  const [inspectedMovie, setInspectedMovie] = useState<Movie | null>(null);

  // Modal drawers
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isPostVoteOpen, setIsPostVoteOpen] = useState(false);
  const [hasVoted, setHasVoted] = useState(hasAlreadyVoted);

  // Fetch active categories and eligible nominees from Supabase
  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    setCategoriesError(null);
    try {
      const data = await fetchVotingCategories();
      setCategories(data);
    } catch (err: unknown) {
      console.error('Error fetching Supabase voting categories:', err);
      const message = err instanceof Error ? err.message : 'Failed to connect to voting database.';
      setCategoriesError(message);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  // Scroll progress bar: writes --scroll-pct CSS variable via rAF (no setState per frame)
  const rafIdRef = useRef<number>(0);
  useEffect(() => {
    if (view !== 'voting') {
      // Reset when leaving voting view
      document.documentElement.style.setProperty('--scroll-pct', '0');
      return;
    }

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      const pct = max > 0 ? scrollTop / max : 0;
      document.documentElement.style.setProperty('--scroll-pct', String(pct));
      rafIdRef.current = 0; // mark as idle
    };

    const onScroll = () => {
      if (rafIdRef.current === 0) {
        rafIdRef.current = requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // set initial value

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      document.documentElement.style.setProperty('--scroll-pct', '0');
    };
  }, [view]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Toggle or select movie for category
  const handleSelectMovie = (categoryId: string, movieId: string) => {
    setSelectedPicks((prev) => {
      if (prev[categoryId] === movieId) {
        // Deselect if clicked again
        const updated = { ...prev };
        delete updated[categoryId];
        return updated;
      }
      return {
        ...prev,
        [categoryId]: movieId
      };
    });
  };

  const navigateToView = (nextView: 'home' | 'event' | 'voting' | 'rules') => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openRules = (fromView: 'event' | 'voting') => {
    setReturnView(fromView);
    navigateToView('rules');
  };

  // Handle final sealing of ballot (Phase 1 preview sequence)
  const handleConfirmBallot = () => {
    setIsReviewOpen(false);
    setIsPostVoteOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-[#e0f7fa] relative selection:bg-[#00c2e0]/30 selection:text-white">
      {/* 1. Cinematic Flame Intro — The Flame Awakens */}
      {showFlameIntro && (
        <FlameIntro 
          onComplete={() => {
            setShowFlameIntro(false);
          }} 
        />
      )}

      {/* 2. Main Web Experience */}
      <div className={`transition-opacity duration-1000 ${showFlameIntro ? 'opacity-0' : 'opacity-100'}`}>
        {/* Navigation Bar */}
        <Navbar 
          onHomeClick={() => navigateToView('home')}
          onEventClick={() => navigateToView('event')}
          onAwardsClick={() => navigateToView('voting')}
        />

        <main>
          {view === 'home' && (
            <HeroSection
              onCastVoteClick={() => navigateToView('voting')}
              onExploreClick={() => navigateToView('event')}
              eyebrow="SPARK EDITORIAL COMMITTEE PRESENTS"
              heading="MOVIE FILMFARE"
              supportingLine="FNC MOVIE NIGHT AWARDS"
              tagline="Every genre has a legend. Every legend deserves its moment."
              description="The ultimate college cinema ballot. Pick your champions across genre categories, then watch the winners take the spotlight at Movie Night."
            />
          )}

          {view === 'event' && (
            <>
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pt-8 sm:px-6 lg:px-8">
                <h1 className="font-['Cinzel',serif] text-xl font-bold text-white">The Event</h1>
                <button type="button" onClick={() => openRules('event')} className="rounded-lg border border-[#00c2e0]/35 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#a5f3fc] transition hover:border-[#00f5d4]/60 hover:text-white">Voting Rules</button>
              </div>
              <EventTeaserBanner onVoteClick={() => navigateToView('voting')} />
              <Footer />
            </>
          )}

          {view === 'voting' && (
            <>
              {/* Thin scroll-progress bar driven by CSS var --scroll-pct */}
              <div className="scroll-progress-bar" aria-hidden="true" />
              <div id="categories" className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 pt-8 sm:px-6 lg:px-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00f5d4]">SPark Movie Filmfare</p>
                  <h1 className="mt-1 font-['Cinzel',serif] text-2xl font-bold text-white">Choose your champions</h1>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => openRules('voting')} className="rounded-lg border border-[#00c2e0]/35 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#a5f3fc] transition hover:border-[#00f5d4]/60 hover:text-white">Voting Rules</button>
                  <button type="button" onClick={() => navigateToView('home')} className="rounded-lg border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#a5f3fc]/70 transition hover:border-[#00c2e0]/40 hover:text-white">Home</button>
                </div>
              </div>
              {isLoadingCategories || categoriesError || categories.length === 0 ? (
                <GenreShowcase
                  categories={categories}
                  onMovieClick={(movie) => setInspectedMovie(movie)}
                  selectedPicks={selectedPicks}
                  onSelectMovie={handleSelectMovie}
                  isLoading={isLoadingCategories}
                  error={categoriesError}
                  onRetry={loadCategories}
                  showCategoryTabs={false}
                />
              ) : (
                categories.map((category) => (
                  <GenreShowcase
                    key={category.id}
                    categories={[category]}
                    onMovieClick={(movie) => setInspectedMovie(movie)}
                    selectedPicks={selectedPicks}
                    onSelectMovie={handleSelectMovie}
                    showIntro={false}
                    showCategoryTabs={false}
                  />
                ))
              )}
            </>
          )}

          {view === 'rules' && (
            <>
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pt-8 sm:px-6 lg:px-8">
                <h1 className="font-['Cinzel',serif] text-xl font-bold text-white">Voting Rules</h1>
                <button type="button" onClick={() => navigateToView(returnView)} className="rounded-lg border border-[#00c2e0]/35 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#a5f3fc] transition hover:border-[#00f5d4]/60 hover:text-white">Back</button>
              </div>
              <VotingRules />
            </>
          )}
        </main>

        {view === 'home' && <EventTeaserBanner onVoteClick={() => navigateToView('voting')} />}

        {/* Sticky Mobile/Desktop Voting Action Bar */}
        {view === 'voting' && (
          <FloatingVoteBar
            totalCategories={categories.length}
            selectedCount={Object.keys(selectedPicks).length}
            requiredCount={categories.filter((category) => category.isRequired).length}
            selectedRequiredCount={categories.filter((category) => category.isRequired && selectedPicks[category.id]).length}
            onReviewClick={() => setIsReviewOpen(true)}
          />
        )}

        {/* Movie Synopsis & Details Modal */}
        <MovieModal
          movie={inspectedMovie}
          onClose={() => setInspectedMovie(null)}
        />

        {/* Ballot Review Drawer */}
        <ReviewDrawer
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          categories={categories}
          selectedPicks={selectedPicks}
          onCategoryClick={() => {
            navigateToView('voting');
          }}
          onConfirmBallot={handleConfirmBallot}
          hasAlreadyVoted={hasVoted}
          onVoteSuccess={() => setHasVoted(true)}
        />

        {/* Post-Vote 3-Act Cinematic Teaser Sequence */}
        <PostVoteSequence
          isOpen={isPostVoteOpen}
          onClose={() => setIsPostVoteOpen(false)}
          selectedCount={Object.keys(selectedPicks).length}
        />

      </div>
    </div>
  );
}

export default App;
