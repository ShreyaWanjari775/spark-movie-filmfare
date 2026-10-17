/**
 * A single category pick snapshot, persisted to localStorage on ballot submission.
 * Stored as a self-contained snapshot so the shelf renders correctly even if
 * the database categories/nominees change later.
 */
export interface SubmittedPick {
  categoryId: string;
  categoryTitle: string;
  nomineeId: string;
  nomineeTitle: string;
  posterUrl: string;
  /** ISO 8601 timestamp of when the ballot was saved */
  savedAt: string;
}
