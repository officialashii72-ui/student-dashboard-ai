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
    const [taskQuery, setTaskQuery] = useState(''); // Renamed from input
    const [isLoading, setIsLoading] = useState(false); // Renamed to bool
    const [suggestedSubtasks, setSuggestedSubtasks] = useState(null); // Renamed from breakdown

    /**
     * Generates mock subtasks after a simulated delay.
     */
    const handleGenerateSubtasks = async () => {
        if (!taskQuery.trim()) return;
        setIsLoading(true);
        setSuggestedSubtasks(null);

        try {
            const steps = await generateSubtasks(taskQuery);
            setSuggestedSubtasks(steps);
        } catch (error) {
            console.error("Failed to generate subtasks:", error);
            // In a real app, we might show a toast here
            setSuggestedSubtasks(["could not generate plan. please try again."]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white h-full flex flex-col relative overflow-hidden">
            {/* Decorative background elements using absolute positioning */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none"></div>

            {/* Header */}
            <h2 className="text-lg font-bold flex items-center gap-2 mb-1 relative z-10">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                AI Task Assistant
            </h2>
            <p className="text-indigo-100 text-xs mb-6 relative z-10">
                Break down complex goals into manageable steps instantly.
            </p>

            <div className="relative z-10">
                <div className="relative mb-4">
                    <input
                        type="text"
                        value={taskQuery}
                        onChange={(e) => setTaskQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerateSubtasks()}
                        placeholder="e.g., Prepare for Physics Final"
                        className="w-full pl-4 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl placeholder-indigo-200 text-white focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-sm"
                    />
                    <button
                        onClick={handleGenerateSubtasks}
                        disabled={isLoading}
                        className="absolute right-2 top-2 p-1.5 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <ArrowRight className="w-4 h-4" />
                        )}
                    </button>
                </div>

                {/* Results Area */}
                {suggestedSubtasks && (
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10 animate-fade-in">
                        <h3 className="text-xs font-bold text-indigo-100 mb-3 flex items-center gap-2">
                            <ListChecks className="w-3.5 h-3.5" />
                            SUGGESTED PLAN
                        </h3>
                        <ul className="space-y-2">
                            {suggestedSubtasks.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-white/90">
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-yellow-300 flex-shrink-0" />
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AITaskAssistant;
