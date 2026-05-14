import { Clock, LogIn } from 'lucide-react';

export default function SessionExpired() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-lg w-full">
        <div className="text-center space-y-8">
          {/* Illustration */}
          <div className="relative mx-auto w-48 h-48">
            <div className="absolute inset-0 rounded-full bg-amber-50 dark:bg-amber-950/30" />
            <div className="absolute inset-4 rounded-full bg-amber-100/60 dark:bg-amber-900/20 flex items-center justify-center">
              <Clock className="w-20 h-20 text-amber-400 dark:text-amber-500" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              Session Expired
            </h1>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              Your session has timed out for security. Sign in again to pick up where you left off.
            </p>
          </div>

          {/* Action */}
          <div>
            <button
              onClick={() => { window.location.href = '/login'; }}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In Again
            </button>
          </div>

          {/* Info */}
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
            Sessions expire after a period of inactivity to keep your account secure. Any unsaved changes may be lost.
          </p>
        </div>
      </div>
    </div>
  );
}
