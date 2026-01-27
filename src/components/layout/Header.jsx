import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

/**
 * Header Component
 * 
 * Styled with the Soft Light (Slate) aesthetic.
 */
const Header = ({ onMenuClick }) => {
    const { currentUser } = useAuth();

    return (
        <header className="h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 lg:hidden text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="hidden sm:block">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-gray-100">
                        Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Student'}!
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Ready to crush your goals today?
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-6">
                {/* Search Bar */}
                <div className="hidden md:flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30 transition-all">
                    <Search className="w-4 h-4 text-slate-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="bg-transparent border-none text-xs focus:ring-0 w-32 lg:w-48 text-slate-900 dark:text-slate-200 placeholder-slate-400"
                    />
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />

                    <button className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all relative group">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
                    </button>

                    <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-100 dark:border-slate-800">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-slate-900 dark:text-gray-100">
                                {currentUser?.displayName || 'Student User'}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                                Premium Plan
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-100 dark:shadow-none">
                            {currentUser?.photoURL ? (
                                <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full rounded-[10px] object-cover" />
                            ) : (
                                <div className="w-full h-full rounded-[10px] bg-white dark:bg-slate-900 flex items-center justify-center">
                                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                                        {(currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'S').toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
