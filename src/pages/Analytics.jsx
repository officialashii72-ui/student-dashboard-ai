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
        { label: 'Completion Rate', value: `${progressPercentage}%`, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50/50 dark:bg-green-900/20', border: 'border-green-100/50 dark:border-green-800/30' },
        { label: 'Total Tasks', value: totalTasks, icon: ListChecks, color: 'text-blue-600', bg: 'bg-blue-50/50 dark:bg-blue-900/20', border: 'border-blue-100/50 dark:border-blue-800/30' },
        { label: 'Notes Saved', value: notes.length, icon: StickyNote, color: 'text-orange-600', bg: 'bg-orange-50/50 dark:bg-orange-900/20', border: 'border-orange-100/50 dark:border-orange-800/30' },
        { label: 'Study Hours', value: `${totalHours}h`, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50/50 dark:bg-indigo-900/20', border: 'border-indigo-100/50 dark:border-indigo-800/30' }
    ];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-100">Performance Analytics</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Track your productivity and study habits in real-time.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, idx) => (
                    <div key={idx} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-none hover:-translate-y-1 group">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.border} border rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Detailed Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Task Breakdown */}
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100 uppercase tracking-tight">Task Completion</h2>
                    </div>

                    <div className="relative pt-1">
                        <div className="flex mb-4 items-center justify-between">
                            <div>
                                <span className="text-xs font-bold inline-block py-1 px-3 uppercase rounded-full text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                    Progress Overview
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-black inline-block text-blue-600 dark:text-blue-400">
                                    {progressPercentage}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                            <div
                                style={{ width: `${progressPercentage}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000"
                            ></div>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-6 leading-relaxed font-medium">
                            You've completed <span className="font-bold text-slate-900 dark:text-gray-100">{completedTasks}</span> out of <span className="font-bold text-slate-900 dark:text-gray-100">{totalTasks}</span> tasks.
                            {progressPercentage === 100 ? " Excellent job! You're all caught up." : " Keep pushing to clear your list!"}
                        </p>
                    </div>
                </div>

                {/* Study Time Allocation */}
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 rounded-xl">
                            <PieChart className="w-6 h-6 text-purple-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100 uppercase tracking-tight">Study Allocation</h2>
                    </div>

                    <div className="space-y-4">
                        {subjects.length === 0 ? (
                            <div className="text-center py-10 italic text-slate-400 dark:text-slate-500 font-medium">No study planner data available.</div>
                        ) : (
                            subjects.map((sub, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-950 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform"></div>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{sub.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black">
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
