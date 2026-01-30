import React from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

/**
 * Error Boundary Component
 * 
 * Catches React component errors and displays a user-friendly fallback UI
 * instead of crashing the entire application
 * 
 * Usage: Wrap your app with <ErrorBoundary>...</ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true, 
      error,
      errorCount: (prev) => prev + 1,
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error('🚨 Error caught by ErrorBoundary:');
    console.error('Error:', error);
    console.error('Info:', errorInfo);
    
    // In production, you could log to error tracking service:
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md w-full border border-red-200 dark:border-red-800">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            
            {/* Error Title */}
            <h1 className="text-2xl font-bold text-center text-red-600 dark:text-red-400 mb-2">
              Oops! Something went wrong
            </h1>
            
            {/* Error Message */}
            <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
              We encountered an unexpected error. Please try refreshing the page or go back home.
            </p>
            
            {/* Error Details (Dev Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm border border-gray-300 dark:border-gray-700">
                <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs overflow-auto text-red-600 dark:text-red-400 max-h-32 whitespace-pre-wrap break-words">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
            
            {/* Error Count Warning */}
            {this.state.errorCount > 3 && (
              <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  ⚠️ Multiple errors detected ({this.state.errorCount}). 
                  If errors persist, please contact support.
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
            
            {/* Support Info */}
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
              If the problem persists, please refresh your browser or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
