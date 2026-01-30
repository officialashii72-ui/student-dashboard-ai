import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Sparkles, Lock } from 'lucide-react';
import { getGuestDataStats } from '../services/guestService';

/**
 * GuestBanner Component
 * 
 * Displays a persistent banner for guest users showing:
 * - Guest mode indicator
 * - Data count
 * - Sign up CTA to save data permanently
 */
const GuestBanner = () => {
    const { isGuest } = useAuth();
    const navigate = useNavigate();
    const stats = getGuestDataStats();

    if (!isGuest) return null;

    const totalItems = stats.tasks + stats.notes + stats.subjects;

    return (
        <div className="sticky top-20 z-[9] mx-4 sm:mx-8 mt-4 animate-fade-in">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-6 h-6 text-white animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-black text-amber-900 dark:text-amber-100 text-sm uppercase tracking-wider">
                                    Guest Mode Active
                                </h3>
                                {totalItems > 0 && (
                                    <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 rounded-full text-[10px] font-bold">
                                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                    </span>
                                )}
                            </div>
                            <p className="text-amber-700 dark:text-amber-300 text-xs font-medium mt-0.5">
                                {totalItems > 0
                                    ? 'Your data is saved locally. Sign up to keep it forever!'
                                    : 'Create tasks and notes. Sign up anytime to save your progress!'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Lock className="w-4 h-4" />
                            Save Forever
                        </button>
                        <div className="hidden sm:flex items-center gap-1 px-3 py-2 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-amber-200 dark:border-amber-800/30">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wider">
                                Limited Features
                            </span>
                        </div>
                    </div>
                </div>

                {/* Feature Limitations */}
                <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800/30 hidden md:block">
                    <div className="flex items-center gap-6 text-[10px] text-amber-700 dark:text-amber-300 font-medium">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            No cloud backup
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            No team collaboration
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            Limited AI responses
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            Upgrade anytime →
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestBanner;
