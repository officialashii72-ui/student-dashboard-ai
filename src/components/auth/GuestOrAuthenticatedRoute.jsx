
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * GuestOrAuthenticatedRoute Component
 * 
 * Allows both guest users AND authenticated users to access content
 * Redirects only unauthenticated users (not in guest mode) to login
 * 
 * Use this for pages that should be accessible in both modes:
 * - Dashboard (shows sample data for guests)
 * - AI Chat (limited responses for guests)
 * - Analytics (shows sample analytics for guests)
 * 
 * Props:
 * - children: Component to render if user is guest or authenticated
 * - fallback: Optional component to show while loading
 */
const GuestOrAuthenticatedRoute = ({ children, fallback = null }) => {
  const { isGuest, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      fallback || (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    );
  }

  // Allow if user is guest OR authenticated
  if (isGuest || isAuthenticated) {
    return children;
  }

  // Redirect to login if neither guest nor authenticated
  return <Navigate to="/login" />;
};

export default GuestOrAuthenticatedRoute;
