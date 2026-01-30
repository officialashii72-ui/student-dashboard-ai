import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * Allows authenticated users AND guest users to access the app.
 * Redirects to login only if user explicitly logged out.
 * Shows a loading state while auth is being initialized.
 */
const ProtectedRoute = ({ children }) => {
    const { currentUser, loading, isGuest } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Allow access if user is authenticated OR in guest mode
    if (!currentUser && !isGuest) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
