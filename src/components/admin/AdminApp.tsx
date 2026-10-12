import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { AlertCircle, Film, Loader2, LockKeyhole, LogOut, RefreshCw, ShieldCheck } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

interface AdminNomineeResult {
  nominee_id: string;
  nominee_name: string;
  vote_count: number;
}

interface AdminCategoryResult {
  category_id: string;
  category_name: string;
  nominees: AdminNomineeResult[];
}

interface AdminDashboardData {
  total_ballots: number;
  voting_open: boolean;
  results_published: boolean;
  categories: AdminCategoryResult[];
}

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isUpdatingSetting, setIsUpdatingSetting] = useState(false);
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted) {
        setSession(nextSession);
        setAccessDenied(false);
        setError(null);
      }
    });

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!isMounted) return;
      setSession(data.session);
      setError(sessionError?.message ?? null);
      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadDashboard = useCallback(async () => {
    setIsLoadingDashboard(true);
    setError(null);
    setAccessDenied(false);

    const { data, error: rpcError } = await supabase.rpc('admin_get_dashboard');
    if (rpcError) {
      const denied = rpcError.message.toLowerCase().includes('not authorized');
      setAccessDenied(denied);
      setError(denied ? 'This Supabase account is not the configured admin.' : rpcError.message);
      setDashboard(null);
    } else {
      setDashboard(data as AdminDashboardData);
    }

    setIsLoadingDashboard(false);
  }, []);

  useEffect(() => {
    if (session) {
      void loadDashboard();
    } else {
      setDashboard(null);
      setAccessDenied(false);
    }
  }, [session, loadDashboard]);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSigningIn) return;

    setIsSigningIn(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setIsSigningIn(false);

    if (signInError) {
      setError(signInError.message);
    } else {
      setPassword('');
    }
  };

  const handleSignOut = async () => {
    setError(null);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(signOutError.message);
  };

  const updateSetting = async (setting: 'voting' | 'publication', value: boolean) => {
    if (isUpdatingSetting) return;
    setIsUpdatingSetting(true);
    setError(null);

    const result = setting === 'voting'
      ? await supabase.rpc('admin_set_voting_open', { p_is_open: value })
      : await supabase.rpc('admin_set_results_published', { p_is_published: value });

    if (result.error) {
      setError(result.error.message);
    } else {
      await loadDashboard();
    }

    setIsUpdatingSetting(false);
  };

  const page = (
    <main className="min-h-screen bg-[#030712] px-4 py-8 text-[#e0f7fa] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#00c2e0]/20 pb-6">
          <a href="/" className="flex items-center gap-3" aria-label="Return to SPark Filmfare">
            <img src="/spark-logo.png" alt="SPark" className="h-11 w-9 object-contain" />
            <div>
              <p className="font-['Cinzel',serif] text-sm font-bold tracking-[0.12em] text-white">SPARK FILMFARE</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#a5f3fc]/65">Admin console</p>
            </div>
          </a>
          {session && (
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-lg border border-[#00c2e0]/30 px-3 py-2 text-xs font-semibold text-[#a5f3fc] transition hover:border-[#00f5d4]/50 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          )}
        </header>

        {isCheckingSession ? (
          <div className="flex min-h-64 items-center justify-center text-[#a5f3fc]/70">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Checking session
          </div>
        ) : !session ? (
          <section className="mx-auto max-w-md rounded-2xl border border-[#00c2e0]/25 bg-[#050d1a]/90 p-6 shadow-[0_0_40px_rgba(0,194,224,0.12)] sm:p-8">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-[#00c2e0]/35 bg-[#062831] text-[#00f5d4]">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <h1 className="font-['Cinzel',serif] text-2xl font-bold text-white">Admin sign in</h1>
            <p className="mt-2 text-sm leading-6 text-[#a5f3fc]/70">Sign in with the configured Supabase account. Database authorization is checked separately for every admin action.</p>
            <form onSubmit={handleSignIn} className="mt-6 space-y-4">
              <label className="block space-y-1.5 text-xs font-semibold text-[#a5f3fc]">
                Email
                <input
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-[#00c2e0]/25 bg-[#02050b] px-3 py-2.5 text-sm text-white outline-none focus:border-[#00f5d4]/70"
                />
              </label>
              <label className="block space-y-1.5 text-xs font-semibold text-[#a5f3fc]">
                Password
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-[#00c2e0]/25 bg-[#02050b] px-3 py-2.5 text-sm text-white outline-none focus:border-[#00f5d4]/70"
                />
              </label>
              <button
                type="submit"
                disabled={isSigningIn}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#00c2e0] to-[#00f5d4] px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-[#02050b] disabled:cursor-wait disabled:opacity-60"
              >
                {isSigningIn && <Loader2 className="h-4 w-4 animate-spin" />}
                Sign in
              </button>
            </form>
            <p className="mt-4 text-[11px] leading-5 text-[#a5f3fc]/50">There is no sign-up option here. Only the UUID configured in the database can access admin data or controls.</p>
          </section>
        ) : accessDenied ? (
          <section className="mx-auto max-w-xl rounded-2xl border border-amber-400/25 bg-[#11100b] p-6">
            <ShieldCheck className="mb-3 h-6 w-6 text-amber-300" />
            <h1 className="font-['Cinzel',serif] text-xl font-bold text-white">Admin access not configured</h1>
            <p className="mt-2 text-sm text-[#a5f3fc]/70">This account authenticated successfully, but the database did not authorize it. No results or controls are shown.</p>
          </section>
        ) : (
          <>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00f5d4]"><ShieldCheck className="h-3.5 w-3.5" /> Private admin access</p>
                <h1 className="font-['Cinzel',serif] text-3xl font-bold text-white">Voting dashboard</h1>
              </div>
              <button
                type="button"
                onClick={() => void loadDashboard()}
                disabled={isLoadingDashboard}
                className="inline-flex items-center gap-2 rounded-lg border border-[#00c2e0]/30 px-3 py-2 text-xs font-semibold text-[#a5f3fc] hover:border-[#00f5d4]/50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingDashboard ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>

            {dashboard && (
              <>
                <section className="grid gap-4 sm:grid-cols-3">
                  <article className="rounded-xl border border-[#00c2e0]/20 bg-[#050d1a]/80 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a5f3fc]/60">Ballots submitted</p>
                    <p className="mt-2 font-['Cinzel',serif] text-3xl font-bold text-white">{dashboard.total_ballots.toLocaleString()}</p>
                  </article>
                  <article className="rounded-xl border border-[#00c2e0]/20 bg-[#050d1a]/80 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a5f3fc]/60">Voting</p>
                    <p className={`mt-2 text-lg font-bold ${dashboard.voting_open ? 'text-[#00f5d4]' : 'text-amber-200'}`}>{dashboard.voting_open ? 'Open' : 'Closed'}</p>
                  </article>
                  <article className="rounded-xl border border-[#00c2e0]/20 bg-[#050d1a]/80 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a5f3fc]/60">Results</p>
                    <p className={`mt-2 text-lg font-bold ${dashboard.results_published ? 'text-[#00f5d4]' : 'text-amber-200'}`}>{dashboard.results_published ? 'Published' : 'Unpublished'}</p>
                  </article>
                </section>

                <section className="mt-5 rounded-xl border border-[#00c2e0]/20 bg-[#050d1a]/80 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="font-['Cinzel',serif] text-lg font-bold text-white">Event controls</h2>
                      <p className="mt-1 text-xs text-[#a5f3fc]/60">Changes are authorized and applied by PostgreSQL RPCs.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={isUpdatingSetting}
                        onClick={() => void updateSetting('voting', !dashboard.voting_open)}
                        className="rounded-lg border border-[#00c2e0]/35 px-4 py-2.5 text-xs font-bold text-[#a5f3fc] hover:border-[#00f5d4]/70 hover:text-white disabled:opacity-50"
                      >
                        {dashboard.voting_open ? 'Close voting' : 'Open voting'}
                      </button>
                      <button
                        type="button"
                        disabled={isUpdatingSetting}
                        onClick={() => void updateSetting('publication', !dashboard.results_published)}
                        className="rounded-lg bg-gradient-to-r from-[#00c2e0] to-[#00f5d4] px-4 py-2.5 text-xs font-extrabold text-[#02050b] disabled:opacity-50"
                      >
                        {dashboard.results_published ? 'Unpublish results' : 'Publish results'}
                      </button>
                    </div>
                  </div>
                  {isUpdatingSetting && <p className="mt-3 inline-flex items-center gap-2 text-xs text-[#a5f3fc]/70"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating setting</p>}
                </section>

                <section className="mt-8">
                  <div className="mb-4 flex items-end justify-between gap-3">
                    <div>
                      <h2 className="font-['Cinzel',serif] text-xl font-bold text-white">Nominee results</h2>
                      <p className="mt-1 text-xs text-[#a5f3fc]/60">Private to the configured admin until results are published.</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#00f5d4]"><Film className="h-3.5 w-3.5" /> {dashboard.categories.length} categories</span>
                  </div>
                  <div className="space-y-4">
                    {dashboard.categories.map((category) => {
                      const maxVotes = Math.max(1, ...category.nominees.map((nominee) => nominee.vote_count));
                      return (
                        <article key={category.category_id} className="overflow-hidden rounded-xl border border-[#00c2e0]/20 bg-[#050d1a]/80">
                          <h3 className="border-b border-[#00c2e0]/15 px-5 py-3 font-['Cinzel',serif] text-sm font-bold text-white">{category.category_name}</h3>
                          {category.nominees.length === 0 ? (
                            <p className="px-5 py-4 text-xs text-[#a5f3fc]/50">No nominees in this category.</p>
                          ) : (
                            <div className="divide-y divide-[#00c2e0]/10">
                              {category.nominees.map((nominee) => (
                                <div key={nominee.nominee_id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3">
                                  <div className="min-w-0">
                                    <div className="flex items-baseline justify-between gap-3">
                                      <span className="truncate text-sm font-medium text-[#e0f7fa]">{nominee.nominee_name}</span>
                                      <span className="text-xs font-bold tabular-nums text-white">{nominee.vote_count.toLocaleString()}</span>
                                    </div>
                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#062831]">
                                      <div className="h-full rounded-full bg-gradient-to-r from-[#00c2e0] to-[#00f5d4]" style={{ width: `${Math.min(100, (nominee.vote_count / maxVotes) * 100)}%` }} />
                                    </div>
                                  </div>
                                  <span className="text-[10px] uppercase tracking-wider text-[#a5f3fc]/50">votes</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {error && (
          <div role="alert" className="mt-6 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
            <span>{error}</span>
          </div>
        )}

        {session && isLoadingDashboard && !dashboard && !accessDenied && (
          <div className="mt-8 flex items-center justify-center text-sm text-[#a5f3fc]/70"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading authorized dashboard</div>
        )}
      </div>
    </main>
  );

  return page;
}
