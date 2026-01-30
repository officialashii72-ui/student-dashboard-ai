import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    getMembersFromFirestore,
    addMemberToFirestore,
    deleteMemberFromFirestore,
    searchUsers,
    getFriendsFromFirestore,
    removeFriendFromFirestore,
    sendFriendRequest,
    subscribeToFriendRequests,
    handleFriendRequestStatus
} from '../services/firestoreService';
import {
    Users, UserPlus, Trash2, Shield, Loader2, Search,
    UserCheck, UserMinus, Mail, Share2, Copy, Check,
    Clock, Bell, X, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

const Team = () => {
    const { currentUser } = useAuth();

    // States for Manual Team Members
    const [members, setMembers] = useState([]);
    const [name, setName] = useState('');
    const [role, setRole] = useState('Member');
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [searchParams] = useSearchParams();
    const [copied, setCopied] = useState(false);
    const inviteLink = `${window.location.origin}/invite?uid=${currentUser?.uid}`;

    // States for Real Friends & Requests
    const [friends, setFriends] = useState([]);
    const [loadingFriends, setLoadingFriends] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [requests, setRequests] = useState([]);
    const [isRequesting, setIsRequesting] = useState(null);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        toast.success("Invite link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const fetchData = useCallback(async () => {
        if (!currentUser) return;

        try {
            const [memberData, friendData] = await Promise.all([
                getMembersFromFirestore(currentUser.uid),
                getFriendsFromFirestore(currentUser.uid)
            ]);
            setMembers(memberData || []);
            setFriends(friendData || []);
        } catch (error) {
            console.error("Fetch data error:", error);
        } finally {
            setLoadingFriends(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchData();
        if (currentUser) {
            const unsub = subscribeToFriendRequests(currentUser.uid, (data) => {
                // Trigger toast for new requests
                if (data.length > requests.length) {
                    const newReq = data[data.length - 1];
                    toast.info(`New friend request from ${newReq.senderName}!`, {
                        description: "Check your inbox in the Social Hub.",
                    });
                }
                setRequests(data);
            });
            return () => unsub();
        }
    }, [currentUser, fetchData, requests.length]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim() || !currentUser) return;
        setIsSearching(true);
        try {
            const results = await searchUsers(searchTerm, currentUser.uid);
            setSearchResults(results);
            if (results.length === 0) toast.error("No users found with that name/email.");
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Failed to connect to network. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSendRequest = async (targetUser) => {
        if (!currentUser) return;
        setIsRequesting(targetUser.id);
        try {
            await sendFriendRequest(currentUser.uid, currentUser, targetUser.id);
            setSearchResults(prev => prev.filter(u => u.id !== targetUser.id));
            toast.success(`Request sent to ${targetUser.displayName}!`);
        } catch (error) {
            console.error("Request error:", error);
            toast.error("Failed to send request.");
        } finally {
            setIsRequesting(null);
        }
    };

    const handleAccept = async (request) => {
        try {
            await handleFriendRequestStatus(request.id, "accepted", request.senderId, currentUser.uid);
            toast.success(`You are now friends with ${request.senderName}!`);
            fetchData();
        } catch (error) {
            console.error("Accept error:", error);
            toast.error("Failed to accept request.");
        }
    };

    const handleDecline = async (request) => {
        try {
            await handleFriendRequestStatus(request.id, "declined", request.senderId, currentUser.uid);
        } catch (error) {
            console.error("Decline error:", error);
        }
    };

    const handleRemoveFriend = async (friendId) => {
        if (!currentUser) return;
        setFriends(prev => prev.filter(f => f.id !== friendId));
        try {
            await removeFriendFromFirestore(currentUser.uid, friendId);
        } catch (error) {
            console.error("Remove friend error:", error);
            fetchData();
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!name.trim() || !currentUser) return;
        setIsAddingMember(false);
        try {
            await addMemberToFirestore(currentUser.uid, { name, role });
            setName(''); setRole('Member'); fetchData();
        } catch (error) {
            console.error("Error adding member:", error);
        }
    };

    const handleDeleteMember = async (id) => {
        if (!currentUser) return;
        setMembers(prev => prev.filter(m => m.id !== id));
        try { await deleteMemberFromFirestore(currentUser.uid, id); }
        catch (error) { console.error("Error deleting member:", error); fetchData(); }
    };

    return (
        <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-slate-900 dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none transition-transform hover:scale-105">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Social Hub</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Discover partners, manage requests, and build your team.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAddingMember(!isAddingMember)}
                    className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:bg-slate-50 transition-all font-black shadow-sm group"
                >
                    <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    QUICK COLLABORATOR
                </button>
            </div>

            {/* Friend Requests Inbox */}
            {requests.length > 0 && (
                <section className="animate-bounce-subtle">
                    <div className="bg-slate-900 dark:bg-blue-900/40 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                                <Bell className="w-6 h-6 animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">Pending Requests ({requests.length})</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {requests.map(req => (
                                <div key={req.id} className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 flex items-center justify-between group/card hover:bg-white/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center font-black text-2xl">
                                            {req.senderName[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg leading-tight">{req.senderName}</h4>
                                            <p className="text-xs text-blue-200 font-medium">{req.senderEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleAccept(req)} className="bg-blue-600 p-3 rounded-xl hover:bg-blue-700 hover:scale-110 active:scale-90 transition-all shadow-lg">
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDecline(req)} className="bg-white/10 p-3 rounded-xl hover:bg-red-500/50 hover:scale-110 active:scale-90 transition-all">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* User Search Section */}
            <section className="space-y-8 bg-white/50 dark:bg-slate-900/30 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                        <Search className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Discovery Engine</h2>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Input alias or secure email..."
                            className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[2rem] focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none text-slate-900 dark:text-white font-black transition-all shadow-inner"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="px-12 bg-blue-600 text-white rounded-[2rem] font-black hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 dark:shadow-none hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        {isSearching ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "SEARCH NETWORK"}
                    </button>
                </form>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in py-4">
                        {searchResults.map(user => {
                            const isFriend = friends.some(f => f.id === user.id);
                            return (
                                <div key={user.id} className="bg-white dark:bg-slate-950 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:shadow-2xl transition-all duration-500">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white font-black text-2xl shadow-xl">
                                            {user.displayName[0].toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-black text-slate-900 dark:text-white leading-tight truncate">{user.displayName}</h4>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    {isFriend ? (
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-100/50">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleSendRequest(user)}
                                            disabled={isRequesting === user.id}
                                            className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 hover:scale-110 active:scale-90 transition-all shadow-xl shadow-blue-100 dark:shadow-none disabled:opacity-50"
                                        >
                                            {isRequesting === user.id ? <Clock className="w-6 h-6 animate-spin" /> : <UserPlus className="w-6 h-6" />}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Friends Grid */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Active Partners</h2>
                    </div>
                    <span className="px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-400 font-black text-[10px] uppercase rounded-xl border border-slate-100 dark:border-slate-800">
                        Total: {friends.length}
                    </span>
                </div>

                {loadingFriends ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                    </div>
                ) : friends.length === 0 ? (
                    <div className="bg-slate-50/50 dark:bg-slate-950/20 p-20 rounded-[4rem] text-center border-4 border-dashed border-slate-100 dark:border-slate-800/50 group">
                        <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                            <Mail className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Searching for connections...</p>
                        <p className="text-slate-400 mt-2 font-medium">Add friends via search or invite link to start collaborating.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {friends.map(friend => (
                            <div key={friend.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-12 -mt-12 group-hover:bg-red-500/10 transition-colors"></div>
                                <button
                                    onClick={() => handleRemoveFriend(friend.id)}
                                    className="absolute top-6 right-6 p-2 text-slate-200 hover:text-red-500 hover:scale-125 opacity-0 group-hover:opacity-100 transition-all z-10"
                                    title="Revoke Partnership"
                                >
                                    <UserMinus className="w-6 h-6" />
                                </button>
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-4xl mb-6 shadow-2xl relative">
                                        {friend.displayName[0].toUpperCase()}
                                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-slate-900 rounded-xl p-1 shadow-lg">
                                            <div className="w-full h-full bg-emerald-500 rounded-lg animate-pulse"></div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{friend.displayName}</h3>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[120px]">{friend.email}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Invite & Success Section */}
            <div className="pt-12 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="flex items-center gap-8">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center shadow-inner">
                                <Share2 className="w-10 h-10" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tight leading-none mb-2">Invite Network</h2>
                                <p className="text-indigo-100 font-bold opacity-80 uppercase tracking-widest text-xs">Direct Neural Link for Collaboration</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-4 bg-black/20 backdrop-blur-xl p-3 rounded-[2.5rem] border border-white/10 w-full lg:w-auto">
                            <code className="px-6 py-3 text-sm font-black text-indigo-50 leading-none truncate max-w-[200px] md:max-w-[400px]">{inviteLink}</code>
                            <button
                                onClick={handleCopyLink}
                                className={`w-full md:w-auto px-10 py-4 rounded-[1.5rem] font-black uppercase text-sm flex items-center justify-center gap-3 transition-all duration-300 ${copied ? 'bg-emerald-500 text-white scale-105' : 'bg-white text-indigo-600 hover:bg-slate-50 hover:scale-105 active:scale-95'}`}
                            >
                                {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                {copied ? "Neural Link Copied" : "Copy Secure Link"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manual Members Section */}
            {(members.length > 0 || isAddingMember) && (
                <section className="space-y-8 pt-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-white">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">External Operatives</h2>
                    </div>

                    {isAddingMember && (
                        <form onSubmit={handleAddMember} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl animate-fade-in relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Operative Alias</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none font-bold"
                                        placeholder="Identification name..."
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Strategic Role</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none font-bold appearance-none"
                                    >
                                        <option>Member</option>
                                        <option>Lead</option>
                                        <option>Contributor</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-3 relative z-10">
                                <button type="button" onClick={() => setIsAddingMember(false)} className="px-8 py-3 font-black text-slate-400 uppercase text-sm hover:text-slate-600 transition-colors">Discard</button>
                                <button type="submit" className="px-10 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all">Register Operative</button>
                            </div>
                        </form>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {members.map(member => (
                            <div key={member.id} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex justify-between items-center group hover:bg-white dark:hover:bg-slate-900 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xl text-slate-400">
                                        {member.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-black text-slate-900 dark:text-white leading-tight">{member.name}</div>
                                        <div className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1">{member.role}</div>
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteMember(member.id)} className="text-slate-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 hover:scale-125 p-2">
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
