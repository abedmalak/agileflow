import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import SessionExpired from '@/components/common/SessionExpired';
import LoginPage from '@/pages/Login';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, isAuthenticated, authError } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-muted border-t-foreground rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle user_not_registered error specifically
  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  // Handle missing Supabase configuration
  if (authError?.type === 'config_error') {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-foreground">Configuration Error</h1>
          <p className="text-sm text-muted-foreground">
            The application cannot connect to the database. Environment variables <code className="px-1 py-0.5 bg-muted rounded text-xs">VITE_SUPABASE_URL</code> and <code className="px-1 py-0.5 bg-muted rounded text-xs">VITE_SUPABASE_ANON_KEY</code> must be set.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-md hover:opacity-90 transition-opacity cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Handle session expiry (was authenticated, token refresh failed)
  if (authError?.type === 'session_expired') {
    return <SessionExpired />;
  }

  // Not authenticated — only allow the login page
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  // Authenticated — render the full app
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
