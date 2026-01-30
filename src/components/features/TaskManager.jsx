
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    getTasksFromFirestore,
    addTaskToFirestore,
    updateTaskInFirestore,
    deleteTaskFromFirestore
} from '../../services/firestoreService';
import { Plus, Trash2, CheckCircle, Edit2, X, ClipboardList, Loader2 } from 'lucide-react';
import Toast from '../ui/Toast';

const TaskManager = ({ initialTasks, isGuest }) => {
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState(initialTasks || []);
    const [isFirestoreLoading, setIsFirestoreLoading] = useState(!isGuest);

    // UI State
    const [newTaskInput, setNewTaskInput] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingTaskText, setEditingTaskText] = useState('');
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const fetchTasks = useCallback(async () => {
        if (isGuest || !currentUser) return;
        setIsFirestoreLoading(true);
        try {
            const data = await getTasksFromFirestore(currentUser.uid);
            if (data && data.length > 0) {
                setTasks(data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            showToast('Failed to sync with cloud', 'error');
        } finally {
            setIsFirestoreLoading(false);
        }
    }, [currentUser, isGuest]);

    useEffect(() => {
        if (!isGuest) {
            fetchTasks();
        }
    }, [fetchTasks, isGuest]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskInput.trim()) return;

        if (isGuest) {
            const optimisticTask = {
                id: 'temp-' + Date.now(),
                text: newTaskInput,
                completed: false,
            };
            setTasks(prev => [optimisticTask, ...prev]);
            setNewTaskInput('');
            showToast('This is a demo. Sign up to save tasks!', 'info');
            return;
        }

        const optimisticTask = {
            id: 'temp-' + Date.now(),
            text: newTaskInput,
            completed: false,
            createdAt: { seconds: Date.now() / 1000 }
        };

        setTasks(prev => [optimisticTask, ...prev]);
        setNewTaskInput('');
        setIsActionLoading(true);

        try {
            await addTaskToFirestore(currentUser.uid, {
                text: optimisticTask.text,
                completed: optimisticTask.completed
            });
            showToast('Task added successfully');
        } catch (error) {
            showToast('Failed to add task', 'error');
            console.error(error);
        } finally {
            setIsActionLoading(false);
            await fetchTasks();
        }
    };

    const toggleTaskCompletion = async (taskId, currentStatus) => {
        if (isGuest) {
            setTasks(prev => prev.map(task =>
                task.id === taskId ? { ...task, completed: !currentStatus } : task
            ));
            return;
        }

        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, completed: !currentStatus } : task
        ));

        try {
            await updateTaskInFirestore(currentUser.uid, taskId, { completed: !currentStatus });
        } catch (error) {
            showToast('Failed to update task', 'error');
            console.error(error);
            await fetchTasks();
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (isGuest) {
            setTasks(prev => prev.filter(task => task.id !== taskId));
            return;
        }

        setTasks(prev => prev.filter(task => task.id !== taskId));

        try {
            await deleteTaskFromFirestore(currentUser.uid, taskId);
            showToast('Task deleted', 'error');
        } catch (error) {
            showToast('Failed to delete task', 'error');
            console.error(error);
            await fetchTasks();
        }
    };
    const initiateEdit = (task) => {
        setEditingId(task.id);
        setEditingTaskText(task.text);
    };

    const saveTaskChanges = async (taskId) => {
        if (!editingTaskText.trim()) return;
        if (isGuest) {
            setTasks(tasks.map(t => t.id === taskId ? { ...t, text: editingTaskText } : t));
            setEditingId(null);
            return;
        }

        try {
            await updateTaskInFirestore(currentUser.uid, taskId, { text: editingTaskText });
            setEditingId(null);
            showToast('Task updated');
            await fetchTasks();
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
export default TaskManager;
