import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * Only allows authenticated users (not guests) to access content
 * Use this for features that require real user accounts
 * 
 * Redirects:
 * - Guest users → show guest entry point or login
 * - Unauthenticated users → login page
 */
const ProtectedRoute = ({ children, onGuestAccess = null }) => {
    const { isAuthenticated, isGuest, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Only authenticated users (not guests) can access this route
    if (isAuthenticated) {
        return children;
    }

    // If guest tried to access, show optional callback or redirect
    if (isGuest && onGuestAccess) {
        return onGuestAccess();
    }

    // Redirect to login if neither guest nor authenticated
    return <Navigate to="/login" />;
};

export default ProtectedRoute;
