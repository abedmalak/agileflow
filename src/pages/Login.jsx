import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { isResetPasswordRecovery } from '@/lib/auth-redirects';
import {
  RECOVERY_SESSION_MISSING_MESSAGE,
  waitForActiveSession,
} from '@/lib/auth-session';
import { PASSWORD_RESET_REQUEST_SUCCESS_MESSAGE } from '@/lib/password-reset-delivery';

export default function LoginPage() {
  const { login, signup, resetPassword, updatePassword, isRegistrationEnabled, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPreparingRecoverySession, setIsPreparingRecoverySession] = useState(false);
  const [isRecoverySessionReady, setIsRecoverySessionReady] = useState(false);
  const recoveryFlowDetected = isResetPasswordRecovery(
    searchParams.toString(),
    typeof window !== 'undefined' ? window.location.hash : ''
  );

  // Redirect when auth state changes (driven by AuthContext listener)
  useEffect(() => {
    if (isAuthenticated && mode !== 'reset' && !recoveryFlowDetected) {
      navigate('/');
    }
  }, [isAuthenticated, mode, navigate, recoveryFlowDetected]);

  useEffect(() => {
    if (recoveryFlowDetected) {
      setMode('reset');
    }
    if (searchParams.get('verified') === 'true') {
      setSuccess('Email verified successfully! You can now log in.');
    }
  }, [recoveryFlowDetected, searchParams]);

  useEffect(() => {
    if (mode === 'reset' && isAuthenticated) {
      setIsRecoverySessionReady(true);
      setIsPreparingRecoverySession(false);
      setError((currentError) =>
        currentError === RECOVERY_SESSION_MISSING_MESSAGE ? '' : currentError
      );
    }
  }, [isAuthenticated, mode]);

  useEffect(() => {
    let isActive = true;

    if (!recoveryFlowDetected || !supabase) {
      setIsPreparingRecoverySession(false);
      setIsRecoverySessionReady(false);
      return () => {
        isActive = false;
      };
    }

    setIsPreparingRecoverySession(true);
    setIsRecoverySessionReady(false);
    setError('');

    waitForActiveSession(() => supabase.auth.getSession())
      .then((session) => {
        if (!isActive) return;

        if (session?.user) {
          setIsRecoverySessionReady(true);
          setError('');
          return;
        }

        setError(RECOVERY_SESSION_MISSING_MESSAGE);
      })
      .catch(() => {
        if (!isActive) return;
        setError(RECOVERY_SESSION_MISSING_MESSAGE);
      })
      .finally(() => {
        if (isActive) {
          setIsPreparingRecoverySession(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [recoveryFlowDetected]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await signup(email, password, fullName);
        setSuccess('Account created! Check your email to verify, then log in.');
        setMode('login');
      } else if (mode === 'login') {
        await login(email, password);
        // Navigation handled by the isAuthenticated useEffect above
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccess(PASSWORD_RESET_REQUEST_SUCCESS_MESSAGE);
      } else if (mode === 'reset') {
        if (!isRecoverySessionReady) {
          throw new Error(RECOVERY_SESSION_MISSING_MESSAGE);
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await updatePassword(password);
        setSuccess('Password updated successfully!');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');

    if (newMode === 'login' && recoveryFlowDetected) {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-foreground">AgileFlow</h1>
          <p className="text-sm text-muted-foreground mt-1">Project Management Made Simple</p>
        </div>

        <Card className="w-full max-w-sm shadow-sm">
          <CardHeader>
            <CardTitle>
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
              {mode === 'reset' && 'Set New Password'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' && 'Sign in to your AgileFlow account'}
              {mode === 'signup' && 'Get started with AgileFlow for free'}
              {mode === 'forgot' && "Enter your email and we'll send a reset link"}
              {mode === 'reset' && 'Choose a new password for your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required={mode === 'signup'}
                  />
                </div>
              )}

              {mode !== 'reset' && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              )}

              {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">
                      {mode === 'reset' ? 'New Password' : 'Password'}
                    </Label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline cursor-pointer"
                        onClick={() => switchMode('forgot')}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              )}

              {mode === 'reset' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              )}

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>
              )}

              {success && (
                <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-3 rounded-md flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {success}
                </p>
              )}

              {mode === 'reset' && !error && isPreparingRecoverySession && (
                <p className="text-sm text-muted-foreground bg-muted/60 p-3 rounded-md">
                  Verifying your reset link and preparing a secure recovery session...
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || (mode === 'reset' && (!isRecoverySessionReady || isPreparingRecoverySession))}
              >
                {isLoading ? (
                  'Please wait...'
                ) : mode === 'reset' && isPreparingRecoverySession ? (
                  'Preparing Reset...'
                ) : mode === 'login' ? (
                  'Log In'
                ) : mode === 'signup' ? (
                  'Create Account'
                ) : mode === 'forgot' ? (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reset Link
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground space-y-2">
                {mode === 'login' && isRegistrationEnabled && (
                  <p>
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      className="text-foreground font-medium underline-offset-4 hover:underline cursor-pointer"
                      onClick={() => switchMode('signup')}
                    >
                      Sign Up
                    </button>
                  </p>
                )}
                {mode === 'signup' && (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="text-foreground font-medium underline-offset-4 hover:underline cursor-pointer"
                      onClick={() => switchMode('login')}
                    >
                      Log In
                    </button>
                  </p>
                )}
                {(mode === 'forgot' || mode === 'reset') && (
                  <button
                    type="button"
                    className="text-foreground font-medium underline-offset-4 hover:underline cursor-pointer inline-flex items-center gap-1"
                    onClick={() => switchMode('login')}
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Back to Login
                  </button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
