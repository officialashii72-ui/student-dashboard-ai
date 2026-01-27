import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Mail, LogOut, Shield, Palette } from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';

const SettingsPage = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to sign out', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and app preferences.</p>
            </div>

            {/* Profile Section */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <User className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Personal Profile</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <User className="w-3 h-3" /> Display Name
                        </span>
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{currentUser?.displayName || 'Student Hub User'}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Mail className="w-3 h-3" /> Email Address
                        </span>
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{currentUser?.email}</p>
                    </div>
                </div>
            </div>

            {/* Appearance Section */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <Palette className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Appearance</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Customize how StudentHub looks on your device.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Toggle Theme</span>
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* Account Management */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Account Safety</h2>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
                    <div>
                        <h4 className="text-sm font-bold text-red-800 dark:text-red-400">Secure Logout</h4>
                        <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">End your session on this device securely.</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-200 dark:shadow-none"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
