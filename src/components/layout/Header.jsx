import React from 'react';
import { Menu, Bell, Search, User as UserIcon } from 'lucide-react';

import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onMenuClick }) => {
    const { currentUser } = useAuth();

    // Get initials for profile placeholder
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };
    return (
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-gray-500 dark:text-gray-400 rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Search Bar - Hidden on small mobile */}
                <div className="hidden sm:flex items-center relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 w-64 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none dark:text-gray-200"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <ThemeToggle />

                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
                </button>

                <div className="flex items-center gap-3 pl-2 sm:border-l border-gray-200 dark:border-gray-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {currentUser?.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {currentUser?.email}
                        </p>
                    </div>
                    <button className="p-1 bg-gray-100 dark:bg-gray-800 rounded-full ring-2 ring-transparent hover:ring-gray-200 dark:hover:ring-gray-700 transition-all overflow-hidden">
                        {currentUser?.photoURL ? (
                            <img
                                src={currentUser.photoURL}
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                {getInitials(currentUser?.displayName || currentUser?.email)}
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
