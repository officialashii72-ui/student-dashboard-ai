import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    getMembersFromFirestore,
    addMemberToFirestore,
    deleteMemberFromFirestore,
    searchUsers,
    addFriendToFirestore,
    getFriendsFromFirestore,
    removeFriendFromFirestore
} from '../services/firestoreService';
import { Users, UserPlus, Trash2, Shield, Loader2, Search, UserCheck, UserMinus, Mail, Share2, Copy, Check } from 'lucide-react';

const Team = () => {
    const { currentUser } = useAuth();

    // States for Manual Team Members
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [name, setName] = useState('');
    const [role, setRole] = useState('Member');
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [searchParams] = useSearchParams();
    const [copied, setCopied] = useState(false);
    const invitedSuccess = searchParams.get('invited');
    const inviteLink = `${window.location.origin}/invite?uid=${currentUser?.uid}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // States for Real Friends System
    const [friends, setFriends] = useState([]);
    const [loadingFriends, setLoadingFriends] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const fetchData = useCallback(async () => {
        if (!currentUser) return;

        // Fetch Manual Members
        setLoadingMembers(true);
        try {
            const memberData = await getMembersFromFirestore(currentUser.uid);
            setMembers(memberData || []);
        } catch (error) {
            console.error("Fetch members error:", error);
        } finally {
            setLoadingMembers(false);
        }

        // Fetch Real Friends
        setLoadingFriends(true);
        try {
            const friendData = await getFriendsFromFirestore(currentUser.uid);
            setFriends(friendData || []);
        } catch (error) {
            console.error("Fetch friends error:", error);
        } finally {
            setLoadingFriends(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Search Logic ---
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim() || !currentUser) return;

        setIsSearching(true);
        try {
            const results = await searchUsers(searchTerm, currentUser.uid);
            setSearchResults(results);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsSearching(false);
        }
    };

    // --- Friend Logic ---
    const handleAddFriend = async (user) => {
        if (!currentUser) return;

        // Optimistic UI
        setFriends(prev => [user, ...prev]);
        setSearchResults(prev => prev.filter(r => r.id !== user.id));

        try {
            await addFriendToFirestore(currentUser.uid, user);
        } catch (error) {
            console.error("Add friend error:", error);
            await fetchData(); // Rollback
        }
    };

    const handleRemoveFriend = async (friendId) => {
        if (!currentUser) return;

        // Optimistic UI
        setFriends(prev => prev.filter(f => f.id !== friendId));

        try {
            await removeFriendFromFirestore(currentUser.uid, friendId);
        } catch (error) {
            console.error("Remove friend error:", error);
            await fetchData(); // Rollback
        }
    };

    // --- Manual Member Logic ---
    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!name.trim() || !currentUser) return;

        const optimisticMember = {
            id: 'temp-' + Date.now(),
            name,
            role,
            createdAt: { seconds: Date.now() / 1000 }
        };

        setMembers(prev => [optimisticMember, ...prev]);
        setName('');
        setRole('Member');
        setIsAddingMember(false);

        try {
            await addMemberToFirestore(currentUser.uid, { name: optimisticMember.name, role: optimisticMember.role });
        } catch (error) {
            console.error("Error adding member:", error);
        } finally {
            fetchData();
        }
    };

    const handleDeleteMember = async (id) => {
        if (!currentUser) return;
        setMembers(prev => prev.filter(m => m.id !== id));
        try {
            await deleteMemberFromFirestore(currentUser.uid, id);
        } catch (error) {
            console.error("Error deleting member:", error);
            fetchData();
        }
    };

    return (
        <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Team & Friends</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Collaborate with fellow students and manage your study circle.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsAddingMember(!isAddingMember)}
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 transition-all font-bold shadow-sm"
                    >
                        <UserPlus className="w-5 h-5" />
                        Quick Add
                    </button>
                </div>
            </div>

            {/* Invite & Success Section */}
            <div className="space-y-6">
                {invitedSuccess && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 p-6 rounded-3xl flex items-center gap-4 animate-bounce-subtle">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-emerald-900 dark:text-emerald-100 font-black">Connection Established!</h3>
                            <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">You are now friends and can start chatting immediately.</p>
                        </div>
                    </div>
                )}

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200 dark:shadow-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                <Share2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Spread the word</h2>
                                <p className="text-blue-100 font-medium opacity-90">Share your unique link to add friends automatically.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 w-full md:w-auto">
                            <code className="px-4 text-xs font-bold text-blue-50 truncate max-w-[200px] md:max-w-none">{inviteLink}</code>
                            <button
                                onClick={handleCopyLink}
                                className={`px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${copied ? 'bg-emerald-500' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Search Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <Search className="w-6 h-6 text-blue-500" />
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Find Friends</h2>
                </div>

                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none text-slate-900 dark:text-white font-medium transition-all shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="px-8 bg-blue-600 text-white rounded-3xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none disabled:opacity-50"
                    >
                        {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
                    </button>
                </form>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {searchResults.map(user => {
                            const isFriend = friends.some(f => f.id === user.id);
                            return (
                                <div key={user.id} className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-[2.5rem] border border-blue-100/50 dark:border-blue-800/30 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl">
                                            {user.displayName[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{user.displayName}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[150px]">{user.email}</p>
                                        </div>
                                    </div>
                                    {isFriend ? (
                                        <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-2xl">
                                            <UserCheck className="w-5 h-5" />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAddFriend(user)}
                                            className="bg-white dark:bg-slate-800 text-blue-600 p-3 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                        >
                                            <UserPlus className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Friends List */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <UserCheck className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Friends</h2>
                </div>

                {loadingFriends ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                    </div>
                ) : friends.length === 0 ? (
                    <div className="bg-slate-50 dark:bg-slate-900/30 p-12 rounded-[2.5rem] text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500 dark:text-slate-400 font-bold">No friends added yet. Start searching above!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {friends.map(friend => (
                            <div key={friend.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group relative">
                                <button
                                    onClick={() => handleRemoveFriend(friend.id)}
                                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <UserMinus className="w-5 h-5" />
                                </button>
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-3xl mb-4 shadow-lg">
                                        {friend.displayName[0].toUpperCase()}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{friend.displayName}</h3>
                                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm font-bold mt-1">
                                        <Mail className="w-3.5 h-3.5" />
                                        {friend.email}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Manual Members Section */}
            {(members.length > 0 || isAddingMember) && (
                <section className="space-y-6 pt-10 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Shield className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Collaborators (Manual)</h2>
                        </div>
                    </div>

                    {isAddingMember && (
                        <form onSubmit={handleAddMember} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Role</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl"
                                    >
                                        <option>Member</option>
                                        <option>Lead</option>
                                        <option>Contributor</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAddingMember(false)} className="px-6 py-2.5 font-bold">Cancel</button>
                                <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-black">Save</button>
                            </div>
                        </form>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {members.map(member => (
                            <div key={member.id} className="bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold">
                                        {member.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white">{member.name}</div>
                                        <div className="text-xs font-bold text-blue-600 uppercase tracking-tighter">{member.role}</div>
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteMember(member.id)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Team;
