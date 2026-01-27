
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;

    if (!messages) {
        return res.status(400).json({ error: 'Messages are required' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a supportive and brilliant AI Study Tutor. Your goal is to help students break down complex tasks, explain academic concepts simply, and provide encouragement. Keep responses concise, well-formatted, and encouraging.',
                },
                ...messages.map((msg) => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.text || msg.content,
                })),
            ],
            temperature: 0.7,
        });

        const aiMessage = response.choices[0].message.content;
        return res.status(200).json({ content: aiMessage });
    } catch (error) {
        console.error('OpenAI Proxy Error:', error);
        return res.status(500).json({ error: 'Failed to fetch AI response' });
    }
}
