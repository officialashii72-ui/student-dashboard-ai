
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAIResponse } from '../services/aiService';
import { addAIChatMessageToFirestore, getAIChatMessagesFromFirestore } from '../services/firestoreService';
import { Send, Sparkles, Loader2, Bot, User, Trash2, Lock } from 'lucide-react';
import GuestModeBanner from '../components/auth/GuestModeBanner';
import { toast } from 'sonner';

/**
 * Sample AI responses for guest mode
 * These demonstrate what an authenticated user can expect
 */
const GUEST_SAMPLE_RESPONSES = [
  {
    prompt: ['explain photosynthesis', 'what is photosynthesis'],
    response: 'Photosynthesis is the process by which plants convert light energy into chemical energy. The equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. It occurs in two stages: the light-dependent reactions in the thylakoids and the light-independent reactions (Calvin cycle) in the stroma. This is just a sample response - sign up to get full AI-powered explanations!'
  },
  {
    prompt: ['help with math', 'solve derivative', 'calculus'],
    response: 'I\'d be happy to help with math! The derivative of f(x) = x³ is f\'(x) = 3x². For derivatives, remember the power rule: if f(x) = xⁿ, then f\'(x) = n·xⁿ⁻¹. Sign up to get personalized help, step-by-step solutions, and practice problems!'
  },
  {
    prompt: ['essay', 'write', 'composition'],
    response: 'Great! For essay writing, remember: 1) Introduction with thesis, 2) Body paragraphs with evidence, 3) Conclusion restating thesis. Each paragraph should have a topic sentence. Sign up for AI-powered writing feedback and suggestions!'
  },
  {
    prompt: ['history', 'revolution', 'french'],
    response: 'The French Revolution (1789-1799) was a pivotal event that transformed European society. Key phases: Estates-General (1789), Constitutional Monarchy (1789-1792), Radical Phase (1792-1794), and Thermidor (1794-1799). Sign up to explore detailed historical analyses and timelines!'
  },
];

/**
 * Get sample AI response based on user input
 */
const getGuestAISampleResponse = (userInput) => {
  const lowercaseInput = userInput.toLowerCase();
  
  for (const sample of GUEST_SAMPLE_RESPONSES) {
    if (sample.prompt.some(prompt => lowercaseInput.includes(prompt))) {
      return sample.response;
    }
  }
  
  // Default response if no match found
  return `That's an interesting question! I can help with that once you sign up. As an authenticated user, you'll get full AI-powered responses backed by GPT-4o, personalized to your learning style, with detailed explanations and step-by-step guidance!`;
};

const AIChat = () => {
    const { currentUser, isGuest } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef();

    useEffect(() => {
        const fetchHistory = async () => {
            // For authenticated users, fetch from Firestore
            if (currentUser && !isGuest) {
                try {
                    const history = await getAIChatMessagesFromFirestore(currentUser.uid);
                    setMessages(history || []);
                } catch (error) {
                    console.error("History fetch error:", error);
                }
            }
            // For guest users, start with empty messages (no persistence)
            setLoading(false);
        };
        fetchHistory();
    }, [currentUser, isGuest]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    /**
     * Handle sending messages
     * Different behavior for guest vs authenticated users
     */
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isThinking) return;

        const userMsg = { role: 'user', text: input.trim() };
        setInput('');
        setMessages(prev => [...prev, userMsg]);
        setIsThinking(true);

        try {
            // For authenticated users: use real API
            if (!isGuest && currentUser) {
                console.log("Saving user message to Firestore...");
                await addAIChatMessageToFirestore(currentUser.uid, userMsg);

                console.log("Requesting AI response...");
                const aiResponseText = await getAIResponse([...messages, userMsg]);
                console.log("AI responded successfully.");

                const aiMsg = { role: 'assistant', text: aiResponseText };
                setMessages(prev => [...prev, aiMsg]);

                console.log("Saving AI response to Firestore...");
                await addAIChatMessageToFirestore(currentUser.uid, aiMsg);
            } 
            // For guest users: use sample responses
            else if (isGuest) {
                // Simulate thinking delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const aiResponseText = getGuestAISampleResponse(input);
                const aiMsg = { role: 'assistant', text: aiResponseText };
                setMessages(prev => [...prev, aiMsg]);

                // Show a subtle notification about guest limitations
                if (messages.length === 0) {
                    toast.info('Guest Mode: Responses are samples. Sign up for real AI power!');
                }
            }
        } catch (error) {
            console.error("AI Chat Logic Error:", error);
            const errMsg = { 
                role: 'assistant', 
                text: isGuest 
                  ? 'Oops! There was an issue with the sample response. Sign up for reliable AI assistance!'
                  : `I encountered an error: ${error.message}. Please ensure your API key is valid and you have restarted your dev server.` 
            };
            setMessages(prev => [...prev, errMsg]);
        } finally {
            setIsThinking(false);
        }
    };

    /**
     * Clear chat history
     * Only for authenticated users (guests have nothing to save anyway)
     */
    const handleClearChat = async () => {
        if (window.confirm('Clear chat history?')) {
            setMessages([]);
            // Clearing would require a Firestore function to implement
        }
    };

    return (
        <>
            {/* Guest mode banner */}
            {isGuest && <GuestModeBanner />}

            <div className="h-[calc(100vh-140px)] flex flex-col bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-gradient-to-r from-blue-600/5 to-purple-600/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                AI Study Tutor {isGuest && '(Sample Mode)'}
                            </h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest">
                                    {isGuest ? 'Sample responses' : 'Enhanced by GPT-4o'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Clear button for authenticated users only */}
                    {!isGuest && messages.length > 0 && (
                        <button
                            onClick={handleClearChat}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600 dark:text-red-400"
                            title="Clear chat history"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/20 dark:bg-slate-950/10">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-20 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl flex items-center justify-center mb-8 animate-bounce-subtle">
                                <Bot className="w-12 h-12 text-purple-500" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Hello, Scholar!</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mt-3">
                                {isGuest 
                                    ? "I'm your AI Study Partner. Try asking me to explain a concept, but sign up to unlock my full power!"
                                    : "I'm your AI Study Partner. Ask me to explain a concept, break down a project, or help you brainstorm ideas."
                                }
                            </p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-purple-600 border border-slate-100 dark:border-slate-700'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                </div>
                                <div className={`max-w-[80%] px-6 py-4 rounded-[2rem] text-sm shadow-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-emerald-50 dark:border-slate-800 rounded-tl-none font-medium'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))
                    )}
                    {isThinking && (
                        <div className="flex gap-4 animate-pulse">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-purple-600 border border-slate-100 dark:border-slate-700 shadow-md">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-[2rem] rounded-tl-none border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-8 border-t border-slate-100 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80">
                    {isGuest && (
                        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg flex items-start gap-3">
                            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Guest Mode Limitation</p>
                                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                                    You're seeing sample responses. Sign up for unlimited, real AI-powered responses!
                                </p>
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleSendMessage} className="flex gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isGuest ? "Try asking a question (sample responses only)..." : "Ask me anything about your studies..."}
                            className="flex-1 px-8 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl outline-none text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all"
                            disabled={isThinking}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isThinking}
                            className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-3xl flex items-center justify-center hover:shadow-xl hover:shadow-blue-200 dark:hover:shadow-none transition-all disabled:opacity-50"
                        >
                            {isThinking ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AIChat;
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-purple-600 border border-slate-100 dark:border-slate-700'
                                }`}>
                                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>
                            <div className={`max-w-[80%] px-6 py-4 rounded-[2rem] text-sm shadow-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-emerald-50 dark:border-slate-800 rounded-tl-none font-medium'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))
                )}
                {isThinking && (
                    <div className="flex gap-4 animate-pulse">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-purple-600 border border-slate-100 dark:border-slate-700 shadow-md">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-[2rem] rounded-tl-none border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-8 border-t border-slate-100 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80">
                <form onSubmit={handleSendMessage} className="flex gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything about your studies..."
                        className="flex-1 px-8 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl outline-none text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all"
                        disabled={isThinking}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isThinking}
                        className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-3xl flex items-center justify-center hover:shadow-xl hover:shadow-blue-200 dark:hover:shadow-none transition-all disabled:opacity-50"
                    >
                        {isThinking ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIChat;
