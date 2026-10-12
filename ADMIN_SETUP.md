# SPark Filmfare Admin Setup

This repository's public app has no admin or results workflow. The `/admin` route uses Supabase Auth for sign-in, while the database authorizes admin operations only when the signed-in Auth UUID is the single UUID recorded in `public.admin_users`. Hiding `/admin` is not the security boundary; each privileged RPC checks the allowlist.

The browser uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Never put a Supabase service-role/secret key in a `VITE_` variable or browser code.

## Before applying SQL

There is no checked-in base schema, and the public Supabase role cannot read `voting_settings`, `ballots`, or `ballot_choices`. Verify the actual private schema and policies in Supabase before applying either migration. The migrations assume:

- `ballots.user_id` references `auth.users` and can be nullable for anonymous ballots.
- `ballots.id`, `ballot_choices.ballot_id`, `category_id`, and `nominee_id` use UUID-compatible keys.
- `ballot_choices` has `ballot_id`, `category_id`, and `nominee_id` columns.
- `voting_settings` contains exactly one row with boolean `is_open` and `results_published` columns.
- `categories` has `id`, `name`, `is_active`, and `is_required`; `nominees` has `id`, `category_id`, `title`, and `is_eligible`.

Check the settings row before rollout. These migrations do not change its values; confirm `is_open = false` and `results_published = false` if that is the desired launch state. The ballot migration drops `NOT NULL` from `ballots.user_id` and removes direct API privileges on ballot tables; all ballot access should then go through the security-checked RPCs.

## Apply migrations manually

Review and run these SQL files in order from the Supabase SQL Editor, or use your normal migration workflow after reviewing the target project:

1. `supabase/migrations/20261012000000_anonymous_ballot_submission.sql`
2. `supabase/migrations/20261012010000_single_admin_dashboard.sql`

Do not run them until the schema assumptions above are confirmed. Neither migration opens voting or publishes results. The first migration installs atomic server-side ballot validation. The second creates the single-admin allowlist and dashboard/settings RPCs, and adds `get_published_results()`, which returns aggregate totals only when `results_published` is true. It never returns individual ballots.

## Create the only admin account

1. In Supabase Dashboard, create/invite your account under Authentication > Users. Do not enable public sign-up as an admin path. The app contains no sign-up flow.
2. After both migrations are applied, add that account's Auth UUID to the allowlist using SQL Editor. Replace the example email with the email for the account you just created:

   ```sql
   INSERT INTO public.admin_users (singleton, user_id)
   SELECT true, id
   FROM auth.users
   WHERE lower(email) = lower('you@example.com')
   ON CONFLICT (singleton)
   DO UPDATE SET user_id = EXCLUDED.user_id;
   ```

   Confirm exactly one row exists in `public.admin_users`. The singleton constraint prevents adding a second admin. To change administrators, use the SQL Editor as a trusted project operator; never expose database credentials in the app.
3. Configure the local/deployment frontend environment with the Supabase project URL and publishable key:

   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
   ```

   No admin email, password, service-role key, or other secret belongs in frontend environment variables. Configure the deployed app's allowed redirect URLs in Supabase Auth if required by the project.
4. Disable public Auth sign-ups in Supabase Auth settings. Admin authorization still depends on the database UUID allowlist, not this setting.
5. Configure the deployed static host to serve the SPA entry point for `/admin` (history fallback/rewrite), as well as `/`.
6. Open `/admin`, sign in with the account created in step 1, and verify dashboard access. An authenticated but unlisted account must receive a database authorization error. A signed-out request must not read the admin dashboard or change settings.
7. Confirm the dashboard initially reflects the stored settings. Open voting and publish results only through an explicit admin action when intended. Verify `get_published_results()` returns no data before publication and aggregate totals after publication.

## Security boundaries and limitations

- `admin_get_dashboard`, `admin_set_voting_open`, and `admin_set_results_published` require the allowlisted `auth.uid()` inside PostgreSQL. An authenticated account alone is not sufficient.
- Direct anon/authenticated access to `ballots` and `ballot_choices` is revoked by the ballot migration; totals are returned only by the admin RPC or the publication-gated aggregate RPC.
- Admin recovery/rotation requires trusted SQL Editor access. Keep Supabase project-owner credentials protected.
- Browser localStorage deters casual repeat voting only. Clearing it or using another browser/device bypasses that deterrence; it does not enforce one vote per person.
