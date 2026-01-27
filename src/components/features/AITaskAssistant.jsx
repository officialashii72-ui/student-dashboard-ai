import React, { useState } from 'react';
import { Sparkles, ArrowRight, ListChecks } from 'lucide-react';
import { generateSubtasks } from '../../services/aiService';

/**
 * AITaskAssistant Component
 * 
 * Simulates an AI interface that breaks down user tasks into mock subtasks.
 * Includes loading states and animations.
 */
const AITaskAssistant = () => {
    const [taskQuery, setTaskQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedSubtasks, setSuggestedSubtasks] = useState(null);

    const handleGenerateSubtasks = async () => {
        if (!taskQuery.trim()) return;
        setIsLoading(true);
        setSuggestedSubtasks(null);

        try {
            const steps = await generateSubtasks(taskQuery);
            setSuggestedSubtasks(steps);
        } catch (error) {
            console.error("Failed to generate subtasks:", error);
            setSuggestedSubtasks(["Could not generate plan. Please try again."]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-all h-full flex flex-col relative overflow-hidden group hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-none">
            {/* Decorative background blur */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-100/50 transition-colors"></div>

            {/* Header */}
            <div className="relative z-10 mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-800/30">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-gray-100 tracking-tight leading-none">AI Agent</h2>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Enhanced Precision</span>
                    </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                    Deconstruct complex objectives into actionable neural steps.
                </p>
            </div>

            <div className="relative z-10 space-y-6">
                <div className="relative">
                    <input
                        type="text"
                        value={taskQuery}
                        onChange={(e) => setTaskQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerateSubtasks()}
                        placeholder="Define your objective..."
                        className="w-full pl-6 pr-14 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl placeholder-slate-400 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all font-medium"
                    />
                    <button
                        onClick={handleGenerateSubtasks}
                        disabled={isLoading}
                        className="absolute right-2 top-2 p-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 transition-all shadow-lg active:scale-95"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <ArrowRight className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Results Area Area */}
                <div className="min-h-[100px] flex flex-col">
                    {suggestedSubtasks ? (
                        <div className="bg-slate-50 dark:bg-slate-950 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 animate-fade-in flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <ListChecks className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                    Decomposition Successful
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                {suggestedSubtasks.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium group/item">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover/item:scale-125 transition-transform flex-shrink-0" />
                                        <span className="leading-relaxed">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : !isLoading && (
                        <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-40">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-4">
                                <Sparkles className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Awaiting Neural Input</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AITaskAssistant;
