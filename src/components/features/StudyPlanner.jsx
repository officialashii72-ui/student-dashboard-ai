import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { BookOpen, Clock, Plus, Trash2 } from 'lucide-react';

/**
 * StudyPlanner Component
 * 
 * Allows users to allocate study hours to different subjects.
 * Calculates total weekly hours automatically.
 */
const StudyPlanner = () => {
    const [subjects, setSubjects] = useLocalStorage('student-study-plan', []);
    const [subjectNameInput, setSubjectNameInput] = useState(''); // Renamed from newSubject
    const [studyHoursInput, setStudyHoursInput] = useState(1); // Renamed from hours

    /**
     * Adds a new subject to the planner.
     */
    const handleAddSubject = (e) => {
        e.preventDefault();
        if (!subjectNameInput.trim()) return;

        const newSubject = {
            id: Date.now(),
            name: subjectNameInput,
            hours: Number(studyHoursInput)
        };

        setSubjects([...subjects, newSubject]);
        setSubjectNameInput('');
        setStudyHoursInput(1);
    };

    const handleRemoveSubject = (id) => {
        setSubjects(subjects.filter(s => s.id !== id));
    };

    // Calculate total hours for summary
    const totalWeeklyHours = subjects.reduce((acc, curr) => acc + curr.hours, 0);

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
            {/* Header with Stats */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Study Planner
                </h2>
                <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg">
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
                    className="flex-1 pl-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm outline-none"
                />
                <div className="relative w-24">
                    <Clock className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
                    <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={studyHoursInput}
                        onChange={(e) => setStudyHoursInput(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm outline-none"
                    />
                </div>
                <button
                    type="submit"
                    className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                    title="Add Subject"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </form>

            {/* List of Subjects */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {subjects.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        Add subjects to plan your week.
                    </div>
                ) : (
                    subjects.map(subject => (
                        <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-indigo-50/50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-indigo-600 font-bold text-xs shadow-sm">
                                    {subject.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">{subject.name}</h3>
                                    <p className="text-xs text-gray-500">{subject.hours} hours needed</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemoveSubject(subject.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
