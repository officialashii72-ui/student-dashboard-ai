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
        fixed font-sans inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto
      `}>
                {/* Logo */}
                <div className="flex items-center justify-center h-16 border-b border-gray-100">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Nexus
                    </span>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className={`
                flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group
                ${item.active
                                    ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
                        >
                            <item.icon className={`w-5 h-5 mr-3 ${item.active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                    <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
