import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogIn, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * GuestModeBanner Component
 * 
 * Displays a subtle notification to guest users indicating limited functionality
 * Shows a call-to-action to sign up or log in for full features
 * 
 * Features:
 * - Only shown to guest users
 * - Dismissible (though persists on page refresh)
 * - Can navigate to login/signup
 * - Responsive design
 */
const GuestModeBanner = ({ variant = 'info', dismissible = false }) => {
  const { isGuest } = useAuth();
  const [dismissed, setDismissed] = React.useState(false);
  const navigate = useNavigate();

  if (!isGuest || dismissed) return null;

  const variantStyles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800/50',
      text: 'text-blue-800 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800/50',
      text: 'text-amber-800 dark:text-amber-300',
      icon: 'text-amber-600 dark:text-amber-400',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
  };

  const style = variantStyles[variant] || variantStyles.info;

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-xl p-4 mb-6 flex items-center justify-between gap-4 animate-fade-in`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 flex-1">
        <div className={`${style.icon}`}>
          <LogIn className="w-5 h-5" />
        </div>
        <div>
          <p className={`text-sm font-semibold ${style.text}`}>
            👋 You're in Guest Mode
          </p>
          <p className={`text-xs mt-1 ${style.text} opacity-90`}>
            You can explore the app, but features like messaging and saving personal data are locked. 
            Sign up to unlock the full experience!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => navigate('/signup')}
          className={`${style.button} px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap`}
        >
          Sign Up
        </button>

        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className={`${style.icon} hover:opacity-70 transition-opacity`}
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default GuestModeBanner;
