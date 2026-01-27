import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    getNotesFromFirestore,
    addNoteToFirestore,
    deleteNoteFromFirestore
} from '../../services/firestoreService';
import { Plus, Trash2, StickyNote, Search, Clock, Tag, Loader2, X } from 'lucide-react';

const NOTE_COLORS = [
    { name: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-400', darkBg: 'dark:bg-yellow-900/20', darkBorder: 'dark:border-yellow-800', darkText: 'dark:text-yellow-400' },
    { name: 'blue', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', dot: 'bg-blue-400', darkBg: 'dark:bg-blue-900/20', darkBorder: 'dark:border-blue-800', darkText: 'dark:text-blue-400' },
    { name: 'green', bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700', dot: 'bg-green-400', darkBg: 'dark:bg-green-900/20', darkBorder: 'dark:border-green-800', darkText: 'dark:text-green-400' },
    { name: 'purple', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', dot: 'bg-purple-400', darkBg: 'dark:bg-purple-900/20', darkBorder: 'dark:border-purple-800', darkText: 'dark:text-purple-400' },
    { name: 'pink', bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700', dot: 'bg-pink-400', darkBg: 'dark:bg-pink-900/20', darkBorder: 'dark:border-pink-800', darkText: 'dark:text-pink-400' },
];

const Notes = () => {
    const { currentUser } = useAuth();
    const [notes, setNotes] = useState([]);
    const [isNotesLoading, setIsNotesLoading] = useState(true);

    // UI State
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
    const [isAdding, setIsAdding] = useState(false);
    const [noteSearchQuery, setNoteSearchQuery] = useState('');

    const fetchNotes = useCallback(async () => {
        if (!currentUser) return;
        setIsNotesLoading(true);
        try {
            const data = await getNotesFromFirestore(currentUser.uid);
            if (data && data.length > 0) {
                setNotes(data);
            } else {
                console.log("Firestore returned no notes, using local empty state.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsNotesLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    /**
     * Adds a new note to Firestore.
     */
    const handleAddNote = async (e) => {
        e.preventDefault();
        if ((!noteTitle.trim() && !noteContent.trim()) || !currentUser) return;

        const optimisticNote = {
            id: 'temp-' + Date.now(),
            title: noteTitle,
            content: noteContent,
            color: selectedColor.name,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            createdAt: { seconds: Date.now() / 1000 }
        };

        // UI Update (Optimistic)
        setNotes(prev => [optimisticNote, ...prev]);
        setNoteTitle('');
        setNoteContent('');
        setIsAdding(false);

        try {
            await addNoteToFirestore(currentUser.uid, {
                title: optimisticNote.title,
                content: optimisticNote.content,
                color: optimisticNote.color,
                date: optimisticNote.date
            });
        } catch (error) {
            console.error("Failed to add note:", error);
            await fetchNotes(); // Rollback/Resync
        } finally {
            await fetchNotes(); // Sync with server for real ID
        }
    };

    const handleDeleteNote = async (id) => {
        if (!currentUser) return;

        // UI Update (Optimistic)
        setNotes(prev => prev.filter(note => note.id !== id));

        try {
            await deleteNoteFromFirestore(currentUser.uid, id);
        } catch (error) {
            console.error("Failed to delete note:", error);
            await fetchNotes(); // Rollback/Resync
        }
    };

    // Filter notes based on search query
    const filteredNotes = notes.filter(note =>
        (note.title || '').toLowerCase().includes(noteSearchQuery.toLowerCase()) ||
        (note.content || '').toLowerCase().includes(noteSearchQuery.toLowerCase())
    );

    return (
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-sm h-full flex flex-col transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100 flex items-center gap-2">
                    <StickyNote className="w-5 h-5 text-orange-500" />
                    Quick Notes
                </h2>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <div className="relative group">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 transition-colors group-focus-within:text-orange-500" />
                        <input
                            type="text"
                            placeholder="Find notes..."
                            value={noteSearchQuery}
                            onChange={(e) => setNoteSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30 focus:border-orange-500 outline-none w-full sm:w-40 transition-all dark:text-slate-200 placeholder-slate-400"
                        />
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`p-2 rounded-xl transition-all shadow-sm ${isAdding ? 'bg-orange-500 text-white rotate-45' : 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 border border-slate-100 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-orange-900/20'}`}
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Note Entry Area */}
            {isAdding && (
                <form onSubmit={handleAddNote} className="mb-6 animate-fade-in bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md">
                    <input
                        type="text"
                        placeholder="Note title..."
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        className="w-full bg-transparent border-none text-sm font-bold mb-2 focus:ring-0 outline-none dark:text-slate-100 placeholder-slate-400"
                        autoFocus
                    />
                    <textarea
                        placeholder="Write your thoughts..."
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        className="w-full bg-transparent border-none text-sm focus:ring-0 outline-none resize-none h-20 dark:text-slate-300 placeholder-slate-400/80"
                    />

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-2">
                            {NOTE_COLORS.map(color => (
                                <button
                                    key={color.name}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-6 h-6 rounded-full transition-transform hover:scale-125 ${color.dot} ${selectedColor.name === color.name ? 'ring-2 ring-offset-2 ring-orange-500 dark:ring-offset-slate-950' : ''}`}
                                />
                            ))}
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-1.5 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 dark:shadow-none"
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
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Tag className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                            {noteSearchQuery ? 'No matching notes found.' : 'Your notes are empty. Tap the + icon.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredNotes.map(note => {
                            const color = NOTE_COLORS.find(c => c.name === note.color) || NOTE_COLORS[0];
                            return (
                                <div
                                    key={note.id}
                                    className={`${color.bg} ${color.darkBg} border ${color.border} ${color.darkBorder} p-5 rounded-3xl hover:shadow-xl transition-all group relative`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className={`text-sm font-bold ${color.text} ${color.darkText} line-clamp-1`}>{note.title || 'Untitled'}</h3>
                                        <button
                                            onClick={() => handleDeleteNote(note.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 bg-white/50 dark:bg-slate-900/50 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <p className={`text-xs ${color.text} ${color.darkText} opacity-80 mb-6 line-clamp-4 leading-relaxed font-medium`}>
                                        {note.content}
                                    </p>
                                    <div className="flex items-center gap-1.5 opacity-60 mt-auto">
                                        <Clock className={`w-3.5 h-3.5 ${color.text} ${color.darkText}`} />
                                        <span className={`text-[10px] font-bold ${color.text} ${color.darkText} tracking-wide`}>{note.date}</span>
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
