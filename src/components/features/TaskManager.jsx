import React, { useState } from 'react';
import useFirestore from '../../hooks/useFirestore';
import { Plus, Trash2, CheckCircle, Circle, Edit2, X, ClipboardList, Loader2 } from 'lucide-react';
import Toast from '../ui/Toast';

/**
 * TaskManager Component
 * 
 * Manages a list of tasks with Firestore persistence.
 * Features real-time updates and optimistic UI updates.
 */
const TaskManager = () => {
    // Firestore Data
    const { docs: tasks, loading: isFirestoreLoading, addItem, updateItem, deleteItem } = useFirestore('tasks');

    // UI State
    const [newTaskInput, setNewTaskInput] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingTaskText, setEditingTaskText] = useState('');
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    /**
     * Adds a new task to Firestore.
     */
    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskInput.trim()) return;

        setIsActionLoading(true);
        try {
            await addItem({
                text: newTaskInput,
                completed: false
            });
            setNewTaskInput('');
            showToast('Task added successfully');
        } catch (error) {
            showToast('Failed to add task', 'error');
            console.error(error);
        } finally {
            setIsActionLoading(false);
        }
    };

    /**
     * Toggles the completion status of a task in Firestore.
     */
    const toggleTaskCompletion = async (taskId, currentStatus) => {
        try {
            await updateItem(taskId, { completed: !currentStatus });
        } catch (error) {
            showToast('Failed to update task', 'error');
            console.error(error);
        }
    };

    /**
     * Deletes a task from Firestore.
     */
    const handleDeleteTask = async (taskId) => {
        try {
            await deleteItem(taskId);
            showToast('Task deleted', 'error');
        } catch (error) {
            showToast('Failed to delete task', 'error');
            console.error(error);
        }
    };

    // Start editing mode
    const initiateEdit = (task) => {
        setEditingId(task.id);
        setEditingTaskText(task.text);
    };

    // Save changes to Firestore
    const saveTaskChanges = async (taskId) => {
        if (!editingTaskText.trim()) return;
        try {
            await updateItem(taskId, { text: editingTaskText });
            setEditingId(null);
            showToast('Task updated');
        } catch (error) {
            showToast('Failed to update task', 'error');
            console.error(error);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingTaskText('');
    };

    return (
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-sm h-full flex flex-col transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                    Task Manager
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100/50 dark:border-blue-800/30">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-tighter">
                        {tasks.filter(task => task.completed).length}/{tasks.length} Done
                    </span>
                </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAddTask} className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 text-sm outline-none transition-all dark:text-slate-200 placeholder-slate-400"
                />
                <button
                    type="submit"
                    className="p-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none active:scale-95"
                    title="Add Task"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </form>

            {/* Task List Container */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {isFirestoreLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800">
                            <ClipboardList className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                        </div>
                        <h3 className="text-slate-900 dark:text-gray-100 font-bold mb-1">Your list is empty</h3>
                        <p className="text-slate-400 dark:text-slate-500 text-xs">Stay productive by adding your first task above.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tasks.map(task => (
                            <div
                                key={task.id}
                                className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${task.completed
                                    ? 'bg-slate-50/50 dark:bg-slate-900/20 border-transparent opacity-60'
                                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 shadow-sm hover:shadow-md'
                                    }`}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <button
                                        onClick={() => toggleTaskCompletion(task.id, task.completed)}
                                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'border-slate-200 dark:border-slate-700 bg-transparent hover:border-blue-400'
                                            }`}
                                    >
                                        {task.completed && <CheckCircle className="w-4 h-4 fill-white text-blue-600" />}
                                    </button>
                                    <span className={`text-sm font-semibold transition-all ${task.completed
                                        ? 'text-slate-400 line-through'
                                        : 'text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                        }`}>
                                        {task.text}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Sub-component for Empty State
const EmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 transition-transform hover:scale-110 duration-300">
            <ClipboardList className="w-8 h-8 text-blue-400 dark:text-blue-300" />
        </div>
        <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-base mb-1">Your task list is empty</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px] mx-auto">
            Ready to tackle your goals? Add your first task above!
        </p>
    </div>
);

// Sub-component for individual Task Items
const TaskItem = ({
    task,
    isEditing,
    editingText,
    onToggle,
    onDelete,
    onEditStart,
    onEditSave,
    onEditCancel,
    onEditChange
}) => (
    <div className={`group flex items-center justify-between p-3 rounded-xl transition-all ${task.completed ? 'bg-gray-50 dark:bg-gray-900/50' : 'hover:bg-blue-50/50 dark:hover:bg-blue-900/20'}`}>
        <div className="flex items-center gap-3 flex-1">
            {/* Checkbox Button */}
            <button
                onClick={onToggle}
                className={`flex-shrink-0 transition-colors ${task.completed ? 'text-green-500' : 'text-gray-300 hover:text-blue-50'}`}
            >
                {task.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </button>

            {/* Content Area */}
            {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                    <input
                        type="text"
                        value={editingText}
                        onChange={(e) => onEditChange(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-200 rounded"
                        autoFocus
                    />
                    <button onClick={onEditSave} className="text-green-600 hover:bg-green-50 p-1 rounded">
                        <CheckCircle className="w-4 h-4" />
                    </button>
                    <button onClick={onEditCancel} className="text-red-500 hover:bg-red-50 p-1 rounded">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <span className={`text-sm font-medium transition-all ${task.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                    {task.text}
                </span>
            )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!task.completed && !isEditing && (
                <button
                    onClick={onEditStart}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
            )}
            <button
                onClick={handleDeleteTask}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    </div>
);

export default TaskManager;
