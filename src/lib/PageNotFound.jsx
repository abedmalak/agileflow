import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const KNOWN_PAGES = [
  { name: 'Dashboard', path: '/Dashboard', description: 'Project overview and metrics' },
  { name: 'Boards', path: '/Boards', description: 'Kanban boards and task management' },
  { name: 'Backlog', path: '/Backlog', description: 'Sprint planning and user stories' },
  { name: 'Analytics', path: '/Analytics', description: 'Charts and performance data' },
  { name: 'Calendar', path: '/Calendar', description: 'Events and scheduling' },
  { name: 'Settings', path: '/Settings', description: 'Account and app preferences' },
];

function getErrorHint(pathname) {
  const path = pathname.toLowerCase().replace(/^\//, '');
  if (!path) return null;

  const match = KNOWN_PAGES.find(p =>
    p.name.toLowerCase().startsWith(path.slice(0, 3)) ||
    path.startsWith(p.name.toLowerCase().slice(0, 3))
  );
  if (match) {
    return `Did you mean "${match.name}"?`;
  }

  if (path.includes('board') && path !== 'boards' && path !== 'board') {
    return 'Board pages require an ID parameter — try visiting Boards first.';
  }

  return null;
}

export default function PageNotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = decodeURIComponent(location.pathname.substring(1)) || 'unknown';
  const hint = getErrorHint(location.pathname);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-lg w-full">
        <div className="text-center space-y-8">
          {/* 404 */}
          <div className="mx-auto">
            <span className="text-8xl font-bold text-muted-foreground/30 select-none">
              404
            </span>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-foreground">
              Page not found
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
              There's no page at <span className="font-medium text-foreground break-all">/{pageName}</span>.
              It may have been moved or the URL might be incorrect.
            </p>
          </div>

          {/* Hint */}
          {hint && (
            <div className="mx-auto max-w-sm p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 justify-center">
                <Search className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-300">{hint}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">Or jump to:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {KNOWN_PAGES.map(page => (
                <button
                  key={page.path}
                  onClick={() => navigate(page.path)}
                  title={page.description}
                  className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted rounded-md hover:bg-accent hover:text-foreground transition-colors"
                >
                  {page.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
