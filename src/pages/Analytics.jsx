import React from 'react';
import useFirestore from '../hooks/useFirestore';
import { PieChart, ListChecks, CheckCircle, StickyNote, Activity, Clock, TrendingUp } from 'lucide-react';

const Analytics = () => {
    const { docs: tasks } = useFirestore('tasks');
    const { docs: notes } = useFirestore('notes');
    const { docs: subjects } = useFirestore('planner');

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const totalHours = subjects.reduce((acc, curr) => acc + curr.hours, 0);

    const statsCards = [
        { label: 'Completion Rate', value: `${progressPercentage}%`, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
        { label: 'Total Tasks', value: totalTasks, icon: ListChecks, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { label: 'Notes Saved', value: notes.length, icon: StickyNote, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
        { label: 'Study Hours', value: `${totalHours}h`, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' }
    ];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Performance Analytics</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Track your productivity and study habits in real-time.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-[1.02] duration-300">
                        <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Detailed Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Task Breakdown */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Task Completion</h2>
                    </div>

                    <div className="relative pt-1">
                        <div className="flex mb-4 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 px-3 uppercase rounded-full text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400">
                                    Progress Overview
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold inline-block text-blue-600 dark:text-blue-400">
                                    {progressPercentage}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-100 dark:bg-gray-900">
                            <div
                                style={{ width: `${progressPercentage}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000"
                            ></div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
                            You've completed <span className="font-bold text-gray-900 dark:text-gray-100">{completedTasks}</span> out of <span className="font-bold text-gray-900 dark:text-gray-100">{totalTasks}</span> tasks.
                            {progressPercentage === 100 ? " Excellent job! You're all caught up." : " Keep pushing to clear your list!"}
                        </p>
                    </div>
                </div>

                {/* Study Time Allocation */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <PieChart className="w-6 h-6 text-purple-600" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Study Allocation</h2>
                    </div>

                    <div className="space-y-4">
                        {subjects.length === 0 ? (
                            <p className="text-gray-500 text-center py-10 italic">No study planner data available.</p>
                        ) : (
                            subjects.map((sub, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                        <span className="font-bold text-gray-800 dark:text-gray-200">{sub.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                                        <Clock className="w-4 h-4" />
                                        {sub.hours}h
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
