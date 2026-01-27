import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    getFriendsFromFirestore,
    getOrCreateChat,
    sendChatMessage,
    subscribeToChatMessages
} from '../services/firestoreService';
import { Send, MessageSquare, Loader2, Users, ArrowLeft } from 'lucide-react';

const Messages = () => {
    const { currentUser } = useAuth();
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
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

    // Handle Chat Selection
    useEffect(() => {
        if (!selectedFriend || !currentUser) return;

        let unsubscribe;
        const initChat = async () => {
            setLoadingMessages(true);
            try {
                const id = await getOrCreateChat(currentUser.uid, selectedFriend.id);
                setChatId(id);

                // Subscribe to realtime messages
                unsubscribe = subscribeToChatMessages(id, (msgs) => {
                    setMessages(msgs);
                    setLoadingMessages(false);
                });
            } catch (error) {
                console.error("Chat init error:", error);
                setLoadingMessages(false);
            }
        };

        initChat();
        return () => unsubscribe && unsubscribe();
    }, [selectedFriend, currentUser]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatId || !currentUser) return;

        const text = newMessage;
        setNewMessage('');

        try {
            await sendChatMessage(chatId, currentUser.uid, text);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden transition-all duration-300">
            {/* Sidebar: Friends List */}
            <div className={`w-full md:w-80 border-r border-slate-100 dark:border-slate-800/50 flex flex-col ${selectedFriend ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-8 border-b border-slate-100 dark:border-slate-800/50">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Messages
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {loadingFriends ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : friends.length === 0 ? (
                        <div className="text-center py-10 px-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Add friends in the Team tab to start chatting!</p>
                        </div>
                    ) : (
                        friends.map(friend => (
                            <button
                                key={friend.id}
                                onClick={() => setSelectedFriend(friend)}
                                className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${selectedFriend?.id === friend.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-sm ${selectedFriend?.id === friend.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                    {friend.displayName[0].toUpperCase()}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <h4 className="font-bold truncate">{friend.displayName}</h4>
                                    <p className={`text-xs truncate ${selectedFriend?.id === friend.id ? 'text-blue-100' : 'text-slate-500'}`}>
                                        Tap to open chat
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col bg-white dark:bg-slate-950/20 ${!selectedFriend ? 'hidden md:flex' : 'flex'}`}>
                {selectedFriend ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedFriend(null)} className="md:hidden p-2 -ml-2 text-slate-500">
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
                                        {selectedFriend.displayName[0].toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{selectedFriend.displayName}</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] text-green-600 dark:text-green-500 font-black uppercase tracking-widest">Real-time Connected</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-slate-50/20 dark:bg-slate-950/10">
                            {loadingMessages ? (
                                <div className="flex justify-center items-center h-full">
                                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center py-20 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mb-6">
                                        <MessageSquare className="w-10 h-10 text-blue-500" />
                                    </div>
                                    <h3 className="text-slate-900 dark:text-white font-black text-xl">Start the conversation</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mt-2">Send a message to start collaborating in real-time.</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${msg.senderId === currentUser.uid ? 'items-end' : 'items-start'}`}
                                    >
                                        <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm transition-all shadow-sm ${msg.senderId === currentUser.uid
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-800 rounded-tl-none font-medium'
                                            }`}>
                                            <p className="leading-relaxed">{msg.text}</p>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase px-1">
                                            {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80">
                            <form onSubmit={handleSendMessage} className="flex gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl outline-none text-sm dark:text-white font-medium"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-100 dark:shadow-none"
                                >
                                    <Send className="w-6 h-6" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/10 dark:bg-slate-950/20">
                        <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl flex items-center justify-center mb-8 animate-bounce-subtle">
                            <MessageSquare className="w-12 h-12 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Private Conversations</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs">Select a friend from the list on the left to start a secure, real-time chat.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
