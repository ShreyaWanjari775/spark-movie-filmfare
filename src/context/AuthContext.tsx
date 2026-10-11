import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

/**
 * Validates that an email strictly belongs to the SPIT college domain (case-insensitive).
 * Example: 'xy.wz25@spit.ac.in'
 *
 * NOTE: Frontend domain validation provides immediate user feedback and UX guidance,
 * but it is NOT an infallible security boundary. Server-side RLS policies and/or
 * Supabase auth hooks/triggers must enforce this before final launch.
 */
export function isSpitEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  const atIndex = normalized.lastIndexOf('@');
  if (atIndex === -1) return false;

  const localPart = normalized.slice(0, atIndex);
  const domainPart = normalized.slice(atIndex + 1);

  return localPart.length > 0 && domainPart === 'spit.ac.in';
}

/**
 * Extracts a friendly student username or roll identifier from the email.
 * e.g., 'xy.wz25@spit.ac.in' -> 'xy.wz25'
 */
export function getStudentIdentifier(email: string | null | undefined): string {
  if (!email) return 'Student';
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf('@');
  return atIndex > 0 ? trimmed.slice(0, atIndex) : trimmed;
}

export interface AuthResultError {
  message: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isSigningIn: boolean;
  isAuthenticated: boolean;
  isStudent: boolean;
  studentEmail: string | null;
  studentIdentifier: string;
  authError: string | null;
  clearAuthError: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<{ error: AuthResultError | null }>;
  signOut: () => Promise<{ error: AuthResultError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const clearAuthError = useCallback(() => setAuthError(null), []);
  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  // Restore existing session and subscribe to auth state changes
  useEffect(() => {
    let isMounted = true;

    const validateAndSetSession = async (currentSession: Session | null) => {
      if (!isMounted) return;

      if (currentSession?.user) {
        const email = currentSession.user.email ?? '';
        // Strict domain verification for SPIT students
        if (!isSpitEmail(email)) {
          console.warn(`Non-SPIT Google account rejected: ${email}`);
          // Sign out immediately to invalidate the session
          await supabase.auth.signOut();
          if (!isMounted) return;
          setSession(null);
          setUser(null);
          setAuthError(
            `Access restricted: The Google account (${email}) is not an official @spit.ac.in student account. Only SPIT student accounts are eligible to participate.`
          );
          setIsAuthModalOpen(true);
          setIsLoading(false);
          setIsSigningIn(false);
          return;
        }
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        setAuthError(null);
      }
      setIsLoading(false);
      setIsSigningIn(false);
    };

    // 1. Initial session restoration from Supabase local storage
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn('Error restoring Supabase auth session:', error.message);
      }
      validateAndSetSession(session);
    });

    // 2. Real-time auth changes (Google OAuth redirect, token refresh, sign-out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      await validateAndSetSession(currentSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Initiate Google OAuth login via Supabase
  const signInWithGoogle = useCallback(async (): Promise<{ error: AuthResultError | null }> => {
    setIsSigningIn(true);
    setAuthError(null);

    try {
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account',
            hd: 'spit.ac.in',
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        setIsSigningIn(false);
        setIsAuthModalOpen(true);
        return { error: { message: error.message } };
      }

      // Browser will redirect to Google authentication
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect to Google Sign-In.';
      setAuthError(message);
      setIsSigningIn(false);
      setIsAuthModalOpen(true);
      return { error: { message } };
    }
  }, []);

  // Sign out
  const signOut = useCallback(async (): Promise<{ error: AuthResultError | null }> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setSession(null);
        setUser(null);
        setAuthError(null);
      }
      setIsLoading(false);
      return { error: error ? { message: error.message } : null };
    } catch (err) {
      setIsLoading(false);
      return {
        error: {
          message: err instanceof Error ? err.message : 'Sign out failed.',
        },
      };
    }
  }, []);

  // Derived student state
  const studentEmail = user?.email ?? null;
  const isStudent = Boolean(studentEmail && isSpitEmail(studentEmail));
  const studentIdentifier = useMemo(() => getStudentIdentifier(studentEmail), [studentEmail]);

  const value = useMemo<AuthContextType>(
    () => ({
      session,
      user,
      isLoading,
      isSigningIn,
      isAuthenticated: Boolean(user),
      isStudent,
      studentEmail,
      studentIdentifier,
      authError,
      clearAuthError,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      signInWithGoogle,
      signOut,
    }),
    [
      session,
      user,
      isLoading,
      isSigningIn,
      isStudent,
      studentEmail,
      studentIdentifier,
      authError,
      clearAuthError,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      signInWithGoogle,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
