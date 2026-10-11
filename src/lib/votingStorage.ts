/**
 * Browser-based duplicate-vote deterrence using localStorage.
 *
 * NOTE: This is a practical, low-friction browser-level deterrence mechanism.
 * It prevents accidental double-voting or repeated submissions from the same browser.
 * It does NOT guarantee one-human-one-vote against deliberate browser resets,
 * incognito windows, or multiple devices.
 */

const VOTED_MARKER_KEY = 'spark_filmfare_ballot_submitted';
const SUBMISSION_ID_KEY = 'spark_filmfare_submission_id';
const SUBMISSION_TIMESTAMP_KEY = 'spark_filmfare_submitted_at';
const VOTER_TOKEN_KEY = 'spark_filmfare_voter_token';

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
export function markBallotSubmitted(ballotId?: string): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(VOTED_MARKER_KEY, 'true');
    window.localStorage.setItem(SUBMISSION_TIMESTAMP_KEY, new Date().toISOString());
    if (ballotId) {
      window.localStorage.setItem(SUBMISSION_ID_KEY, ballotId);
    }
    return true;
  } catch (err) {
    console.warn('Could not write ballot marker to localStorage:', err);
    return false;
  }
}

/**
 * Returns a stable, pseudorandom anonymous voter token for the browser.
 * Used for practical grouping and casual duplicate deterrence.
 */
export function getVoterToken(): string {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'anon-' + Math.random().toString(36).slice(2);
    }

    let token = window.localStorage.getItem(VOTER_TOKEN_KEY);
    if (!token) {
      token = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'voter-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      window.localStorage.setItem(VOTER_TOKEN_KEY, token);
    }
    return token;
  } catch {
    return 'anon-' + Math.random().toString(36).slice(2);
  }
}

/**
 * Retrieves the recorded submission ID, if any.
 */
export function getStoredSubmissionId(): string | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage.getItem(SUBMISSION_ID_KEY);
  } catch {
    return null;
  }
}
