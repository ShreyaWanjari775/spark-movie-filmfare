import { useState, useEffect, useCallback } from 'react';
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
import { AuthModal } from './components/auth/AuthModal';
import { fetchVotingCategories } from './lib/votingData';
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
  const [forcePlayIntro, setForcePlayIntro] = useState(false);

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

  // Scroll to categories voting area
  const scrollToCategories = () => {
    const el = document.getElementById('categories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle final sealing of ballot (Phase 1 preview sequence)
  const handleConfirmBallot = () => {
    setIsReviewOpen(false);
    setIsPostVoteOpen(true);
  };

  // Trigger manual intro replay
  const handleReplayIntro = () => {
    setForcePlayIntro(true);
    setShowFlameIntro(true);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-[#e0f7fa] relative selection:bg-[#00c2e0]/30 selection:text-white">
      {/* 1. Cinematic Flame Intro — The Flame Awakens */}
      {showFlameIntro && (
        <FlameIntro 
          forcePlay={forcePlayIntro}
          onComplete={() => {
            setShowFlameIntro(false);
            setForcePlayIntro(false);
          }} 
        />
      )}

      {/* 2. Main Web Experience */}
      <div className={`transition-opacity duration-1000 ${showFlameIntro ? 'opacity-0' : 'opacity-100'}`}>
        {/* Navigation Bar */}
        <Navbar 
          onVoteClick={scrollToCategories} 
          onReplayIntro={handleReplayIntro}
        />

        <main>
          {/* Cinematic FnC Reveal Hero (The Star of the Experience) */}
          <HeroSection 
            onCastVoteClick={scrollToCategories}
            onExploreClick={scrollToCategories}
            eyebrow="SPARK CULTURAL COMMITTEE PRESENTS"
            heading="FnC MOVIE NIGHT"
            supportingLine="THE NIGHT BELONGS ON THE BIG SCREEN."
          />

          {/* Genre Award Categories & Movie Nominees (Loaded directly from Supabase) */}
          <GenreShowcase
            categories={categories}
            onMovieClick={(movie) => setInspectedMovie(movie)}
            selectedPicks={selectedPicks}
            onSelectMovie={handleSelectMovie}
            isLoading={isLoadingCategories}
            error={categoriesError}
            onRetry={loadCategories}
          />

          {/* FnC Cultural Event Teaser Banner */}
          <EventTeaserBanner onVoteClick={scrollToCategories} />

          {/* Rules & Fair Play Section */}
          <VotingRules />
        </main>

        {/* Footer */}
        <Footer />

        {/* Sticky Mobile/Desktop Voting Action Bar */}
        <FloatingVoteBar
          totalCategories={categories.length}
          selectedCount={Object.keys(selectedPicks).length}
          onReviewClick={() => setIsReviewOpen(true)}
        />

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
            scrollToCategories();
          }}
          onConfirmBallot={handleConfirmBallot}
        />

        {/* Post-Vote 3-Act Cinematic Teaser Sequence */}
        <PostVoteSequence
          isOpen={isPostVoteOpen}
          onClose={() => setIsPostVoteOpen(false)}
          selectedCount={Object.keys(selectedPicks).length}
        />

        {/* SPIT Student Verification & Sign-In Modal */}
        <AuthModal />
      </div>
    </div>
  );
}

export default App;
