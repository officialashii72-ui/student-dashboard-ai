import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    getMembersFromFirestore,
    addMemberToFirestore,
    deleteMemberFromFirestore
} from '../services/firestoreService';
import { Users, UserPlus, Trash2, Shield, Loader2 } from 'lucide-react';

const Team = () => {
    const { currentUser } = useAuth();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [role, setRole] = useState('Member');
    const [isAdding, setIsAdding] = useState(false);

    const fetchMembers = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await getMembersFromFirestore(currentUser.uid);
            if (data && data.length > 0) {
                setMembers(data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!name.trim() || !currentUser) return;

        const optimisticMember = {
            id: 'temp-' + Date.now(),
            name,
            role,
            createdAt: { seconds: Date.now() / 1000 }
        };

        // UI Update (Optimistic)
        setMembers(prev => [optimisticMember, ...prev]);
        setName('');
        setRole('Member');
        setIsAdding(false);

        try {
            await addMemberToFirestore(currentUser.uid, { name: optimisticMember.name, role: optimisticMember.role });
        } catch (error) {
            console.error("Error adding member:", error);
            await fetchMembers(); // Rollback/Resync
        } finally {
            await fetchMembers(); // Sync with server for real ID
        }
    };

    const handleDeleteMember = async (id) => {
        if (!currentUser) return;

        // UI Update (Optimistic)
        setMembers(prev => prev.filter(member => member.id !== id));

        try {
            await deleteMemberFromFirestore(currentUser.uid, id);
        } catch (error) {
            console.error("Error deleting member:", error);
            await fetchMembers(); // Rollback/Resync
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-100">Team Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your study group or project team with ease.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100 dark:shadow-none animate-bounce-subtle"
                >
                    <UserPlus className="w-5 h-5" />
                    Add Member
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddMember} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-xl animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Member Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Alex Johnson"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none text-slate-900 dark:text-slate-200 font-medium transition-all"
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none text-slate-900 dark:text-slate-200 font-medium transition-all appearance-none"
                            >
                                <option>Member</option>
                                <option>Lead</option>
                                <option>Contributor</option>
                                <option>Reviewer</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            Nevermind
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-black shadow-lg shadow-blue-100 dark:shadow-none"
                        >
                            Save Member
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full flex justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                    </div>
                ) : members.length === 0 ? (
                    <div className="col-span-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
                        <div className="w-20 h-20 bg-blue-50/50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-100/50 dark:border-blue-800/30">
                            <Users className="w-10 h-10 text-blue-500" />
                        </div>
                        <h3 className="text-slate-900 dark:text-gray-100 font-black text-xl mb-2">Build your dream team</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">Invite your friends and classmates to start collaborating on projects in real-time.</p>
                    </div>
                ) : (
                    members.map(member => (
                        <div key={member.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-none transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-bl-[5rem] -mr-8 -mt-8 transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20"></div>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-200 dark:shadow-none transform group-hover:rotate-6 transition-transform">
                                    {member.name[0].toUpperCase()}
                                </div>
                                <button
                                    onClick={() => handleDeleteMember(member.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-gray-100 mb-2 relative z-10">{member.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-bold relative z-10 uppercase tracking-tighter">
                                <div className="p-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                                </div>
                                {member.role}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Team;
