import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    getSubjectsFromFirestore,
    addSubjectToFirestore,
    deleteSubjectFromFirestore
} from '../../services/firestoreService';
import { BookOpen, Clock, Plus, Trash2, Loader2 } from 'lucide-react';

const StudyPlanner = () => {
    const { currentUser } = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [isPlannerLoading, setIsPlannerLoading] = useState(true);

    // UI State
    const [subjectNameInput, setSubjectNameInput] = useState('');
    const [studyHoursInput, setStudyHoursInput] = useState(1);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchSubjects = useCallback(async () => {
        if (!currentUser) return;
        setIsPlannerLoading(true);
        try {
            const data = await getSubjectsFromFirestore(currentUser.uid);
            if (data && data.length > 0) {
                setSubjects(data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsPlannerLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const handleAddSubject = async (e) => {
        e.preventDefault();
        if (!subjectNameInput.trim() || !currentUser) return;

        const optimisticSubject = {
            id: 'temp-' + Date.now(),
            name: subjectNameInput,
            hours: Number(studyHoursInput),
            createdAt: { seconds: Date.now() / 1000 }
        };

        // UI Update (Optimistic)
        setSubjects(prev => [optimisticSubject, ...prev]);
        setSubjectNameInput('');
        setStudyHoursInput(1);
        setIsActionLoading(true);

        try {
            await addSubjectToFirestore(currentUser.uid, {
                name: optimisticSubject.name,
                hours: optimisticSubject.hours
            });
        } catch (error) {
            console.error("Failed to add subject:", error);
            await fetchSubjects(); // Rollback/Resync
        } finally {
            setIsActionLoading(false);
            await fetchSubjects(); // Sync with server for real ID
        }
    };

    const handleRemoveSubject = async (id) => {
        if (!currentUser) return;

        // UI Update (Optimistic)
        setSubjects(prev => prev.filter(sub => sub.id !== id));

        try {
            await deleteSubjectFromFirestore(currentUser.uid, id);
        } catch (error) {
            console.error("Failed to remove subject:", error);
            await fetchSubjects(); // Rollback/Resync
        }
    };

    // Calculate total hours for summary
    const totalWeeklyHours = subjects.reduce((acc, curr) => acc + curr.hours, 0);

    return (
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-sm h-full flex flex-col transition-colors duration-300">
            {/* Header with Stats */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Study Planner
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100/50 dark:border-indigo-800/30">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-tighter">
                        {totalWeeklyHours}h / week
                    </span>
                </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAddSubject} className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={subjectNameInput}
                    onChange={(e) => setSubjectNameInput(e.target.value)}
                    placeholder="Subject..."
                    disabled={isActionLoading}
                    className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:border-indigo-500 text-sm outline-none transition-all dark:text-slate-200 placeholder-slate-400"
                />
                <div className="relative w-24">
                    <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={studyHoursInput}
                        onChange={(e) => setStudyHoursInput(e.target.value)}
                        disabled={isActionLoading}
                        className="w-full pl-3 pr-2 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:border-indigo-500 text-sm outline-none transition-all dark:text-slate-200"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isActionLoading || !subjectNameInput.trim()}
                    className="p-2.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 disabled:opacity-50"
                    title="Add Subject"
                >
                    {isActionLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                </button>
            </form>

            {/* List of Subjects */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {isPlannerLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                ) : subjects.length === 0 ? (
                    <div className="text-center py-10 px-4">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                            Add subjects to plan your week.
                        </p>
                    </div>
                ) : (
                    subjects.map(subject => (
                        <div key={subject.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                    {subject.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{subject.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subject.hours} hours planned</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemoveSubject(subject.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudyPlanner;
