/**
 * Browser-based duplicate-vote deterrence using localStorage.
 *
 * NOTE: This is a practical, low-friction browser-level deterrence mechanism.
 * It prevents accidental double-voting or repeated submissions from the same browser.
 * It does NOT guarantee one-human-one-vote against deliberate browser resets,
 * incognito windows, or multiple devices.
 */

const VOTED_MARKER_KEY = 'spark_filmfare_ballot_submitted';

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

