BEGIN;

CREATE TABLE public.admin_users (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton IS TRUE),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.admin_users FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_get_dashboard()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_settings_count bigint;
  v_voting_open boolean;
  v_results_published boolean;
  v_total_ballots bigint;
  v_categories jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT count(*), bool_and(is_open IS TRUE), bool_and(results_published IS TRUE)
  INTO v_settings_count, v_voting_open, v_results_published
  FROM public.voting_settings;

  IF v_settings_count <> 1 THEN
    RAISE EXCEPTION 'Expected exactly one voting_settings row';
  END IF;

  SELECT count(*) INTO v_total_ballots FROM public.ballots;

  SELECT coalesce(
    jsonb_agg(
      jsonb_build_object(
        'category_id', category.id,
        'category_name', category.name,
        'nominees', coalesce(nominee_data.items, '[]'::jsonb)
      ) ORDER BY category.name
    ),
    '[]'::jsonb
  )
  INTO v_categories
  FROM public.categories AS category
  LEFT JOIN LATERAL (
    SELECT jsonb_agg(
      jsonb_build_object(
        'nominee_id', nominee_counts.id,
        'nominee_name', nominee_counts.title,
        'vote_count', nominee_counts.vote_count
      ) ORDER BY nominee_counts.title
    ) AS items
    FROM (
      SELECT nominee.id, nominee.title, count(DISTINCT choice.ballot_id) AS vote_count
      FROM public.nominees AS nominee
      LEFT JOIN public.ballot_choices AS choice
        ON choice.nominee_id = nominee.id
       AND choice.category_id = nominee.category_id
      WHERE nominee.category_id = category.id
      GROUP BY nominee.id, nominee.title
    ) AS nominee_counts
  ) AS nominee_data ON true;

  RETURN jsonb_build_object(
    'total_ballots', v_total_ballots,
    'voting_open', v_voting_open,
    'results_published', v_results_published,
    'categories', v_categories
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_voting_open(p_is_open boolean)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_updated_rows integer;
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.voting_settings SET is_open = p_is_open;
  GET DIAGNOSTICS v_updated_rows = ROW_COUNT;
  IF v_updated_rows <> 1 THEN
    RAISE EXCEPTION 'Expected exactly one voting_settings row';
  END IF;

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_results_published(p_is_published boolean)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_updated_rows integer;
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.voting_settings SET results_published = p_is_published;
  GET DIAGNOSTICS v_updated_rows = ROW_COUNT;
  IF v_updated_rows <> 1 THEN
    RAISE EXCEPTION 'Expected exactly one voting_settings row';
  END IF;

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_published_results()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_settings_count bigint;
  v_results_published boolean;
  v_total_ballots bigint;
  v_categories jsonb;
BEGIN
  SELECT count(*), bool_and(results_published IS TRUE)
  INTO v_settings_count, v_results_published
  FROM public.voting_settings;

  IF v_settings_count <> 1 OR v_results_published IS NOT TRUE THEN
    RETURN NULL;
  END IF;

  SELECT count(*) INTO v_total_ballots FROM public.ballots;

  SELECT coalesce(
    jsonb_agg(
      jsonb_build_object(
        'category_id', category.id,
        'category_name', category.name,
        'nominees', coalesce(nominee_data.items, '[]'::jsonb)
      ) ORDER BY category.name
    ),
    '[]'::jsonb
  )
  INTO v_categories
  FROM public.categories AS category
  LEFT JOIN LATERAL (
    SELECT jsonb_agg(
      jsonb_build_object(
        'nominee_id', nominee_counts.id,
        'nominee_name', nominee_counts.title,
        'vote_count', nominee_counts.vote_count
      ) ORDER BY nominee_counts.title
    ) AS items
    FROM (
      SELECT nominee.id, nominee.title, count(DISTINCT choice.ballot_id) AS vote_count
      FROM public.nominees AS nominee
      LEFT JOIN public.ballot_choices AS choice
        ON choice.nominee_id = nominee.id
       AND choice.category_id = nominee.category_id
      WHERE nominee.category_id = category.id
      GROUP BY nominee.id, nominee.title
    ) AS nominee_counts
  ) AS nominee_data ON true;

  RETURN jsonb_build_object(
    'total_ballots', v_total_ballots,
    'categories', v_categories
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_get_dashboard() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_set_voting_open(boolean) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_set_results_published(boolean) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_published_results() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_dashboard() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_voting_open(boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_results_published(boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_published_results() TO anon, authenticated;

COMMIT;
