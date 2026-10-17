import type { SubmittedPick } from '../types/shelf';

/**
 * Browser-based duplicate-vote deterrence using localStorage.
 *
 * NOTE: This is a practical, low-friction browser-level deterrence mechanism.
 * It prevents accidental double-voting or repeated submissions from the same browser.
 * It does NOT guarantee one-human-one-vote against deliberate browser resets,
 * incognito windows, or multiple devices.
 */

const VOTED_MARKER_KEY = 'spark_filmfare_ballot_submitted';
const SUBMITTED_PICKS_KEY = 'spark_filmfare_ballot_picks_v1';

/**
 * Checks whether a ballot was previously recorded on this browser.
 * Returns false gracefully if localStorage is restricted or throws.
 */
export function hasAlreadyVoted(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    return window.localStorage.getItem(VOTED_MARKER_KEY) === 'true';
  } catch (err) {
    console.warn('localStorage is not accessible:', err);
    return false;
  }
}

/**
 * Marks that a ballot has been successfully accepted by Supabase.
 * Call this ONLY AFTER the database confirms a successful insert.
 */
export function markBallotSubmitted(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(VOTED_MARKER_KEY, 'true');
    return true;
  } catch (err) {
    console.warn('Could not write ballot marker to localStorage:', err);
    return false;
  }
}

/**
 * Persists a snapshot of the submitted picks in localStorage.
 * Call this ONLY after the database confirms a successful insert.
 */
export function saveSubmittedPicks(picks: SubmittedPick[]): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(SUBMITTED_PICKS_KEY, JSON.stringify(picks));
    return true;
  } catch (err) {
    console.warn('Could not write submitted picks snapshot to localStorage:', err);
    return false;
  }
}

/**
 * Retrieves the stored snapshot of submitted picks.
 * Validates JSON shape and returns null on corrupt or missing data without crashing.
 */
export function getSubmittedPicks(): SubmittedPick[] | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const raw = window.localStorage.getItem(SUBMITTED_PICKS_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }

    // Validate that each item has the expected SubmittedPick shape
    const isValid = parsed.every((item) => {
      if (!item || typeof item !== 'object') return false;
      const candidate = item as Record<string, unknown>;
      return (
        typeof candidate.categoryId === 'string' &&
        typeof candidate.categoryTitle === 'string' &&
        typeof candidate.nomineeId === 'string' &&
        typeof candidate.nomineeTitle === 'string' &&
        typeof candidate.posterUrl === 'string' &&
        typeof candidate.savedAt === 'string'
      );
    });

    if (!isValid) {
      console.warn('Corrupt submitted picks found in localStorage; ignoring.');
      return null;
    }

    return parsed as SubmittedPick[];
  } catch (err) {
    console.warn('Could not read or parse submitted picks from localStorage:', err);
    return null;
  }
}
