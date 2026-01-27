import { TrendingUp, Users, Activity, CheckCircle, StickyNote, ListChecks } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import TaskManager from '../components/features/TaskManager';
import StudyPlanner from '../components/features/StudyPlanner';
import AITaskAssistant from '../components/features/AITaskAssistant';
import Notes from '../components/features/Notes';

const Dashboard = () => {
    const [tasks] = useLocalStorage('student-tasks', []);
    const [notes] = useLocalStorage('student-notes', []);

    // Calculate real-time stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const notesCount = notes.length;

    const stats = [
        {
            label: 'Total Tasks',
            value: totalTasks.toString(),
            change: 'Active',
            trend: 'up',
            icon: ListChecks,
            color: 'text-blue-600',
            bg: 'bg-blue-100'
        },
        {
            label: 'Completed',
            value: completedTasks.toString(),
            change: `${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%`,
            trend: 'up',
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-100'
        },
        {
            label: 'Quick Notes',
            value: notesCount.toString(),
            change: 'Saved',
            trend: 'up',
            icon: StickyNote,
            color: 'text-orange-600',
            bg: 'bg-orange-100'
        },
    ];

    return (
        <div className="space-y-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student Hub</h1>
                    <p className="text-gray-500 mt-1">Manage tasks, study plans, and notes in one place.</p>
                </div>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto">

                {/* Left Column: Task Manager & Study Planner */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                        <TaskManager />
                        <StudyPlanner />
                    </div>

                    <div className="h-[300px]">
                        <Notes />
                    </div>
                </div>

                {/* Right Column: AI Assistant & Calendar/Other */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="h-[300px] lg:h-auto lg:flex-1">
                        <AITaskAssistant />
                    </div>

                    {/* Placeholder for future calendar or activity feed */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 hidden lg:block">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Upcoming Deadlines</h3>
                        <div className="space-y-4">
                            {[1, 2].map((_, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex flex-col items-center justify-center text-xs font-bold leading-none">
                                        <span>DEC</span>
                                        <span className="text-lg">1{i + 2}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Calculus Midterm</p>
                                        <p className="text-xs text-gray-500">Hall B • 10:00 AM</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
