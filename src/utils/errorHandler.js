/**
 * Global Error Handler Utility
 * 
 * Handles unhandled errors and promise rejections globally
 * Log errors to console in development, send to external service in production
 */

/**
 * Custom App Error Class
 */
export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', details = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Handle unhandled Promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled Promise Rejection:', event.reason);
  
  logErrorToService(event.reason, {
    type: 'unhandledRejection',
    timestamp: new Date().toISOString(),
    url: window.location.href,
  });
  
  // Prevent default browser behavior
  event.preventDefault();
});

/**
 * Handle global errors
 */
window.addEventListener('error', (event) => {
  console.error('❌ Global Error:', event.error);
  
  logErrorToService(event.error, {
    type: 'globalError',
    timestamp: new Date().toISOString(),
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    url: window.location.href,
  });
});

/**
 * Log error to external service
 * Integrates with Sentry, LogRocket, Bugsnag, or custom backend
 */
export const logErrorToService = (error, context = {}) => {
  // In development, just log to console
  if (import.meta.env.DEV) {
    console.warn('📊 Error Context:', context);
    console.error('📊 Error Object:', error);
    return;
  }
  
  // In production, integrate with error tracking service
  // Example: Sentry
  // if (window.Sentry) {
  //   Sentry.captureException(error, { contexts: { custom: context } });
  // }
  
  // Example: Custom API endpoint
  // fetch('/api/errors', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     error: error.toString(),
  //     context,
  //     userAgent: navigator.userAgent,
  //     timestamp: new Date().toISOString(),
  //   }),
  // }).catch(console.error);
  
  // For now, just log to console
  console.error('Production Error:', { error, context });
};

/**
 * Firebase-specific error handler
 * Maps Firebase error codes to user-friendly messages
 */
export const handleFirebaseError = (error) => {
  const errorMap = {
    // Auth errors
    'auth/user-not-found': 'User account not found. Please sign up first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Invalid email address format.',
    'auth/email-already-in-use': 'Email already registered. Please sign in instead.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/too-many-requests': 'Too many login attempts. Please try again later.',
    
    // Firestore errors
    'permission-denied': 'You don\'t have permission to perform this action.',
    'failed-precondition': 'Operation could not be completed. Please try again.',
    'unauthenticated': 'You must be signed in to perform this action.',
    'not-found': 'Resource not found.',
    'already-exists': 'Resource already exists.',
    'invalid-argument': 'Invalid argument provided.',
    'internal': 'Internal server error. Please try again later.',
  };
  
  const message = errorMap[error.code] || error.message || 'An error occurred';
  
  return new AppError(message, error.code, {
    originalError: error,
    service: 'Firebase',
  });
};

/**
 * Network error handler
 */
export const handleNetworkError = (error) => {
  if (!navigator.onLine) {
    return new AppError(
      'No internet connection. Please check your network.',
      'NETWORK_OFFLINE',
      { error }
    );
  }
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return new AppError(
      'Failed to connect to server. Please try again.',
      'NETWORK_ERROR',
      { error }
    );
  }
  
  if (error.response?.status === 429) {
    return new AppError(
      'Too many requests. Please wait a moment before trying again.',
      'RATE_LIMITED',
      { status: 429 }
    );
  }
  
  if (error.response?.status === 503) {
    return new AppError(
      'Server is temporarily unavailable. Please try again later.',
      'SERVICE_UNAVAILABLE',
      { status: 503 }
    );
  }
  
  return new AppError(
    'Network request failed. Please check your connection and try again.',
    'NETWORK_ERROR',
    { error }
  );
};

/**
 * Validation error handler
 */
export const handleValidationError = (errors) => {
  const messages = Object.entries(errors)
    .map(([field, message]) => `${field}: ${message}`)
    .join('; ');
  
  return new AppError(
    `Validation failed: ${messages}`,
    'VALIDATION_ERROR',
    { errors }
  );
};

/**
 * Safe error getter
 * Safely extract message from various error types
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  return 'An unknown error occurred';
};

/**
 * Safe error logger
 * Logs error without crashing
 */
export const safeLogError = (error, context = '') => {
  try {
    console.error(`Error${context ? ` (${context})` : ''}:`, error);
    logErrorToService(error, { context });
  } catch (e) {
    console.error('Failed to log error:', e);
  }
};

export default {
  AppError,
  handleFirebaseError,
  handleNetworkError,
  handleValidationError,
  getErrorMessage,
  safeLogError,
  logErrorToService,
};
