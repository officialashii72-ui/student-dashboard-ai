import React, { useState } from 'react';
import useFirestore from '../../hooks/useFirestore';
import { Plus, Trash2, StickyNote, Search, Clock, Tag, Loader2 } from 'lucide-react';

const NOTE_COLORS = [
    { name: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-400', darkBg: 'dark:bg-yellow-900/20', darkBorder: 'dark:border-yellow-800', darkText: 'dark:text-yellow-400' },
    { name: 'blue', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', dot: 'bg-blue-400', darkBg: 'dark:bg-blue-900/20', darkBorder: 'dark:border-blue-800', darkText: 'dark:text-blue-400' },
    { name: 'green', bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700', dot: 'bg-green-400', darkBg: 'dark:bg-green-900/20', darkBorder: 'dark:border-green-800', darkText: 'dark:text-green-400' },
    { name: 'purple', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', dot: 'bg-purple-400', darkBg: 'dark:bg-purple-900/20', darkBorder: 'dark:border-purple-800', darkText: 'dark:text-purple-400' },
    { name: 'pink', bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700', dot: 'bg-pink-400', darkBg: 'dark:bg-pink-900/20', darkBorder: 'dark:border-pink-800', darkText: 'dark:text-pink-400' },
];

/**
 * Notes Component
 * 
 * A simple note-taking tool with Firestore persistence and real-time updates.
 */
const Notes = () => {
    // Firestore Data
    const { docs: notes, loading: isNotesLoading, addItem, deleteItem } = useFirestore('notes');

    // UI State
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
    const [isAdding, setIsAdding] = useState(false);
    const [noteSearchQuery, setNoteSearchQuery] = useState('');

    /**
     * Adds a new note to Firestore.
     */
    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!noteTitle.trim() && !noteContent.trim()) return;

        try {
            await addItem({
                title: noteTitle,
                content: noteContent,
                color: selectedColor.name,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            });
            setNoteTitle('');
            setNoteContent('');
            setIsAdding(false);
        } catch (error) {
            console.error("Failed to add note:", error);
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await deleteItem(id);
        } catch (error) {
            console.error("Failed to delete note:", error);
        }
    };

    // Filter notes based on search query
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(noteSearchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(noteSearchQuery.toLowerCase())
    );

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <StickyNote className="w-5 h-5 text-orange-500" />
                    Quick Notes
                </h2>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            placeholder="Find notes..."
                            value={noteSearchQuery}
                            onChange={(e) => setNoteSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30 outline-none w-full sm:w-40 transition-all dark:text-gray-200"
                        />
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`p-2 rounded-xl transition-all ${isAdding ? 'bg-orange-500 text-white rotate-45' : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100'}`}
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Note Entry Area */}
            {isAdding && (
                <form onSubmit={handleAddNote} className="mb-6 animate-fade-in bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <input
                        type="text"
                        placeholder="Note title..."
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        className="w-full bg-transparent border-none text-sm font-bold mb-2 focus:ring-0 outline-none dark:text-gray-100"
                        autoFocus
                    />
                    <textarea
                        placeholder="Write your thoughts..."
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        className="w-full bg-transparent border-none text-sm focus:ring-0 outline-none resize-none h-20 dark:text-gray-300"
                    />

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-2">
                            {NOTE_COLORS.map(color => (
                                <button
                                    key={color.name}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-6 h-6 rounded-full transition-transform hover:scale-125 ${color.dot} ${selectedColor.name === color.name ? 'ring-2 ring-offset-2 ring-orange-500 dark:ring-offset-gray-900' : ''}`}
                                />
                            ))}
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors"
                        >
                            Save Note
                        </button>
                    </div>
                </form>
            )}

            {/* Notes List Container */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {isNotesLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                    </div>
                ) : filteredNotes.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Tag className="w-8 h-8 text-gray-300 dark:text-gray-700" />
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                            {noteSearchQuery ? 'No matching notes found.' : 'No notes yet. Click + to add one.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredNotes.map(note => {
                            const color = NOTE_COLORS.find(c => c.name === note.color) || NOTE_COLORS[0];
                            return (
                                <div
                                    key={note.id}
                                    className={`${color.bg} ${color.darkBg} border ${color.border} ${color.darkBorder} p-4 rounded-2xl hover:shadow-lg transition-all group relative`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`text-sm font-bold ${color.text} ${color.darkText} line-clamp-1`}>{note.title || 'Untitled'}</h3>
                                        <button
                                            onClick={() => handleDeleteNote(note.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <p className={`text-xs ${color.text} ${color.darkText} opacity-80 mb-4 line-clamp-3 leading-relaxed`}>
                                        {note.content}
                                    </p>
                                    <div className="flex items-center gap-1.5 opacity-60">
                                        <Clock className={`w-3 h-3 ${color.text} ${color.darkText}`} />
                                        <span className={`text-[10px] font-bold ${color.text} ${color.darkText}`}>{note.date}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};


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
