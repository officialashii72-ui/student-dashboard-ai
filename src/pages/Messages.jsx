import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    getFriendsFromFirestore,
    getOrCreateChat,
    sendChatMessage,
    subscribeToChatMessages,
    sendGlobalMessage,
    subscribeToGlobalChat
} from '../services/firestoreService';
import { Send, MessageSquare, Loader2, Users, ArrowLeft, Globe, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Messages = () => {
    const { currentUser } = useAuth();
    const [friends, setFriends] = useState([]);
    const [selectedChat, setSelectedChat] = useState({ id: 'global', type: 'global', name: 'Global Team Chat' });
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingFriends, setLoadingFriends] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef();

    // Fetch Friends List
    const fetchFriends = useCallback(async () => {
        if (!currentUser) return;
        setLoadingFriends(true);
        try {
            const data = await getFriendsFromFirestore(currentUser.uid);
            setFriends(data || []);
        } catch (error) {
            console.error("Fetch friends error:", error);
        } finally {
            setLoadingFriends(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    // Handle Chat Selection & Subscription
    useEffect(() => {
        if (!currentUser || !selectedChat) return;

        let unsubscribe;
        setMessages([]);
        setLoadingMessages(true);

        if (selectedChat.type === 'global') {
            unsubscribe = subscribeToGlobalChat((msgs) => {
                setMessages(msgs);
                setLoadingMessages(false);
            });
        } else {
            const initPrivateChat = async () => {
                try {
                    const id = await getOrCreateChat(currentUser.uid, selectedChat.id);
                    setChatId(id);
                    unsubscribe = subscribeToChatMessages(id, (msgs) => {
                        setMessages(msgs);
                        setLoadingMessages(false);
                    });
                } catch (error) {
                    console.error("Chat init error:", error);
                    setLoadingMessages(false);
                }
            };
            initPrivateChat();
        }

        return () => unsubscribe && unsubscribe();
    }, [selectedChat, currentUser]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        const text = newMessage;
        setNewMessage('');

        try {
            if (selectedChat.type === 'global') {
                await sendGlobalMessage(currentUser.uid, currentUser.displayName || 'User', text);
            } else if (chatId) {
                await sendChatMessage(chatId, currentUser.uid, text);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Packet transmission failed. Try again.");
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-slate-100 dark:border-slate-800/50 shadow-2xl overflow-hidden transition-all duration-500 animate-fade-in relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 pointer-events-none"></div>

            {/* Sidebar: Chat List */}
            <div className={`w-full md:w-96 border-r border-slate-100 dark:border-slate-800/50 flex flex-col relative z-10 transition-all duration-500 ${selectedChat && selectedChat.id !== 'none' ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-10 border-b border-slate-100 dark:border-slate-800/50">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                        <MessageSquare className="w-7 h-7 text-blue-600" />
                        MESSAGES
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {/* Global Chat Toggle */}
                    <button
                        onClick={() => setSelectedChat({ id: 'global', type: 'global', name: 'Global Team Chat' })}
                        className={`w-full p-6 rounded-[2.5rem] flex items-center gap-5 transition-all duration-300 relative overflow-hidden group ${selectedChat?.type === 'global'
                            ? 'bg-slate-900 text-white shadow-2xl scale-[1.02]'
                            : 'bg-blue-50/50 dark:bg-blue-900/10 text-slate-700 dark:text-slate-300 hover:bg-blue-100/50 dark:hover:bg-blue-900/20'}`}
                    >
                        {selectedChat?.type === 'global' && <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${selectedChat?.type === 'global' ? 'bg-blue-600' : 'bg-white dark:bg-slate-800'}`}>
                            <Globe className={`w-7 h-7 ${selectedChat?.type === 'global' ? 'text-white' : 'text-blue-600'}`} />
                        </div>
                        <div className="text-left flex-1 min-w-0 relative z-10">
                            <h4 className="font-black text-lg tracking-tight">Team Portal</h4>
                            <p className={`text-xs font-bold uppercase tracking-widest truncate ${selectedChat?.type === 'global' ? 'text-blue-200' : 'text-slate-400'}`}>
                                Global Network
                            </p>
                        </div>
                    </button>

                    <div className="py-4 flex items-center gap-4 px-2">
                        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Direct Channels</span>
                        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                    </div>

                    {loadingFriends ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : friends.length === 0 ? (
                        <div className="text-center py-10 px-8 bg-slate-50/50 dark:bg-slate-950/20 rounded-[2rem]">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-loose">Establish partnerships in the Social Hub to unlock private channels.</p>
                        </div>
                    ) : (
                        friends.map(friend => (
                            <button
                                key={friend.id}
                                onClick={() => setSelectedChat({ id: friend.id, type: 'private', name: friend.displayName })}
                                className={`w-full p-5 rounded-[2rem] flex items-center gap-4 transition-all duration-300 ${selectedChat?.id === friend.id
                                    ? 'bg-blue-600 text-white shadow-xl scale-[1.02]'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'}`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-sm transition-transform group-hover:scale-110 ${selectedChat?.id === friend.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                    {friend.displayName[0].toUpperCase()}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <h4 className="font-black truncate tracking-tight">{friend.displayName}</h4>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest truncate mt-0.5 ${selectedChat?.id === friend.id ? 'text-blue-100' : 'text-slate-500'}`}>
                                        Private Encrypted
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col bg-white dark:bg-slate-950/20 relative z-10 ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                            <div className="flex items-center gap-5">
                                <button onClick={() => setSelectedChat(null)} className="md:hidden p-3 -ml-3 text-slate-500 hover:text-blue-600 transition-colors">
                                    <ArrowLeft className="w-7 h-7" />
                                </button>
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white font-black text-2xl shadow-2xl transition-transform hover:rotate-6">
                                        {selectedChat.type === 'global' ? <Globe className="w-7 h-7 text-blue-400" /> : selectedChat.name[0].toUpperCase()}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{selectedChat.name}</h3>
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div className="flex items-center gap-2 mt-1.5 px-3 py-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg w-fit">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span className="text-[9px] text-emerald-600 dark:text-emerald-500 font-black uppercase tracking-[0.2em]">{selectedChat.type === 'global' ? 'Public Broadcast' : 'Peer-to-Peer'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden lg:flex items-center gap-3">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                    <Sparkles className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar bg-slate-50/20 dark:bg-slate-950/10">
                            {loadingMessages ? (
                                <div className="flex flex-col justify-center items-center h-full gap-4 text-slate-400">
                                    <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Deciphering Stream...</p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center py-20 flex flex-col items-center animate-fade-in">
                                    <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner">
                                        <MessageSquare className="w-10 h-10 text-blue-600 opacity-50" />
                                    </div>
                                    <h3 className="text-slate-900 dark:text-white font-black text-2xl tracking-tight mb-2 uppercase">Silence Protocol</h3>
                                    <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest opacity-80 max-w-xs leading-loose">Transmit your first packet to initiate communication.</p>
                                </div>
                            ) : (
                                <div className="space-y-8 max-w-5xl mx-auto">
                                    {messages.map((msg, idx) => {
                                        const isMe = msg.senderId === currentUser.uid;
                                        const prevMsg = idx > 0 ? messages[idx - 1] : null;
                                        const isSameUser = prevMsg?.senderId === msg.senderId;

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isSameUser ? '-mt-6' : ''}`}
                                            >
                                                {!isMe && !isSameUser && (
                                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-4 flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded bg-blue-500/20"></div>
                                                        {selectedChat.type === 'global' ? (msg.senderName || 'Unknown Operative') : selectedChat.name}
                                                    </span>
                                                )}
                                                <div className={`group relative max-w-[85%] lg:max-w-[70%] px-8 py-5 rounded-[2rem] shadow-sm transition-all duration-300 ${isMe
                                                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-tr-none shadow-slate-200 dark:shadow-none translate-x-0 hover:-translate-x-1'
                                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-800 rounded-tl-none translate-x-0 hover:translate-x-1'
                                                    }`}>
                                                    <p className="leading-relaxed text-[15px] font-medium selection:bg-blue-500 selection:text-white">{msg.text}</p>
                                                </div>
                                                <span className={`text-[9px] font-black mt-2 uppercase px-4 ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                                                    {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TRANSMITTING...'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-10 border-t border-slate-100 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl">
                            <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex gap-5">
                                <div className="flex-1 relative group">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={selectedChat.type === 'global' ? "Broadcast to network..." : `Secure message to ${selectedChat.name}...`}
                                        className="w-full px-10 py-6 bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-100 dark:border-slate-800/50 rounded-[2.5rem] outline-none text-base dark:text-white font-black transition-all group-focus-within:border-blue-600/50 group-focus-within:ring-4 group-focus-within:ring-blue-500/10 placeholder:text-slate-400 placeholder:italic"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></div>
                                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest hidden sm:block">UP LINK</span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="w-20 h-20 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-[2rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-2xl shadow-slate-300 dark:shadow-none"
                                >
                                    <Send className="w-8 h-8" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-slate-50/10 dark:bg-slate-950/20 animate-fade-in">
                        <div className="w-32 h-32 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 shadow-2xl flex items-center justify-center mb-10 transition-transform hover:scale-110 duration-700 group">
                            <MessageSquare className="w-14 h-14 text-blue-600 group-hover:rotate-12 transition-transform" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">Strategic Communications</h2>
                        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] max-w-xs leading-loose opacity-80">Synchronize with your network members or access the global team portal to coordinate operations.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
