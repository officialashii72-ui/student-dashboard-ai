import { LayoutDashboard, Users, Settings, LogOut, MessageSquare, PieChart, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to sign out', error);
        }
    };
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Team', path: '/team' },
        { icon: MessageSquare, label: 'Messages', path: '/messages' },
        { icon: Sparkles, label: 'AI Tutor', path: '/ai-tutor' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed font-sans inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto transition-colors duration-300
      `}>
                {/* Logo */}
                <div className="flex items-center px-6 h-20 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-200 dark:shadow-none">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-gray-100">
                        Student<span className="text-blue-600 dark:text-blue-400">Hub</span>
                    </span>
                </div>

                <nav className="p-4 space-y-1.5">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) => `
                                flex items-center w-full px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 group
                                ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400'}`} />
                                    {item.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
