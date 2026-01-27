import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { Plus, Trash2, CheckCircle, Circle, Edit2, X, ClipboardList, Loader2 } from 'lucide-react';
import Toast from '../ui/Toast';

/**
 * TaskManager Component
 * 
 * Manages a list of tasks with CRUD functionality and local storage persistence.
 * Features loading states, toast notifications, and optimistic UI updates.
 */
const TaskManager = () => {
    // State Management
    const [tasks, setTasks] = useLocalStorage('student-tasks', []);
    const [newTaskInput, setNewTaskInput] = useState(''); // Renamed for clarity

    // Editing State
    const [editingId, setEditingId] = useState(null);
    const [editingTaskText, setEditingTaskText] = useState(''); // Renamed for clarity

    // UI State
    const [isLoading, setIsLoading] = useState(false); // Renamed to bool convention
    const [toast, setToast] = useState(null);

    // Helper to show temporary toast notifications
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    /**
     * Adds a new task to the list with a simulated network delay.
     */
    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskInput.trim()) return;

        setIsLoading(true);
        // Simulate network delay for better UX feel
        await new Promise(resolve => setTimeout(resolve, 600));

        setTasks([...tasks, { id: Date.now(), text: newTaskInput, completed: false }]);
        setNewTaskInput('');
        setIsLoading(false);
        showToast('Task added successfully');
    };

    /**
     * Toggles the completion status of a task.
     */
    const toggleTaskCompletion = (taskId) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    /**
     * Deletes a task by ID.
     */
    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
        showToast('Task deleted', 'error');
    };

    // Start editing mode for a specific task
    const initiateEdit = (task) => {
        setEditingId(task.id);
        setEditingTaskText(task.text);
    };

    // Save changes to the currently edited task
    const saveTaskChanges = (taskId) => {
        if (!editingTaskText.trim()) return;
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, text: editingTaskText } : task
        ));
        setEditingId(null);
        showToast('Task updated');
    };

    // Cancel editing mode
    const cancelEdit = () => {
        setEditingId(null);
        setEditingTaskText('');
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

            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Task Manager
            </h2>

            {/* Input Form */}
            <form onSubmit={handleAddTask} className="relative mb-6">
                <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Add a new task..."
                    disabled={isLoading}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={isLoading || !newTaskInput.trim()}
                    className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                </button>
            </form>

            {/* Task List Container */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {tasks.length === 0 ? (
                    <EmptyState />
                ) : (
                    tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            isEditing={editingId === task.id}
                            editingText={editingTaskText}
                            onToggle={() => toggleTaskCompletion(task.id)}
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
    <div className="text-center py-10 text-gray-400 flex flex-col items-center justify-center h-48">
        <div className="bg-gray-50 p-4 rounded-full mb-3">
            <ClipboardList className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-500">No tasks yet</p>
        <p className="text-xs text-gray-400 mt-1">Adopt a growth mindset by adding a task above!</p>
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
    <div className={`group flex items-center justify-between p-3 rounded-xl transition-all ${task.completed ? 'bg-gray-50' : 'hover:bg-blue-50/50'}`}>
        <div className="flex items-center gap-3 flex-1">
            {/* Checkbox Button */}
            <button
                onClick={onToggle}
                className={`flex-shrink-0 transition-colors ${task.completed ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'}`}
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
                        className="flex-1 px-2 py-1 text-sm border rounded"
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
                <span className={`text-sm font-medium transition-all ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
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
                onClick={onDelete}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    </div>
);

export default TaskManager;
