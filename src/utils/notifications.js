import { toast } from 'sonner';

/**
 * Standardized Notification Utilities
 * 
 * Centralized notification system using Sonner
 * Ensures consistent toast notifications across the app
 */

export const notify = {
  /**
   * Success notification
   */
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 3000,
      position: 'top-right',
      ...options,
    });
  },

  /**
   * Error notification
   */
  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 4000,
      position: 'top-right',
      ...options,
    });
  },

  /**
   * Info notification
   */
  info: (message, options = {}) => {
    return toast.info(message, {
      duration: 3000,
      position: 'top-right',
      ...options,
    });
  },

  /**
   * Warning notification
   */
  warning: (message, options = {}) => {
    return toast.warning(message, {
      duration: 3000,
      position: 'top-right',
      ...options,
    });
  },

  /**
   * Loading notification
   * Returns toast ID to dismiss later
   */
  loading: (message, options = {}) => {
    return toast.loading(message, {
      position: 'top-right',
      ...options,
    });
  },

  /**
   * Promise-based notification
   * Shows loading, then success or error
   */
  promise: (promise, messages, options = {}) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Error occurred',
      position: 'top-right',
      ...options,
    });
  },

  /**
   * Update existing toast
   */
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  /**
   * Clear all toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },
};

/**
 * Common notification messages
 */
export const notifications = {
  // Success messages
  created: (item = 'Item') => `✅ ${item} created successfully`,
  updated: (item = 'Item') => `✅ ${item} updated successfully`,
  deleted: (item = 'Item') => `✅ ${item} deleted successfully`,
  saved: (item = 'Changes') => `✅ ${item} saved successfully`,
  copied: () => '✅ Copied to clipboard',
  
  // Error messages
  error: (action = 'Operation') => `❌ ${action} failed. Please try again.`,
  networkError: () => '❌ Network error. Please check your connection.',
  unauthorized: () => '❌ You are not authorized to perform this action.',
  notFound: (item = 'Item') => `❌ ${item} not found.`,
  validation: (field = 'Field') => `❌ Please check the ${field} field.`,
  
  // Info messages
  loading: (action = 'Loading') => `⏳ ${action}...`,
  welcome: (name = 'User') => `👋 Welcome, ${name}!`,
  
  // Auth messages
  loginSuccess: () => '✅ Successfully logged in!',
  logoutSuccess: () => '✅ Successfully logged out',
  signupSuccess: () => '✅ Account created! Please verify your email.',
  passwordReset: () => '✅ Password reset link sent to your email',
  
  // Guest mode messages
  guestModeActive: () => '👤 You\'re exploring in guest mode. Sign up for full features.',
  guestLimited: (feature = 'This feature') => `👤 ${feature} is available for signed-in users only.`,
};

/**
 * Async operation with notification
 * Handles loading, success, and error states
 */
export const notifyAsync = async (
  asyncFn,
  messages = {},
  options = {}
) => {
  const {
    loading = 'Loading...',
    success = 'Success!',
    error = 'Error occurred',
  } = messages;

  const toastId = notify.loading(loading, options);

  try {
    const result = await asyncFn();
    toast.dismiss(toastId);
    notify.success(success, options);
    return result;
  } catch (err) {
    toast.dismiss(toastId);
    const errorMessage = typeof error === 'function' 
      ? error(err) 
      : error;
    notify.error(errorMessage, options);
    throw err;
  }
};

/**
 * Usage Examples:
 * 
 * // Simple success notification
 * notify.success('Task created!');
 * 
 * // With custom options
 * notify.success('Task updated!', { duration: 5000 });
 * 
 * // Using predefined messages
 * notify.success(notifications.created('Task'));
 * 
 * // Promise-based notification
 * notify.promise(
 *   saveTask(taskData),
 *   {
 *     loading: 'Saving task...',
 *     success: 'Task saved!',
 *     error: 'Failed to save task',
 *   }
 * );
 * 
 * // Async operation with notification
 * notifyAsync(
 *   () => deleteTask(taskId),
 *   {
 *     loading: 'Deleting...',
 *     success: notifications.deleted('Task'),
 *     error: (err) => `Failed: ${err.message}`,
 *   }
 * );
 */

export default notify;
