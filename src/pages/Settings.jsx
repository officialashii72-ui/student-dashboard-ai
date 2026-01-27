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
        <div className="max-w-4xl mx-auto space-y-8 pb-10 animate-fade-in">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200 dark:shadow-none">
                    <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-gray-100 tracking-tight">Command Center</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Calibrate your personal workspace preferences.</p>
                </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-none">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800/30">
                        <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100 uppercase tracking-tight">Identity & Reach</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Your digital presence on the platform.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            Display Alias
                        </span>
                        <div className="px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-black text-slate-800 dark:text-slate-200">
                            {currentUser?.displayName || 'Student Hub Legend'}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            Secure Email
                        </span>
                        <div className="px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-black text-slate-800 dark:text-slate-200">
                            {currentUser?.email}
                        </div>
                    </div>
                </div>
            </div>

            {/* Appearance Section */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center border border-orange-100 dark:border-orange-800/30">
                            <Palette className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100 uppercase tracking-tight">Visual Interface</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Switch between light and dark modes.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
                        <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Interface Mode</span>
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* Account Management */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-none">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-800/30">
                        <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100 uppercase tracking-tight">Safety & Session</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Protect your data and manage sessions.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-red-50/50 dark:bg-red-900/10 rounded-3xl border border-red-100/50 dark:border-red-900/20 gap-4">
                    <div>
                        <h4 className="text-sm font-black text-red-700 dark:text-red-400 uppercase tracking-wider text-center sm:text-left">End Connection</h4>
                        <p className="text-xs text-red-600 dark:text-red-500 mt-0.5 font-medium text-center sm:text-left">Disconnect from your student profile securely.</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-10 py-3.5 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-black shadow-lg shadow-red-100 dark:shadow-none active:scale-95 w-full sm:w-auto justify-center"
                    >
                        <LogOut className="w-5 h-5" />
                        TERMINATE SESSION
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
