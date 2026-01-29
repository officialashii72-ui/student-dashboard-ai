/**
 * Guest Data Helpers
 * 
 * Provides sample/placeholder data for guest users
 * to explore the app without authentication
 */

/**
 * Sample tasks for guest mode
 * Demonstrates what users can do when authenticated
 */
export const getGuestSampleTasks = () => [
  {
    id: 'guest-task-1',
    title: 'Complete Chapter 5 Reading',
    description: 'Read Chapter 5 of Computer Science Fundamentals',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    completed: false,
    priority: 'high',
    subject: 'Computer Science',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'guest-task-2',
    title: 'Math Assignment - Derivatives',
    description: 'Solve problems 1-15 in Section 3.2',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    completed: true,
    priority: 'medium',
    subject: 'Mathematics',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'guest-task-3',
    title: 'Literature Essay - Shakespeare',
    description: 'Write 2000-word essay on Hamlet themes',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    completed: false,
    priority: 'high',
    subject: 'Literature',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Sample notes for guest mode
 */
export const getGuestSampleNotes = () => [
  {
    id: 'guest-note-1',
    title: 'Photosynthesis Notes',
    content: 'Key points about light-dependent and light-independent reactions. Important formulas to remember: CO2 + H2O + light energy → glucose + O2',
    subject: 'Biology',
    color: 'bg-yellow-100 dark:bg-yellow-900/30',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'guest-note-2',
    title: 'React Hooks Reference',
    content: 'useState, useEffect, useContext, useRef, useCallback, useMemo. Custom hooks pattern: const [value, setValue] = useState(initial)',
    subject: 'Programming',
    color: 'bg-blue-100 dark:bg-blue-900/30',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'guest-note-3',
    title: 'History Timeline',
    content: 'French Revolution 1789-1799: Key events, important figures (Robespierre, Napoleon), phases of the revolution',
    subject: 'History',
    color: 'bg-green-100 dark:bg-green-900/30',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Sample subjects for guest mode
 */
export const getGuestSampleSubjects = () => [
  {
    id: 'guest-subj-1',
    name: 'Mathematics',
    hours: 12,
    color: 'bg-red-50 dark:bg-red-900/20',
    icon: '📐',
  },
  {
    id: 'guest-subj-2',
    name: 'Computer Science',
    hours: 15,
    color: 'bg-blue-50 dark:bg-blue-900/20',
    icon: '💻',
  },
  {
    id: 'guest-subj-3',
    name: 'Biology',
    hours: 10,
    color: 'bg-green-50 dark:bg-green-900/20',
    icon: '🧬',
  },
  {
    id: 'guest-subj-4',
    name: 'Literature',
    hours: 8,
    color: 'bg-purple-50 dark:bg-purple-900/20',
    icon: '📚',
  },
];

/**
 * Sample analytics data for guest mode
 */
export const getGuestSampleAnalytics = () => ({
  weeklyTaskCompletion: [
    { day: 'Mon', completed: 3, total: 5 },
    { day: 'Tue', completed: 4, total: 5 },
    { day: 'Wed', completed: 2, total: 5 },
    { day: 'Thu', completed: 5, total: 5 },
    { day: 'Fri', completed: 4, total: 4 },
    { day: 'Sat', completed: 2, total: 3 },
    { day: 'Sun', completed: 1, total: 2 },
  ],
  subjectProgress: [
    { name: 'Mathematics', progress: 75, hours: 12 },
    { name: 'Computer Science', progress: 60, hours: 15 },
    { name: 'Biology', progress: 85, hours: 10 },
    { name: 'Literature', progress: 50, hours: 8 },
  ],
  totalTasksCompleted: 21,
  totalHoursStudied: 45,
  averageCompletionRate: 68,
  streak: 5, // days of consecutive completion
});

/**
 * Sample user profile for guest mode
 */
export const getGuestSampleProfile = () => ({
  id: 'guest-user',
  displayName: 'Guest User',
  email: 'guest@example.com',
  profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
  bio: 'Welcome! Sign up to unlock full features and save your progress.',
  age: null,
  joinedDate: new Date().toISOString(),
});

/**
 * Get all guest sample data in one object
 */
export const getGuestSampleData = () => ({
  tasks: getGuestSampleTasks(),
  notes: getGuestSampleNotes(),
  subjects: getGuestSampleSubjects(),
  analytics: getGuestSampleAnalytics(),
  profile: getGuestSampleProfile(),
});

/**
 * Determine if a user is accessing restricted features
 * Returns { allowed: boolean, message: string }
 */
export const checkGuestFeatureAccess = (featureName) => {
  const allowedFeatures = ['view-dashboard', 'view-tasks', 'view-notes', 'ai-chat-limited', 'view-analytics'];
  const isAllowed = allowedFeatures.includes(featureName);
  
  return {
    allowed: isAllowed,
    message: isAllowed 
      ? 'Guest mode: Limited functionality' 
      : 'Sign up or log in to unlock this feature',
  };
};
