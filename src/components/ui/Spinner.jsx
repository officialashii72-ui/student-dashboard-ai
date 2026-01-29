/**
 * Spinner Component
 * 
 * Loading indicator with multiple sizes
 * Used for loading states throughout the app
 */

export default function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`inline-block ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <svg
        className="animate-spin text-blue-600 dark:text-blue-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Background circle */}
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        {/* Spinning arc */}
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

/**
 * Page loader - Full screen loading indicator
 */
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Inline spinner with text
 */
export function SpinnerWithText({ text = 'Loading...', size = 'md' }) {
  return (
    <div className="flex items-center gap-2">
      <Spinner size={size} />
      <span className="text-gray-700 dark:text-gray-300">{text}</span>
    </div>
  );
}

/**
 * Button spinner - For use inside buttons
 */
export function ButtonSpinner() {
  return (
    <Spinner size="sm" className="inline-block" />
  );
}

/**
 * Usage Examples:
 * 
 * // Simple spinner
 * <Spinner />
 * 
 * // Different size
 * <Spinner size="lg" />
 * 
 * // With custom class
 * <Spinner className="text-green-600" />
 * 
 * // Page loader
 * {isLoading && <PageLoader />}
 * 
 * // Inline spinner
 * <SpinnerWithText text="Saving..." />
 * 
 * // In button
 * <button disabled={isLoading}>
 *   {isLoading && <ButtonSpinner />}
 *   {isLoading ? 'Loading...' : 'Save'}
 * </button>
 */
