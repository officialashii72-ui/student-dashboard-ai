import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { StickyNote, Plus, X, Save, Loader2 } from 'lucide-react';
import Toast from '../ui/Toast';

const NOTE_COLORS = [
    'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
    'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
    'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
    'bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800 text-pink-900 dark:text-pink-100',
    'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100',
];

/**
 * Notes Component
 * 
 * Allows users to create sticky-note style notes with color coding.
 * Supports adding, deleting, and local persistence.
 */
const Notes = () => {
    // State
    const [notes, setNotes] = useLocalStorage('student-notes', []);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [noteInput, setNoteInput] = useState(''); // Renamed from newNote
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    /**
     * Saves a new note with a random color.
     */
    const handleAddNote = async () => {
        if (!noteInput.trim()) {
            setIsAddingNote(false);
            return;
        }

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulating save delay

        const randomColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];

        const newNoteObject = {
            id: Date.now(),
            text: noteInput,
            color: randomColor,
            date: new Date().toLocaleDateString()
        };

        setNotes([newNoteObject, ...notes]);
        setNoteInput('');
        setIsAddingNote(false);
        setIsLoading(false);
        showToast('Note saved successfully');
    };

    /**
     * Deletes a note by ID.
     */
    const handleDeleteNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
        showToast('Note deleted', 'error');
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col relative transition-colors duration-300">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <StickyNote className="w-5 h-5 text-yellow-500" />
                    Quick Notes
                </h2>
                <button
                    onClick={() => setIsAddingNote(!isAddingNote)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Add new note"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {isAddingNote && (
                    <NoteInputForm
                        value={noteInput}
                        onChange={setNoteInput}
                        onSave={handleAddNote}
                        onCancel={() => setIsAddingNote(false)}
                        loading={isLoading}
                    />
                )}

                {notes.length === 0 && !isAddingNote ? (
                    <EmptyNotesState />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {notes.map(note => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onDelete={() => handleDeleteNote(note.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Sub-component for Empty State
const EmptyNotesState = () => (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mb-4 transition-transform hover:rotate-3 duration-300">
            <StickyNote className="w-8 h-8 text-yellow-400 dark:text-yellow-300" />
        </div>
        <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-base mb-1">No notes found</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px] mx-auto">
            Keep your brilliant ideas safe. Start by adding a quick note!
        </p>
    </div>
);

// Sub-component for Input Form
const NoteInputForm = ({ value, onChange, onSave, onCancel, loading }) => (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-xl animate-fade-in relative">
        {loading && (
            <div className="absolute inset-0 bg-yellow-50/80 dark:bg-yellow-900/80 z-10 flex items-center justify-center rounded-xl">
                <Loader2 className="w-5 h-5 animate-spin text-yellow-600 dark:text-yellow-400" />
            </div>
        )}
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your note..."
            autoFocus
            className="w-full bg-transparent border-none resize-none focus:ring-0 text-gray-800 dark:text-gray-100 text-sm placeholder-yellow-800/50 dark:placeholder-yellow-200/50"
            rows={3}
            disabled={loading}
        />
        <div className="flex justify-end gap-2 mt-2">
            <button
                onClick={onCancel}
                disabled={loading}
                className="p-1.5 text-yellow-700 hover:bg-yellow-100 rounded-lg disabled:opacity-50"
            >
                <X className="w-4 h-4" />
            </button>
            <button
                onClick={onSave}
                disabled={loading}
                className="p-1.5 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 disabled:opacity-50"
            >
                <Save className="w-4 h-4" />
            </button>
        </div>
    </div>
);

// Sub-component for individual Note Cards
const NoteCard = ({ note, onDelete }) => (
    <div className={`${note.color} p-4 rounded-xl border relative group shadow-sm hover:shadow-md transition-shadow animate-fade-in`}>
        <button
            onClick={onDelete}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 rounded transition-all"
            title="Delete note"
        >
            <X className="w-3 h-3" />
        </button>
        <p className="text-sm font-medium whitespace-pre-wrap">{note.text}</p>
        <p className="text-[10px] mt-2 opacity-70 font-semibold">{note.date}</p>
    </div>
);

export default Notes;
