import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Settings, User, Mail, LogOut, Shield, Palette,
    Camera, Save, Upload, Loader2, CheckCircle, Hash
} from 'lucide-react';
import { getUserProfile, updateUserProfile } from '../services/firestoreService';
import ThemeToggle from '../components/ui/ThemeToggle';

const SettingsPage = () => {
    const { currentUser, logout, updateProfileInfo } = useAuth();
    const navigate = useNavigate();

    // Form States
    const [name, setName] = useState(currentUser?.displayName || '');
    const [age, setAge] = useState('');
    const [photo, setPhoto] = useState(currentUser?.photoURL || '');

    // UI States
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUser) return;
            try {
                const profile = await getUserProfile(currentUser.uid);
                if (profile) {
                    setAge(profile.age || '');
                    if (profile.photoURL) setPhoto(profile.photoURL);
                }
            } catch (error) {
                console.error("Profile fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [currentUser]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image too large (Max 2MB)' });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPhoto(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setIsSaving(true);

        try {
            // 1. Update Auth Profile
            await updateProfileInfo(name, photo);

            // 2. Update Firestore Profile
            await updateUserProfile(currentUser.uid, {
                displayName: name,
                age: age,
                photoURL: photo,
                email: currentUser.email
            });

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        } catch (error) {
            console.error("Save error:", error);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to sign out', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-fade-in px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-slate-900 dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none">
                        <Settings className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-gray-100 tracking-tight">Settings</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your personal profile and preferences.</p>
                    </div>
                </div>
            </div>

            {/* Success/Error Message */}
            {message.text && (
                <div className={`p-6 rounded-3xl flex items-center gap-4 animate-bounce-subtle border ${message.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-100'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50 text-red-900 dark:text-red-100'
                    }`}>
                    <CheckCircle className={`w-6 h-6 ${message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`} />
                    <span className="font-bold">{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                {/* Profile Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[3rem] border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-slate-100 dark:hover:shadow-none transition-all duration-500">
                    <div className="p-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Identity Profile</h2>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative group/avatar">
                                    <div className="w-40 h-40 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl transition-transform group-hover/avatar:scale-105 duration-500">
                                        {photo ? (
                                            <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                                                <User className="w-20 h-20" />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white p-4 rounded-2xl cursor-pointer hover:bg-blue-700 hover:scale-110 transition-all shadow-xl shadow-blue-200 dark:shadow-none active:scale-95">
                                        <Camera className="w-6 h-6" />
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                </div>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em]">High Res Preferred</p>
                            </div>

                            {/* Inputs Section */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Display Alias</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Current Age</label>
                                    <div className="relative group">
                                        <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="number"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all"
                                            placeholder="Years old"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Primary Communication</label>
                                    <div className="relative bg-slate-50 dark:bg-slate-950/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex items-center gap-4 opacity-70">
                                        <Mail className="w-5 h-5 text-slate-400" />
                                        <span className="font-bold text-slate-800 dark:text-slate-300">{currentUser?.email}</span>
                                        <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                            <Shield className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[10px] font-black text-slate-500 uppercase">Verified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800/50 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center gap-3 px-12 py-5 bg-blue-600 text-white rounded-3xl font-black shadow-2xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                                {isSaving ? 'UPDATING...' : 'PERSIST CHANGES'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Extras Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Appearance */}
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div>
                            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/40 rounded-2xl flex items-center justify-center mb-6">
                                <Palette className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Visual Engine</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">Toggle between light and deep night modes.</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-inner">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Interface Mode</span>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Sign Out */}
                    <div className="bg-red-50/30 dark:bg-red-900/5 backdrop-blur-md p-8 rounded-[3rem] border border-red-50 dark:border-red-900/20 flex flex-col justify-between group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div>
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-2xl flex items-center justify-center mb-6">
                                <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-black text-red-900 dark:text-red-400 mb-2">Connection Control</h3>
                            <p className="text-sm text-red-700/60 dark:text-red-500/60 font-medium mb-8">Disconnect from your student hub securely.</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="bg-red-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-red-100 dark:shadow-none hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                        >
                            TERMINATE SESSION
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SettingsPage;
