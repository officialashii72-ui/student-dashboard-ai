const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const getAIResponse = async (history) => {
    if (!OPENAI_API_KEY) {
        throw new Error("OpenAI API Key is missing. Please add VITE_OPENAI_API_KEY to your .env file.");
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Efficient and cheap
                messages: [
                    {
                        role: "system",
                        content: "You are a supportive and brilliant AI Study Tutor. Your goal is to help students break down complex tasks, explain academic concepts simply, and provide encouragement. Keep responses concise, well-formatted, and encouraging."
                    },
                    ...history.map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'assistant',
                        content: msg.text
                    }))
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Failed to get AI response.");
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
};
