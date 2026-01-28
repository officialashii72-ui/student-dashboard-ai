
import React, { useState, useEffect, useCallback } from 'react';
import {
    TrendingUp, Users, Activity, CheckCircle, StickyNote, ListChecks,
    ListTodo, CheckCircle2, FileText, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
    getTasksFromFirestore,
    getNotesFromFirestore,
    getSubjectsFromFirestore
} from '../services/firestoreService';
import TaskManager from '../components/features/TaskManager';
import StudyPlanner from '../components/features/StudyPlanner';
import AITaskAssistant from '../components/features/AITaskAssistant';
import Notes from '../components/features/Notes';

const sampleData = {
    tasks: [
        { id: '1', title: 'Complete Math Homework', completed: false },
        { id: '2', title: 'Read Chapter 4 of History', completed: true },
        { id: '3', title: 'Prepare for Chemistry Quiz', completed: false },
    ],
    notes: [
        { id: '1', title: 'Meeting Notes', content: 'Discussed project timeline.' },
        { id: '2', title: 'Ideas', content: 'Brainstorming for new app feature.' },
    ],
    subjects: [
        { id: '1', name: 'Mathematics', hours: 5 },
        { id: '2', name: 'History', hours: 3 },
    ],
};

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllData = useCallback(async () => {
        if (!currentUser) {
            setTasks(sampleData.tasks);
            setNotes(sampleData.notes);
            setSubjects(sampleData.subjects);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const [tasksData, notesData, subjectsData] = await Promise.all([
                getTasksFromFirestore(currentUser.uid),
                getNotesFromFirestore(currentUser.uid),
                getSubjectsFromFirestore(currentUser.uid)
            ]);
            setTasks(tasksData || []);
            setNotes(notesData || []);
            setSubjects(subjectsData || []);
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalNotes = notes.length;
    const totalHours = subjects.reduce((acc, curr) => acc + curr.hours, 0);

    const stats = [
        {
            label: 'Total Tasks',
            value: totalTasks,
            icon: ListTodo,
            color: 'text-blue-600',
            bg: 'bg-blue-50/50 dark:bg-blue-900/20',
            border: 'border-blue-100/50 dark:border-blue-800/30'
        },
        {
            label: 'Completed',
            value: completedTasks,
            icon: CheckCircle2,
            color: 'text-green-600',
            bg: 'bg-green-50/50 dark:bg-green-900/20',
            border: 'border-green-100/50 dark:border-green-800/30'
        },
        {
            label: 'Quick Notes',
            value: totalNotes,
            icon: FileText,
            color: 'text-orange-600',
            bg: 'bg-orange-50/50 dark:bg-orange-900/20',
            border: 'border-orange-100/50 dark:border-orange-800/30'
        },
        {
            label: 'Study Hours',
            value: totalHours,
            icon: Clock,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50/50 dark:bg-indigo-900/20',
            border: 'border-indigo-100/50 dark:border-indigo-800/30'
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="bg-slate-900 dark:bg-slate-900/80 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <span className="inline-block px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-xs font-bold uppercase tracking-widest mb-4">
                            Student Dashboard v2.0
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
                            Elevate Your Learning with <span className="text-blue-400">AI Precision.</span>
                        </h2>
                        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                            Track your progress, manage notes, and plan your study sessions with our new Firestore-powered dashboard.
                        </p>
                    </div>
                    <div className="flex -space-x-3 overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="inline-block h-12 w-12 rounded-2xl ring-4 ring-slate-900 bg-slate-800 flex items-center justify-center border border-slate-700">
                                <span className="text-xs font-bold">User</span>
                            </div>
                        ))}
                        <div className="flex items-center justify-center h-12 w-12 rounded-2xl ring-4 ring-slate-900 bg-blue-600 border border-blue-500 text-xs font-bold">
                            +10
                        </div>
                    </div>
                </div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-none hover:-translate-y-1 group`}
                    >
                        <div className={`p-3 rounded-2xl ${item.bg} border ${item.border} w-fit mb-4 transition-transform group-hover:scale-110`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">{item.label}</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                            {item.value || '0'}
                        </h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-1 h-full">
                    <AITaskAssistant />
                </div>

                <div className="space-y-8">
                    <TaskManager initialTasks={tasks} isGuest={!currentUser} />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-8">
                <div className="h-[500px]">
                    <Notes initialNotes={notes} isGuest={!currentUser} />
                </div>
                <div className="h-[500px]">
                    <StudyPlanner initialSubjects={subjects} isGuest={!currentUser} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
