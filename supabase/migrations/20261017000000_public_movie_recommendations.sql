BEGIN;

ALTER TABLE public.recs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS recs_public_submit_movie_recommendations ON public.recs;
CREATE POLICY recs_public_submit_movie_recommendations
  ON public.recs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(btrim(movie_rec)) BETWEEN 1 AND 1000
  );

GRANT INSERT (movie_rec) ON TABLE public.recs TO anon, authenticated;

COMMIT;
