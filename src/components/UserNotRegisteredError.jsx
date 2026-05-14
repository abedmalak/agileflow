import { ShieldX, LogOut, Mail } from 'lucide-react';
import { supabase } from '@/api/supabaseClient';

export default function UserNotRegisteredError() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-lg w-full">
        <div className="text-center space-y-8">
          {/* Illustration */}
          <div className="relative mx-auto w-48 h-48">
            <div className="absolute inset-0 rounded-full bg-orange-50 dark:bg-orange-950/30" />
            <div className="absolute inset-4 rounded-full bg-orange-100/60 dark:bg-orange-900/20 flex items-center justify-center">
              <ShieldX className="w-20 h-20 text-orange-400 dark:text-orange-500" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              Access Restricted
            </h1>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              Your account isn't registered to use this application. Contact your workspace administrator to request access.
            </p>
          </div>

          {/* Help Card */}
          <div className="mx-auto max-w-sm p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-left">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Things to try:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 flex-shrink-0" />
                Make sure you're signed in with the correct account
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 flex-shrink-0" />
                Ask your admin to add your email to the workspace
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 flex-shrink-0" />
                Try logging out and signing in again
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out & Try Again
            </button>
            <a
              href="mailto:support@agileflow.dev"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
