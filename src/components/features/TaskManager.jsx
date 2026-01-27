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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col relative transition-colors duration-300">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Task Manager
            </h2>

            {/* Input Form */}
            <form onSubmit={handleAddTask} className="relative mb-6">
                <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Add a new task..."
                    disabled={isActionLoading}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all outline-none disabled:opacity-50 dark:text-gray-200"
                />
                <button
                    type="submit"
                    disabled={isActionLoading || !newTaskInput.trim()}
                    className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                </button>
            </form>

            {/* Task List Container */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {isFirestoreLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : tasks.length === 0 ? (
                    <EmptyState />
                ) : (
                    tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            isEditing={editingId === task.id}
                            editingText={editingTaskText}
                            onToggle={() => toggleTaskCompletion(task.id, task.completed)}
                            onDelete={() => handleDeleteTask(task.id)}
                            onEditStart={() => initiateEdit(task)}
                            onEditSave={() => saveTaskChanges(task.id)}
                            onEditCancel={cancelEdit}
                            onEditChange={setEditingTaskText}
                        />
                    ))
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
