
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

/**
 * AuthContext
 * 
 * Manages user authentication state including:
 * - currentUser: Firebase auth user (null if guest or not logged in)
 * - isGuest: Boolean indicating if user is in guest mode
 * - loginAs: Function to manually set as authenticated
 * - logout: Function to clear auth
 * - enterGuestMode: Function to enter guest mode
 */
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if guest mode preference is stored
    const savedGuestMode = localStorage.getItem('guestMode') === 'true';
    
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is logged in
        setCurrentUser(user);
        setIsGuest(false);
        localStorage.removeItem('guestMode');
      } else {
        // User is not logged in
        setCurrentUser(null);
        if (savedGuestMode) {
          // Restore guest mode if previously enabled
          setIsGuest(true);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Enter guest mode - allows users to explore the app without authentication
   */
  const enterGuestMode = () => {
    setCurrentUser(null);
    setIsGuest(true);
    localStorage.setItem('guestMode', 'true');
  };

  /**
   * Exit guest mode and proceed to login/signup
   */
  const exitGuestMode = () => {
    setIsGuest(false);
    localStorage.removeItem('guestMode');
  };

  /**
   * Log out user (clear both auth and guest state)
   */
  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setIsGuest(false);
      localStorage.removeItem('guestMode');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    currentUser,
    isGuest,
    isAuthenticated: !!currentUser && !isGuest,
    loading,
    enterGuestMode,
    exitGuestMode,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
