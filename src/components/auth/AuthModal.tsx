import React from 'react';
import { X, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithGoogle,
    isSigningIn,
    authError,
    clearAuthError,
  } = useAuth();

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    clearAuthError();
    await signInWithGoogle();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-[#050d1a] border border-[#00c2e0]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,194,224,0.25)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glowing top edge */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00f5d4] to-transparent opacity-80" />

        {/* Header */}
        <div className="p-6 border-b border-[#00c2e0]/15 bg-[#030712]/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#062831] border border-[#00c2e0]/30 flex items-center justify-center">
              <img src="/spark-logo.png" alt="SPark" className="w-5 h-6 object-contain" />
            </div>
            <div>
              <h3 className="font-['Cinzel',serif] text-base sm:text-lg font-bold text-white tracking-wide">
                Student Sign In
              </h3>
              <p className="text-[10px] tracking-wider uppercase font-semibold text-[#a5f3fc]/70">
                SPIT • FnC Filmfare
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full bg-[#062831]/60 hover:bg-[#062831] text-[#a5f3fc] hover:text-white border border-[#00c2e0]/30 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Rejection / Auth Error Banner */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs flex items-start gap-3 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <div className="space-y-1">
                <p className="font-semibold text-red-100">Access Restricted</p>
                <p className="leading-relaxed text-red-300">{authError}</p>
                <p className="text-[11px] text-red-300/80 pt-1">
                  Click below to switch accounts and select your official <strong>@spit.ac.in</strong> account.
                </p>
              </div>
            </div>
          )}

          {/* Explanatory Info Card */}
          <div className="p-4 rounded-xl bg-[#062831]/40 border border-[#00c2e0]/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00f5d4]">
              <ShieldCheck className="w-4 h-4 text-[#00f5d4]" />
              <span>SPIT Students Only</span>
            </div>
            <p className="text-xs text-[#a5f3fc]/80 leading-relaxed font-light">
              Sign in with your official college Google account. Only verified email addresses ending with{' '}
              <strong className="text-white font-medium">@spit.ac.in</strong> (e.g. <span className="text-[#a5f3fc]">xy.wz25@spit.ac.in</span>) are eligible to participate.
            </p>
          </div>

          {/* Primary Google Sign In Action */}
          <div className="space-y-3 pt-1">
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-[#1f2937] font-semibold text-xs tracking-wider transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,194,224,0.4)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#02050b]" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  {/* Google Multicolor 'G' Icon */}
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] uppercase tracking-wider font-bold text-[11px]">
                    Continue with Google
                  </span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-[#a5f3fc]/50 pt-1">
              Authentication is handled directly through Supabase & Google OAuth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
