import React from 'react';
import { LayoutDashboard, Users, Settings, LogOut, MessageSquare, PieChart } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: Users, label: 'Team', active: false },
        { icon: MessageSquare, label: 'Messages', active: false },
        { icon: PieChart, label: 'Analytics', active: false },
        { icon: Settings, label: 'Settings', active: false },
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
        fixed font-sans inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto transition-colors duration-300
      `}>
                {/* Logo */}
                <div className="flex items-center px-6 h-20 border-b border-gray-50 dark:border-gray-800">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-200 dark:shadow-none">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Student<span className="text-blue-600 dark:text-blue-400">Hub</span>
                    </span>
                </div>

                <nav className="p-4 space-y-1.5">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className={`
                flex items-center w-full px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 group
                ${item.active
                                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md shadow-blue-100 dark:shadow-none'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1'}
              `}
                        >
                            <item.icon className={`w-5 h-5 mr-3 transition-colors ${item.active ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-gray-800">
                    <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
