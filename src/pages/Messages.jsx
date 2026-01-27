import React, { useState, useRef, useEffect } from 'react';
import useFirestore from '../hooks/useFirestore';
import { Send, MessageSquare, Loader2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
    const { currentUser } = useAuth();
    const { docs: messages, loading, addItem } = useFirestore('messages');
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await addItem({
                text: newMessage,
                sender: currentUser.displayName || currentUser.email,
                senderId: currentUser.uid,
                timestamp: new Date().toISOString()
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden transition-all duration-300">
            {/* Chat Header Header */}
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200/50 dark:border-blue-800/30">
                        <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-gray-100 tracking-tight">Project Sanctuary</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] text-green-600 dark:text-green-500 font-black uppercase tracking-widest">Real-time Active</span>
                        </div>
                    </div>
                </div>
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black uppercase">U</div>
                    ))}
                </div>
            </div>

            {/* Messages Area Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/20 dark:bg-slate-950/10"
            >
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-slate-900 dark:text-gray-100 font-black text-lg">No signals detected...</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Be the one to break the silence.</p>
                    </div>
                ) : (
                    messages.slice().reverse().map((msg, idx) => (
                        <div
                            key={msg.id || idx}
                            className={`flex flex-col ${msg.senderId === currentUser.uid ? 'items-end' : 'items-start'}`}
                        >
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 px-1">{msg.sender}</span>
                            <div className={`max-w-[75%] px-6 py-3.5 rounded-3xl text-sm shadow-sm transition-all ${msg.senderId === currentUser.uid
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-800 rounded-tl-none font-medium'
                                }`}>
                                <p className="leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area Area */}
            <div className="p-8 border-t border-slate-100 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80">
                <form onSubmit={handleSendMessage} className="flex gap-4">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Speak your mind..."
                        className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none text-sm dark:text-slate-200 font-medium transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-6 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-100 dark:shadow-none"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Messages;
