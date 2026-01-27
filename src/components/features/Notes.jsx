import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { StickyNote, Plus, X, Save, Loader2 } from 'lucide-react';
import Toast from '../ui/Toast';

const NOTE_COLORS = [
    'bg-yellow-100 border-yellow-200 text-yellow-900',
    'bg-blue-100 border-blue-200 text-blue-900',
    'bg-green-100 border-green-200 text-green-900',
    'bg-pink-100 border-pink-200 text-pink-900',
    'bg-purple-100 border-purple-200 text-purple-900',
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
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col relative">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
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
    <div className="text-center py-10 text-gray-400 flex flex-col items-center justify-center h-full min-h-[150px]">
        <div className="bg-yellow-50 p-4 rounded-full mb-3">
            <StickyNote className="w-8 h-8 text-yellow-300" />
        </div>
        <p className="text-sm font-medium text-gray-500">No notes yet</p>
        <p className="text-xs text-gray-400 mt-1">Capture your brilliant ideas here!</p>
    </div>
);

// Sub-component for Input Form
const NoteInputForm = ({ value, onChange, onSave, onCancel, loading }) => (
    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl animate-fade-in relative">
        {loading && (
            <div className="absolute inset-0 bg-yellow-50/80 z-10 flex items-center justify-center rounded-xl">
                <Loader2 className="w-5 h-5 animate-spin text-yellow-600" />
            </div>
        )}
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your note..."
            autoFocus
            className="w-full bg-transparent border-none resize-none focus:ring-0 text-gray-800 text-sm placeholder-yellow-800/50"
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
