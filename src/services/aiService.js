const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const MAX_CHAT_HISTORY = 10; // Keep last 10 messages for context

/**
 * Guest fallback responses when API key is missing
 */
const GUEST_FALLBACK_RESPONSES = [
    "I'm currently running in demo mode! To get full AI-powered responses, please sign up for a free account. In the meantime, I can help you organize your tasks and notes!",
    "That's an interesting question! Sign up to unlock unlimited AI assistance. For now, I recommend breaking down your task into smaller, manageable steps.",
    "I'd love to help with that! Full AI features are available after signup. Try using the Task Manager to organize your work systematically.",
    "Great idea! To get detailed AI guidance, create a free account. Meanwhile, check out the Study Planner to structure your work.",
    "I'm operating with limited capabilities in guest mode. Sign up to unlock my full potential and get personalized, intelligent responses!"
];

/**
 * Limit chat history to last N messages
 */
export const limitChatHistory = (messages, maxCount = MAX_CHAT_HISTORY) => {
    if (messages.length <= maxCount) return messages;
    return messages.slice(-maxCount);
};

/**
 * Get AI response with memory management
 */
export const getAIResponse = async (history, isGuest = false) => {
    // Guest fallback
    if (isGuest || !OPENAI_API_KEY || OPENAI_API_KEY === 'your_key_here') {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
        const randomResponse = GUEST_FALLBACK_RESPONSES[Math.floor(Math.random() * GUEST_FALLBACK_RESPONSES.length)];
        return randomResponse;
    }

    try {
        // Limit history to last 10 messages
        const limitedHistory = limitChatHistory(history);

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: limitedHistory.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    text: msg.text
                }))
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to get AI response.");
        }

        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error("AI Proxy Error:", error);

        // Fallback to guest response on error
        return GUEST_FALLBACK_RESPONSES[0];
    }
};

/**
 * Export chat history as JSON
 */
export const exportChatAsJSON = (messages) => {
    const data = {
        exportDate: new Date().toISOString(),
        messageCount: messages.length,
        messages: messages.map(msg => ({
            role: msg.role,
            text: msg.text,
            timestamp: msg.timestamp || new Date().toISOString()
        }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

/**
 * Export chat history as Markdown
 */
export const exportChatAsMarkdown = (messages) => {
    let markdown = `# AI Chat Export\n\n`;
    markdown += `**Exported:** ${new Date().toLocaleString()}\n\n`;
    markdown += `**Total Messages:** ${messages.length}\n\n`;
    markdown += `---\n\n`;

    messages.forEach((msg, index) => {
        const role = msg.role === 'user' ? '👤 You' : '🤖 AI Assistant';
        markdown += `### ${role}\n\n`;
        markdown += `${msg.text}\n\n`;
        if (index < messages.length - 1) markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
};

/**
 * Get contextual AI suggestions based on current work
 */
export const getContextualSuggestions = (taskTitle, taskDescription) => {
    const suggestions = [];

    // Programming/coding keywords
    if (/(code|program|develop|build|api|function|class|debug)/i.test(taskTitle + taskDescription)) {
        suggestions.push({
            type: 'resource',
            title: 'Stack Overflow',
            url: `https://stackoverflow.com/search?q=${encodeURIComponent(taskTitle)}`,
            icon: '📚'
        });
        suggestions.push({
            type: 'resource',
            title: 'MDN Web Docs',
            url: 'https://developer.mozilla.org/',
            icon: '📖'
        });
    }

    // Math/Science keywords
    if (/(math|calculus|algebra|physics|chemistry|formula)/i.test(taskTitle + taskDescription)) {
        suggestions.push({
            type: 'resource',
            title: 'Khan Academy',
            url: `https://www.khanacademy.org/search?search_again=1&page_search_query=${encodeURIComponent(taskTitle)}`,
            icon: '🎓'
        });
        suggestions.push({
            type: 'resource',
            title: 'Wolfram Alpha',
            url: `https://www.wolframalpha.com/input?i=${encodeURIComponent(taskTitle)}`,
            icon: '🔬'
        });
    }

    // Research/Writing keywords
    if (/(research|essay|paper|article|write|study)/i.test(taskTitle + taskDescription)) {
        suggestions.push({
            type: 'resource',
            title: 'Google Scholar',
            url: `https://scholar.google.com/scholar?q=${encodeURIComponent(taskTitle)}`,
            icon: '📝'
        });
    }

    // Design/Creative keywords
    if (/(design|ui|ux|graphic|logo|mockup)/i.test(taskTitle + taskDescription)) {
        suggestions.push({
            type: 'resource',
            title: 'Dribbble',
            url: 'https://dribbble.com/search/' + encodeURIComponent(taskTitle),
            icon: '🎨'
        });
    }

    // Generic suggestions
    if (suggestions.length === 0) {
        suggestions.push({
            type: 'tip',
            title: 'Break it down',
            description: 'Split this task into 3-5 smaller, actionable steps',
            icon: '💡'
        });
        suggestions.push({
            type: 'tip',
            title: 'Set a deadline',
            description: 'Add a due date to stay on track',
            icon: '⏰'
        });
    }

    return suggestions;
};

/**
 * Generate subtasks with fallback
 */
export const generateSubtasks = async (task, isGuest = false) => {
    // Guest fallback
    if (isGuest || !OPENAI_API_KEY || OPENAI_API_KEY === 'your_key_here') {
        return [
            "Research and understand the requirements",
            "Plan out the approach and steps needed",
            "Execute the main work in focused sessions",
            "Review and refine the final outcome"
        ];
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a task decomposition expert. Break down the user's task into 3-5 clear, actionable, and logical subtasks. Return ONLY the subtasks as a plain list, one per line, without any numbering, bullet points, or extra text."
                    },
                    {
                        role: "user",
                        content: task
                    }
                ],
                temperature: 0.5
            })
        });

        if (!response.ok) throw new Error("AI failed");

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Split by lines and clean up
        return content.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
    } catch (error) {
        console.error("Generate Subtasks Error:", error);
        return [
            "Research and scope out the task requirements",
            "Set up the initial project structure",
            "Execute the core implementation phases",
            "Perform rigorous testing and validation"
        ];
    }
};
