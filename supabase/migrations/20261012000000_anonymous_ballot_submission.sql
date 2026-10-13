-- Anonymous ballot submission for the SPark Filmfare voting flow.
-- Run manually after reviewing the current table definitions and policies.

BEGIN;

ALTER TABLE public.ballots
  ALTER COLUMN user_id DROP NOT NULL;

REVOKE ALL PRIVILEGES ON TABLE public.ballots, public.ballot_choices
  FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_ballot(p_choices jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_choice_count integer;
  v_distinct_category_count integer;
  v_ballot_id uuid;
BEGIN
  IF p_choices IS NULL THEN
    RAISE EXCEPTION 'Invalid ballot payload';
  END IF;

  IF jsonb_typeof(p_choices) <> 'array' THEN
    RAISE EXCEPTION 'Invalid ballot payload';
  END IF;

  IF octet_length(p_choices::text) > 16384
     OR jsonb_array_length(p_choices) > 100 THEN
    RAISE EXCEPTION 'Invalid ballot payload';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements(p_choices) AS choice(value)
    WHERE CASE
      WHEN jsonb_typeof(choice.value) = 'object'
        THEN (SELECT count(*) FROM jsonb_object_keys(choice.value)) <> 2
      ELSE true
    END
  ) THEN
    RAISE EXCEPTION 'Invalid ballot choice';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements(p_choices) AS choice(value)
    WHERE choice.value->'category_id' IS NULL
       OR choice.value->'nominee_id' IS NULL
       OR jsonb_typeof(choice.value->'category_id') <> 'string'
       OR jsonb_typeof(choice.value->'nominee_id') <> 'string'
       OR (choice.value->>'category_id') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
       OR (choice.value->>'nominee_id') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  ) THEN
    RAISE EXCEPTION 'Invalid ballot choice';
  END IF;

  SELECT count(*), count(DISTINCT (choice.value->>'category_id')::uuid)
  INTO v_choice_count, v_distinct_category_count
  FROM jsonb_array_elements(p_choices) AS choice(value);

  IF v_choice_count = 0 OR v_choice_count <> v_distinct_category_count THEN
    RAISE EXCEPTION 'Select at most one nominee per category';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.voting_settings
  ) OR EXISTS (
    SELECT 1
    FROM public.voting_settings
    WHERE is_open IS NOT TRUE
  ) THEN
    RAISE EXCEPTION 'Voting is currently closed';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements(p_choices) AS choice(value)
    LEFT JOIN public.categories AS category
      ON category.id = (choice.value->>'category_id')::uuid
     AND category.is_active IS TRUE
    WHERE category.id IS NULL
  ) THEN
    RAISE EXCEPTION 'A selected category is unavailable';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements(p_choices) AS choice(value)
    JOIN public.categories AS category
      ON category.id = (choice.value->>'category_id')::uuid
    LEFT JOIN public.nominees AS nominee
      ON nominee.id = (choice.value->>'nominee_id')::uuid
     AND nominee.category_id = category.id
     AND nominee.is_eligible IS TRUE
    WHERE nominee.id IS NULL
  ) THEN
    RAISE EXCEPTION 'A selected nominee is unavailable';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.categories AS category
    WHERE category.is_active IS TRUE
      AND category.is_required IS TRUE
      AND NOT EXISTS (
        SELECT 1
        FROM jsonb_array_elements(p_choices) AS choice(value)
        WHERE (choice.value->>'category_id')::uuid = category.id
      )
  ) THEN
    RAISE EXCEPTION 'A required category has no selection';
  END IF;

  INSERT INTO public.ballots (user_id)
  VALUES (NULL)
  RETURNING id INTO v_ballot_id;

  INSERT INTO public.ballot_choices (ballot_id, category_id, nominee_id)
  SELECT v_ballot_id,
         (choice.value->>'category_id')::uuid,
         (choice.value->>'nominee_id')::uuid
  FROM jsonb_array_elements(p_choices) AS choice(value);

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION public.submit_ballot(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_ballot(jsonb) TO anon, authenticated;

COMMIT;