import React, { useState } from 'react';
import useFirestore from '../hooks/useFirestore';
import { Users, UserPlus, Trash2, Mail, Shield, Loader2 } from 'lucide-react';

const Team = () => {
    const { docs: members, loading, addItem, deleteItem } = useFirestore('team');
    const [name, setName] = useState('');
    const [role, setRole] = useState('Member');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            await addItem({ name, role });
            setName('');
            setRole('Member');
            setIsAdding(false);
        } catch (error) {
            console.error("Error adding member:", error);
        }
    };

    return (
        <div className="space-y-6 pb-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Team Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your study group or project team.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-200 dark:shadow-none"
                >
                    <UserPlus className="w-5 h-5" />
                    Add Member
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddMember} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Member Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none dark:text-gray-200"
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none dark:text-gray-200"
                            >
                                <option>Member</option>
                                <option>Lead</option>
                                <option>Contributor</option>
                                <option>Reviewer</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold"
                        >
                            Save Member
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                    </div>
                ) : members.length === 0 ? (
                    <div className="col-span-full bg-white dark:bg-gray-800 p-12 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-gray-900 dark:text-gray-100 font-bold text-lg mb-1">No team members yet</h3>
                        <p className="text-gray-500 dark:text-gray-400">Add your collaborators to start working together.</p>
                    </div>
                ) : (
                    members.map(member => (
                        <div key={member.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                    {member.name[0].toUpperCase()}
                                </div>
                                <button
                                    onClick={() => deleteItem(member.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{member.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Shield className="w-4 h-4 text-blue-500" />
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
