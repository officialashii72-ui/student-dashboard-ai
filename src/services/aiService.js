/**
 * AI Service
 * 
 * This service handles interactions with AI providers (or mocks them).
 * Designed to be easily swapped with real API calls (OpenAI, Gemini, etc.) in the future.
 */

/**
 * Generates a list of subtasks for a given task description using mock AI logic.
 * 
 * @param {string} taskDescription - The main task to break down.
 * @returns {Promise<string[]>} - A promise that resolves to an array of subtask strings.
 */
export const generateSubtasks = async (taskDescription) => {
    // 1. Validate input
    if (!taskDescription || typeof taskDescription !== 'string') {
        throw new Error("Invalid task description provided.");
    }

    const lowerTask = taskDescription.toLowerCase();

    // 2. Simulate Network/Processing Delay (1-2 seconds)
    const delay = Math.floor(Math.random() * 1000) + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    // 3. Mock AI Logic (Rule-based templates)
    let steps = [];

    if (lowerTask.includes('study') || lowerTask.includes('exam') || lowerTask.includes('prepare') || lowerTask.includes('quiz')) {
        steps = [
            `Review syllabus and identify key topics for "${taskDescription}"`,
            `Gather study materials (textbooks, notes, past papers)`,
            `Create a study schedule with allocated time blocks`,
            `Practice with flashcards or active recall techniques`,
            `Solve 3-5 practice problems or past exam questions`,
            `Review weak areas and summarize key concepts`
        ];
    } else if (lowerTask.includes('code') || lowerTask.includes('program') || lowerTask.includes('app') || lowerTask.includes('debug')) {
        steps = [
            `Define the requirements and scope for "${taskDescription}"`,
            `Set up the development environment and dependencies`,
            `Design the architecture or pseudocode the logic`,
            `Implement the core functionality incrementally`,
            `Write unit tests to verify the logic`,
            `Refactor code for readability and optimization`,
            `Final testing and deployment`
        ];
    } else if (lowerTask.includes('write') || lowerTask.includes('essay') || lowerTask.includes('report') || lowerTask.includes('paper')) {
        steps = [
            `Analyze the prompt and brainstorm ideas for "${taskDescription}"`,
            `Conduct research and gather reliable sources`,
            `Create a detailed outline with thesis statement`,
            `Write the first draft (focus on getting ideas down)`,
            `Review and edit for clarity, flow, and grammar`,
            `Format citations and bibliography`,
            `Final proofread before submission`
        ];
    } else if (lowerTask.includes('presentation') || lowerTask.includes('slide')) {
        steps = [
            `Define the target audience and core message`,
            `Outline the presentation structure`,
            `Draft the content for each slide`,
            `Design the visual elements (charts, images)`,
            `Create speaker notes`,
            `Rehearse the presentation (time yourself)`,
            `Prepare for potential Q&A`
        ];
    } else {
        // Generic Default
        steps = [
            `Research key concepts and requirements for "${taskDescription}"`,
            `Break down "${taskDescription}" into smaller, manageable chunks`,
            `Set a timeline and key milestones`,
            `Execute the first phase of the plan`,
            `Review progress and adjust as necessary`,
            `Finalize and complete the task`
        ];
    }

    return steps;
};
