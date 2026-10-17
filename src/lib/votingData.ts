import { supabase } from './supabase';
import { hasAlreadyVoted, markBallotSubmitted, saveSubmittedPicks } from './votingStorage';
import { MOVIES } from '../data/mockData';
import type { Category, Movie } from '../types';
import type { SubmittedPick } from '../types/shelf';

interface DatabaseCategory {
  id: string;
  name: string;
  is_required: boolean;
  is_active: boolean;
}

interface DatabaseNominee {
  id: string;
  category_id: string;
  title: string;
  movie: string | null;
  is_eligible: boolean;
}

// Sensible genre-specific metadata for icons, taglines, and poster fallbacks
const GENRE_METADATA: Record<string, {
  tagline: string;
  description: string;
  icon: string;
  poster: string;
}> = {
  horror: {
    tagline: 'Spine-Chilling Nightmares',
    description: 'The most gripping, dread-inducing cinematic experiences that made hearts pound.',
    icon: 'Ghost',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
  },
  action: {
    tagline: 'Pure Adrenaline & Spectacle',
    description: 'Pulse-pounding stunts, relentless pacing, and masterfully choreographed set-pieces.',
    icon: 'Flame',
    poster: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
  },
  comedy: {
    tagline: 'Wit, Charm & Crowd Roars',
    description: 'Films that brought contagious laughter, clever satire, and unforgettable punchlines.',
    icon: 'Smile',
    poster: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?q=80&w=800&auto=format&fit=crop',
  },
  'sci-fi': {
    tagline: 'Visions of the Cosmos & Beyond',
    description: 'Honouring mind-expanding speculative universes, cosmic odysseys, and technological wonders.',
    icon: 'Rocket',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
  },
  scifi: {
    tagline: 'Visions of the Cosmos & Beyond',
    description: 'Honouring mind-expanding speculative universes, cosmic odysseys, and technological wonders.',
    icon: 'Rocket',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
  },
  romance: {
    tagline: 'Passion, Heartache & Chemistry',
    description: 'Stories celebrating love, intimacy, and the emotional resonance of human connection.',
    icon: 'Sparkles',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
  },
  thriller: {
    tagline: 'High Stakes & Psychological Edge',
    description: 'Edge-of-the-seat tension, intricate plotting, and psychological suspense.',
    icon: 'Eye',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
  },
};

export async function fetchVotingCategories(): Promise<Category[]> {
  const { data: categories, error: categoryError } = await supabase
    .from('categories')
    .select('id, name, is_required, is_active')
    .eq('is_active', true)
    .order('name');

  if (categoryError) {
    throw new Error(`Could not load categories: ${categoryError.message}`);
  }

  if (!categories || categories.length === 0) {
    return [];
  }

  const { data: nominees, error: nomineeError } = await supabase
    .from('nominees')
    .select('id, category_id, title, movie, is_eligible')
    .eq('is_eligible', true);

  if (nomineeError) {
    throw new Error(`Could not load nominees: ${nomineeError.message}`);
  }

  const databaseCategories = categories as DatabaseCategory[];
  const databaseNominees = (nominees ?? []) as DatabaseNominee[];

  return databaseCategories.map((category) => {
    const categoryNominees = databaseNominees.filter(
      (nominee) => nominee.category_id === category.id
    );

    const genreKey = category.name.trim().toLowerCase();
    const meta = GENRE_METADATA[genreKey] || {
      tagline: 'THE NOMINEES ARE IN.',
      description: `Explore the official nominees for ${category.name}.`,
      icon: 'Sparkles',
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    };

    const formattedTitle = category.name;

    const movies: Movie[] = categoryNominees.map((nominee) => ({
      id: nominee.id,
      title: nominee.title,
      movie: nominee.movie,
      release_year: 2024,
      poster_url: meta.poster,
      synopsis: `Official nomination for ${nominee.title} in the ${formattedTitle} category. Final winners unveiled live during FnC Movie Night.`,
      director: 'Festival Selection',
      genres: [category.name],
      duration: 'Feature Film',
      tagline: nominee.title,
    }));

    return {
      id: category.id,
      title: formattedTitle,
      isRequired: category.is_required,
      tagline: meta.tagline,
      description: meta.description,
      icon: meta.icon,
      nominees: movies,
    };
  });
}

export async function submitMovieRecommendation(
  recommendation: string
): Promise<{ success: boolean; error?: string }> {
  const movieRec = recommendation.trim();
  if (!movieRec) {
    return { success: false, error: 'Please enter a movie recommendation.' };
  }

  try {
    const { error } = await supabase
      .from('recs')
      .insert({ movie_rec: movieRec });

    if (error) {
      console.warn('Movie recommendation submission error:', error);
      return { success: false, error: error.message || 'Could not submit your recommendation.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error submitting movie recommendation:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network or connection error. Please try again.',
    };
  }
}

export interface SubmitBallotResult {
  success: boolean;
  ballotId?: string;
  error?: string;
}

/**
 * Submits an anonymous ballot via the atomic Supabase PostgreSQL function `submit_ballot`.
 * Handles client deterrence check, RPC payload generation, and persists browser marker ONLY upon confirmed success.
 */
export async function submitAnonymousBallot(
  picks: Record<string, string>,
  categories: Category[]
): Promise<SubmitBallotResult> {
  // 1. Guard against casual duplicate submissions on the current browser
  if (hasAlreadyVoted()) {
    return {
      success: false,
      error: "You have already voted on this browser. Thank you for your participation!",
    };
  }

  // 2. Validate that each category has a selection
  const missingCategories = categories.filter((cat) => cat.isRequired && !picks[cat.id]);
  if (missingCategories.length > 0) {
    return { success: false, error: `Please complete all required categories (${missingCategories.length} remaining).` };
  }

  if (Object.keys(picks).length === 0) {
    return { success: false, error: 'Please select at least one nominee before submitting.' };
  }

  // 3. Format payload for the submit_ballot database RPC
  const choices = Object.entries(picks).map(([categoryId, nomineeId]) => ({
    category_id: categoryId,
    nominee_id: nomineeId,
  }));

  try {
    const { data, error } = await supabase.rpc('submit_ballot', { p_choices: choices });

    if (error) {
      console.warn('Ballot submission RPC error:', error);
      return {
        success: false,
        error: error.message || 'Ballot submission failed. Please try again.',
      };
    }

    const res = data as { success?: boolean } | null;
    if (!res || !res.success) {
      return {
        success: false,
        error: 'Ballot was rejected by database validation.',
      };
    }

    // 4. Mark successful ballot in localStorage ONLY AFTER confirmed database insert
    markBallotSubmitted();

    const savedAt = new Date().toISOString();
    const snapshotPicks: SubmittedPick[] = categories.map((cat) => {
      const nomineeId = picks[cat.id];
      let nominee = nomineeId ? cat.nominees.find((n) => n.id === nomineeId) : undefined;
      if (!nominee && nomineeId) {
        nominee = Object.values(MOVIES).find((m) => m.id === nomineeId);
      }

      return {
        categoryId: cat.id,
        categoryTitle: cat.title,
        nomineeId: nomineeId || '',
        nomineeTitle: nominee?.title || '',
        posterUrl: nominee?.poster_url || '',
        savedAt,
      };
    });

    saveSubmittedPicks(snapshotPicks);

    return { success: true };
  } catch (err) {
    console.error('Unexpected error submitting ballot:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network or connection error. Please try again.',
    };
  }
}
