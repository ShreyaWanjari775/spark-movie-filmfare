import { supabase } from './supabase';
import type { Category, Movie } from '../types';

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
    .select('id, category_id, title, is_eligible')
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

    const formattedTitle = category.name.toLowerCase().startsWith('best ')
      ? category.name
      : `Best ${category.name}`;

    const movies: Movie[] = categoryNominees.map((nominee) => ({
      id: nominee.id,
      title: nominee.title,
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
      tagline: meta.tagline,
      description: meta.description,
      icon: meta.icon,
      nominees: movies,
    };
  });
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
  const { hasAlreadyVoted, markBallotSubmitted, getVoterToken } = await import('./votingStorage');

  // 1. Guard against casual duplicate submissions on the current browser
  if (hasAlreadyVoted()) {
    return {
      success: false,
      error: "You have already voted on this browser. Thank you for your participation!",
    };
  }

  // 2. Validate that each category has a selection
  const missingCategories = categories.filter((cat) => !picks[cat.id]);
  if (missingCategories.length > 0) {
    return {
      success: false,
      error: `Please select a movie for all categories before submitting (${missingCategories.length} remaining).`,
    };
  }

  // 3. Format payload for the submit_ballot database RPC
  const choices = Object.entries(picks).map(([categoryId, nomineeId]) => ({
    category_id: categoryId,
    nominee_id: nomineeId,
  }));

  const voterToken = getVoterToken();

  try {
    const { data, error } = await supabase.rpc('submit_ballot', {
      p_choices: choices,
      p_voter_token: voterToken,
    });

    if (error) {
      console.warn('Ballot submission RPC error:', error);
      return {
        success: false,
        error: error.message || 'Ballot submission failed. Please try again.',
      };
    }

    const res = data as { success?: boolean; ballot_id?: string } | null;
    if (!res || !res.success) {
      return {
        success: false,
        error: 'Ballot was rejected by database validation.',
      };
    }

    // 4. Mark successful ballot in localStorage ONLY AFTER confirmed database insert
    markBallotSubmitted(res.ballot_id);

    return {
      success: true,
      ballotId: res.ballot_id,
    };
  } catch (err) {
    console.error('Unexpected error submitting ballot:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network or connection error. Please try again.',
    };
  }
}

