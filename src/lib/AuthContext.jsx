import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/api/supabaseClient';
import {
  getEmailVerificationRedirectUrl,
  getPostLoginRedirectUrl,
} from '@/lib/auth-redirects';
import {
  checkEmailExists,
  DUPLICATE_ACCOUNT_MESSAGE,
  isDuplicateSignupError,
  normalizeEmailAddress,
} from '@/lib/auth-signup';
import {
  RECOVERY_SESSION_MISSING_MESSAGE,
  isMissingAuthSessionError,
  waitForActiveSession,
} from '@/lib/auth-session';
import { requestPasswordResetEmail } from '@/api/password-reset';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const isAuthenticatedRef = useRef(false);
  useEffect(() => { isAuthenticatedRef.current = isAuthenticated; }, [isAuthenticated]);

  // Profile loading is fire-and-forget — NEVER blocks auth flow
  const loadProfile = (userId) => {
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setProfile(data);
      })
      .catch(() => {});
  };

  // Force sign out and clear all stored auth data
  const forceSignOut = () => {
    try {
      // Clear our custom storage key
      localStorage.removeItem('agileflow-auth');
      // Clear any other Supabase keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase') || key.includes('agileflow-auth')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      // localStorage might be unavailable
    }
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
    isAuthenticatedRef.current = false;
    setAuthError(null);
    setIsLoadingAuth(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoadingAuth(false);
      setAuthError({ type: 'config_error', message: 'Supabase is not configured.' });
      return;
    }

    let didSettle = false;

    // SAFETY NET: If auth hasn't resolved in 4 seconds, force it to show login.
    // This catches ALL edge cases: hung queries, network issues, stale tokens.
    const timeout = setTimeout(() => {
      if (!didSettle) {
        didSettle = true;
        console.warn('Auth timed out — forcing login screen');
        forceSignOut();
      }
    }, 4000);

    const settle = (authenticated, sessionUser = null) => {
      if (didSettle) return;
      didSettle = true;
      clearTimeout(timeout);

      if (authenticated && sessionUser) {
        setUser(sessionUser);
        setIsAuthenticated(true);
        isAuthenticatedRef.current = true;
        setAuthError(null);
        // Load profile in background — doesn't block UI
        loadProfile(sessionUser.id);
      } else {
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
        isAuthenticatedRef.current = false;
      }
      setIsLoadingAuth(false);
    };

    // Try to restore session from storage
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error || !session?.user) {
        // No valid session — clear any stale storage
        if (error) {
          try { localStorage.removeItem('agileflow-auth'); } catch (e) {}
        }
        settle(false);
      } else {
        settle(true, session.user);
      }
    }).catch(() => {
      settle(false);
    });

    // Listen for auth changes AFTER initial load
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        // Already handled by getSession above, but settle is idempotent
        if (session?.user) {
          settle(true, session.user);
        } else {
          settle(false);
        }
      } else if ((event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') && session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        isAuthenticatedRef.current = true;
        setAuthError(null);
        setIsLoadingAuth(false);
        loadProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
        isAuthenticatedRef.current = false;
        setIsLoadingAuth(false);
      } else if (event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setUser(session.user);
        }
      } else if (event === 'USER_UPDATED' && session?.user) {
        setUser(session.user);
      }
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    // Clear any stale session before login attempt
    try { localStorage.removeItem('agileflow-auth'); } catch (e) {}
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const isRegistrationEnabled = import.meta.env.VITE_REGISTRATION_ENABLED !== 'false';

  const signup = async (email, password, fullName) => {
    if (!isRegistrationEnabled) {
      throw new Error('Registration is currently closed. Contact your administrator for access.');
    }
    const normalizedEmail = normalizeEmailAddress(email);
    const emailExists = await checkEmailExists(normalizedEmail);

    if (emailExists) {
      throw new Error(DUPLICATE_ACCOUNT_MESSAGE);
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: getEmailVerificationRedirectUrl(),
      }
    });
    if (error) {
      if (isDuplicateSignupError(error)) {
        throw new Error(DUPLICATE_ACCOUNT_MESSAGE);
      }

      throw error;
    }
    return data;
  };

  const loginWithOAuth = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getPostLoginRedirectUrl(),
      }
    });
    if (error) {
      if (error.message?.includes('provider') || error.message?.includes('Unsupported')) {
        throw new Error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in is not configured yet. Please use email instead.`);
      }
      throw error;
    }
    return data;
  };

  const resetPassword = async (email) => {
    return requestPasswordResetEmail(email);
  };

  const updatePassword = async (newPassword) => {
    const session = await waitForActiveSession(() => supabase.auth.getSession());
    if (!session?.user) {
      throw new Error(RECOVERY_SESSION_MISSING_MESSAGE);
    }

    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      if (isMissingAuthSessionError(error)) {
        throw new Error(RECOVERY_SESSION_MISSING_MESSAGE);
      }

      throw error;
    }
    return data;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Sign out might fail if token is already invalid — that's fine
    }
    forceSignOut();
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  const combinedUser = profile ? { ...profile, email: user?.email } : null;

  return (
    <AuthContext.Provider value={{
      user: combinedUser,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings: false,
      isRegistrationEnabled,
      authError,
      appPublicSettings: null,
      login,
      signup,
      loginWithOAuth,
      resetPassword,
      updatePassword,
      logout,
      navigateToLogin,
      checkAppState: () => supabase.auth.getSession()
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
