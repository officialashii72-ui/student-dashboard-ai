import React from 'react';

/**
 * Loading Skeleton Components
 * Content-aware loading states for different sections
 */

// Dashboard skeleton
export const DashboardSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20 mb-3"></div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                </div>
            ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                    ))}
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// Task Manager skeleton
export const TasksSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        <div className="flex items-center justify-between mb-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-40"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
        </div>
        {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Notes skeleton
export const NotesSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        <div className="flex items-center justify-between mb-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// AI Chat skeleton
export const AIChatSkeleton = () => (
    <div className="h-full flex flex-col animate-pulse">
        <div className="flex-1 space-y-4 p-4">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md ${i % 2 === 0 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-slate-100 dark:bg-slate-800'} rounded-2xl p-4`}>
                        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-48 mb-2"></div>
                        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-32"></div>
                    </div>
                </div>
            ))}
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
    </div>
);

// Analytics skeleton
export const AnalyticsSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24 mb-3"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
                </div>
            ))}
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-40 mb-4"></div>
            <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
        </div>
    </div>
);

// Team/Messages skeleton
export const TeamSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-40"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Generic card skeleton
export const CardSkeleton = ({ count = 3 }) => (
    <div className="space-y-4 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-3"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
            </div>
        ))}
    </div>
);

export default {
    DashboardSkeleton,
    TasksSkeleton,
    NotesSkeleton,
    AIChatSkeleton,
    AnalyticsSkeleton,
    TeamSkeleton,
    CardSkeleton
};
