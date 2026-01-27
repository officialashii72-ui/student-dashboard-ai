import React, { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import useLocalStorage from '../../hooks/useLocalStorage';

/**
 * ThemeToggle Component
 * 
 * Manages dark/light mode preference using localStorage and applies the 'dark'
 * class to the document root for Tailwind CSS class-based dark mode.
 */
const ThemeToggle = () => {
    // Check if the user has a theme preference in localStorage, or use system preference
    const getInitialTheme = () => {
        if (typeof window !== 'undefined' && window.localStorage.getItem('theme')) {
            return window.localStorage.getItem('theme') === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const [isDark, setIsDark] = useLocalStorage('theme-dark', getInitialTheme());

    // Apply the theme class to the document element whenever isDark changes
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 group"
            aria-label="Toggle dark mode"
        >
            <div className="relative w-6 h-6 flex items-center justify-center">
                {/* Sun icon for light mode, rotates and fades out when dark */}
                <Sun
                    className={`w-5 h-5 absolute transition-all duration-500 transform ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                        }`}
                />

                {/* Moon icon for dark mode, rotates and fades in when dark */}
                <Moon
                    className={`w-5 h-5 absolute transition-all duration-500 transform ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                        }`}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
