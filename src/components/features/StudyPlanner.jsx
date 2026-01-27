import React, { useState } from 'react';
import useFirestore from '../../hooks/useFirestore';
import { BookOpen, Clock, Plus, Trash2, Loader2 } from 'lucide-react';

/**
 * StudyPlanner Component
 * 
 * Allows users to allocate study hours to different subjects with Firestore persistence.
 */
const StudyPlanner = () => {
    // Firestore Data
    const { docs: subjects, loading: isPlannerLoading, addItem, deleteItem } = useFirestore('planner');

    // UI State
    const [subjectNameInput, setSubjectNameInput] = useState('');
    const [studyHoursInput, setStudyHoursInput] = useState(1);
    const [isActionLoading, setIsActionLoading] = useState(false);

    /**
     * Adds a new subject to the planner in Firestore.
     */
    const handleAddSubject = async (e) => {
        e.preventDefault();
        if (!subjectNameInput.trim()) return;

        setIsActionLoading(true);
        try {
            await addItem({
                name: subjectNameInput,
                hours: Number(studyHoursInput)
            });
            setSubjectNameInput('');
            setStudyHoursInput(1);
        } catch (error) {
            console.error("Failed to add subject:", error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleRemoveSubject = async (id) => {
        try {
            await deleteItem(id);
        } catch (error) {
            console.error("Failed to remove subject:", error);
        }
    };

    // Calculate total hours for summary
    const totalWeeklyHours = subjects.reduce((acc, curr) => acc + curr.hours, 0);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col transition-colors duration-300">
            {/* Header with Stats */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Study Planner
                </h2>
                <span className="text-xs font-bold px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    {totalWeeklyHours}h / week
                </span>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAddSubject} className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={subjectNameInput}
                    onChange={(e) => setSubjectNameInput(e.target.value)}
                    placeholder="Subject..."
                    disabled={isActionLoading}
                    className="flex-1 pl-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:border-indigo-500 text-sm outline-none dark:text-gray-200"
                />
                <div className="relative w-24">
                    <Clock className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
                    <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={studyHoursInput}
                        onChange={(e) => setStudyHoursInput(e.target.value)}
                        disabled={isActionLoading}
                        className="w-full pl-8 pr-2 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:border-indigo-500 text-sm outline-none dark:text-gray-200"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isActionLoading || !subjectNameInput.trim()}
                    className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    title="Add Subject"
                >
                    {isActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                </button>
            </form>

            {/* List of Subjects */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {isPlannerLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                ) : subjects.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                        Add subjects to plan your week.
                    </div>
                ) : (
                    subjects.map(subject => (
                        <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs shadow-sm">
                                    {subject.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{subject.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{subject.hours} hours needed</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemoveSubject(subject.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
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

