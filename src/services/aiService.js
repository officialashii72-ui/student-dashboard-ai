const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const getAIResponse = async (history) => {
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: history.map(msg => ({
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
        throw error;
    }
};

export const generateSubtasks = async (task) => {
    if (!OPENAI_API_KEY) {
        throw new Error("OpenAI API Key is missing.");
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
