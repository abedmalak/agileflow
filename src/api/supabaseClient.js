import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function clearStoredAuthData() {
  if (typeof window === 'undefined') return;

  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.includes('supabase') || key === 'agileflow-auth')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    // localStorage might be unavailable in some contexts
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.'
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'agileflow-auth',
      }
    })
  : null;

// Force-clear stale sessions from any previous auth configuration.
// Bumping AUTH_VERSION forces every browser to start fresh.
const AUTH_VERSION = 'v4';
if (typeof window !== 'undefined' && localStorage.getItem('agileflow-auth-version') !== AUTH_VERSION) {
  clearStoredAuthData();
  try {
    localStorage.setItem('agileflow-auth-version', AUTH_VERSION);
  } catch (e) {
    // localStorage might be unavailable in some contexts
  }
}

export const isSupabaseConfigured = !!supabase;

// Detect auth errors from Supabase queries and force logout on session expiry
export function handleAuthError(error) {
  if (!error || !supabase) return false;
  const isAuthError =
    error.message?.includes('JWT') ||
    error.message?.includes('token') ||
    error.code === 'PGRST301' ||
    error.code === '401' ||
    error.status === 401 ||
    error.message?.includes('not authenticated');

  if (isAuthError) {
    // Clear storage and redirect
    clearStoredAuthData();
    supabase.auth.signOut().catch(() => {});
    window.location.href = '/login';
    return true;
  }
  return false;
}
