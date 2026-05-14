import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="max-w-md w-full">
            <div className="border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 rounded-lg p-6 text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />

              <h1 className="text-base font-semibold text-foreground mt-3">
                Something went wrong
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                An unexpected error occurred. This has been logged and we'll look into it. Try reloading the page.
              </p>

              {/* Error details (collapsible) */}
              {this.state.error && (
                <div className="mt-4 text-left">
                  <button
                    onClick={this.toggleDetails}
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {this.state.showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {this.state.showDetails ? 'Hide' : 'Show'} error details
                  </button>
                  {this.state.showDetails && (
                    <div className="mt-2 p-3 rounded-lg bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800">
                      <p className="font-mono text-xs text-red-700 dark:text-red-300 break-all whitespace-pre-wrap">
                        {this.state.error?.toString()}
                      </p>
                      {this.state.errorInfo?.componentStack && (
                        <pre className="mt-2 font-mono text-xs text-red-600/70 dark:text-red-400/60 overflow-x-auto max-h-32 overflow-y-auto">
                          {this.state.errorInfo.componentStack.slice(0, 500)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                <Button onClick={this.handleReload} variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </Button>
                <Button onClick={this.handleGoHome} variant="outline" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
