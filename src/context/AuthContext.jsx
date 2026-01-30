import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import { syncUserProfile } from '../services/firestoreService';
import {
    setGuestMode,
    isGuestMode,
    generateGuestId,
    migrateGuestDataToFirestore,
    getGuestDataStats
} from '../services/guestService';
import * as firestoreService from '../services/firestoreService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const [guestId, setGuestId] = useState(null);

    // Check for guest mode on mount
    useEffect(() => {
        const guestMode = isGuestMode();
        if (guestMode) {
            const gId = generateGuestId();
            setIsGuest(true);
            setGuestId(gId);
        }
    }, []);

    const enableGuestMode = () => {
        setGuestMode(true);
        const gId = generateGuestId();
        setIsGuest(true);
        setGuestId(gId);
        setLoading(false);
    };

    const signup = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Migrate guest data if exists
        if (isGuest) {
            try {
                const stats = getGuestDataStats();
                if (stats.tasks > 0 || stats.notes > 0 || stats.subjects > 0) {
                    await migrateGuestDataToFirestore(userCredential.user.uid, firestoreService);
                    console.log('Guest data migrated successfully');
                    setGuestMode(false);
                    setIsGuest(false);
                    setGuestId(null);
                }
            } catch (error) {
                console.error('Migration failed:', error);
            }
        }

        return userCredential;
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);

        // Migrate guest data if exists
        if (isGuest) {
            try {
                const stats = getGuestDataStats();
                if (stats.tasks > 0 || stats.notes > 0 || stats.subjects > 0) {
                    await migrateGuestDataToFirestore(userCredential.user.uid, firestoreService);
                    console.log('Guest data migrated successfully');
                    setGuestMode(false);
                    setIsGuest(false);
                    setGuestId(null);
                }
            } catch (error) {
                console.error('Migration failed:', error);
            }
        }

        return userCredential;
    };

    const updateProfileInfo = async (name, photo) => {
        if (!auth.currentUser) return;
        await updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo
        });
        // Force state refresh
        setCurrentUser({ ...auth.currentUser });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                syncUserProfile(user);
                // User signed in, disable guest mode
                if (isGuest) {
                    setGuestMode(false);
                    setIsGuest(false);
                    setGuestId(null);
                }
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [isGuest]);

    const value = {
        currentUser,
        login,
        signup,
        logout,
        googleSignIn,
        updateProfileInfo,
        loading,
        isGuest,
        guestId,
        enableGuestMode
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
