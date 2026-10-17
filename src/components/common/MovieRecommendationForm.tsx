import React, { useId, useState } from 'react';
import { Send } from 'lucide-react';
import { submitMovieRecommendation } from '../../lib/votingData';

export const MovieRecommendationForm: React.FC = () => {
  const recommendationId = useId();
  const [recommendation, setRecommendation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    const result = await submitMovieRecommendation(recommendation);
    setIsSubmitting(false);

    if (!result.success) {
      setFeedback({ message: result.error ?? 'Could not submit your recommendation.', isError: true });
      return;
    }

    setRecommendation('');
    setFeedback({ message: 'Thanks! Your recommendation has been submitted.', isError: false });
  };

  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-[#00c2e0]/30 bg-[#050d1a]/90 p-5 text-left shadow-[0_0_30px_rgba(0,194,224,0.12)] sm:p-6">
      <h2 className="font-['Cinzel',serif] text-lg font-bold text-white">Recommend a Movie</h2>
      <p className="mt-1 text-xs text-[#a5f3fc]/70">
        Have a film in mind for a future FnC screening? Let us know.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label htmlFor={recommendationId} className="sr-only">Your movie recommendation</label>
        <textarea
          id={recommendationId}
          value={recommendation}
          onChange={(event) => setRecommendation(event.target.value)}
          required
          maxLength={1000}
          rows={3}
          placeholder="Type your movie recommendation..."
          className="w-full resize-y rounded-xl border border-[#00c2e0]/30 bg-[#02050b] px-4 py-3 text-sm text-white placeholder:text-[#a5f3fc]/40 focus:border-[#00f5d4]/70 focus:outline-none focus:ring-1 focus:ring-[#00f5d4]/40"
        />
        <button
          type="submit"
          disabled={isSubmitting || !recommendation.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#062831] via-[#00c2e0] to-[#00f5d4] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:shadow-[0_0_20px_rgba(0,194,224,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          {isSubmitting ? 'Submitting...' : 'Submit Recommendation'}
        </button>
        {feedback && (
          <p role={feedback.isError ? 'alert' : 'status'} className={`text-xs ${feedback.isError ? 'text-red-300' : 'text-[#00f5d4]'}`}>
            {feedback.message}
          </p>
        )}
      </form>
    </section>
  );
};
