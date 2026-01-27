import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

/**
 * ThemeToggle Component
 * 
 * Manages dark/light mode preference using Firestore and applies the 'dark'
 * class to the document root.
 */
const ThemeToggle = () => {
    const { currentUser } = useAuth();
    const [isDark, setIsDark] = useState(false);

    // Sync with Firestore settings
    useEffect(() => {
        if (!currentUser) return;

        const docRef = doc(db, 'users', currentUser.uid, 'settings', 'appearance');
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setIsDark(data.theme === 'dark');
            } else {
                // Default to system preference if no Firestore setting exists
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setIsDark(systemPrefersDark);
            }
        });

        return unsubscribe;
    }, [currentUser]);

    // Apply the theme class to the document element
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const toggleTheme = async () => {
        if (!currentUser) return;

        const newTheme = isDark ? 'light' : 'dark';
        const docRef = doc(db, 'users', currentUser.uid, 'settings', 'appearance');

        try {
            await setDoc(docRef, { theme: newTheme }, { merge: true });
        } catch (error) {
            console.error("Failed to save theme setting:", error);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 group"
            aria-label="Toggle dark mode"
        >
            <div className="relative w-6 h-6 flex items-center justify-center">
                <Sun
                    className={`w-5 h-5 absolute transition-all duration-500 transform ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                        }`}
                />
                <Moon
                    className={`w-5 h-5 absolute transition-all duration-500 transform ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                        }`}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;

