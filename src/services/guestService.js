/**
 * Guest Service
 * 
 * Manages localStorage for guest users and provides data migration to Firestore upon signup.
 */

const GUEST_PREFIX = 'sdai_guest_';

const STORAGE_KEYS = {
    TASKS: `${GUEST_PREFIX}tasks`,
    NOTES: `${GUEST_PREFIX}notes`,
    SUBJECTS: `${GUEST_PREFIX}subjects`,
    AI_CHATS: `${GUEST_PREFIX}ai_chats`,
    IS_GUEST: `${GUEST_PREFIX}is_guest`,
    GUEST_ID: `${GUEST_PREFIX}id`,
};

// Generate a unique guest ID
export const generateGuestId = () => {
    const existingId = localStorage.getItem(STORAGE_KEYS.GUEST_ID);
    if (existingId) return existingId;

    const newId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEYS.GUEST_ID, newId);
    return newId;
};

// Mark user as guest
export const setGuestMode = (isGuest) => {
    localStorage.setItem(STORAGE_KEYS.IS_GUEST, isGuest ? 'true' : 'false');
    if (isGuest) {
        generateGuestId();
    }
};

// Check if current user is guest
export const isGuestMode = () => {
    return localStorage.getItem(STORAGE_KEYS.IS_GUEST) === 'true';
};

// Get guest data from localStorage
const getGuestData = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Error reading ${key}:`, error);
        return [];
    }
};

// Save guest data to localStorage
const setGuestData = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving ${key}:`, error);
    }
};

// --- TASKS ---
export const getGuestTasks = () => getGuestData(STORAGE_KEYS.TASKS);

export const addGuestTask = (task) => {
    const tasks = getGuestTasks();
    const newTask = {
        id: `guest_task_${Date.now()}`,
        ...task,
        createdAt: { seconds: Date.now() / 1000 }
    };
    tasks.unshift(newTask);
    setGuestData(STORAGE_KEYS.TASKS, tasks);
    return newTask;
};

export const updateGuestTask = (taskId, updates) => {
    const tasks = getGuestTasks();
    const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
    );
    setGuestData(STORAGE_KEYS.TASKS, updatedTasks);
};

export const deleteGuestTask = (taskId) => {
    const tasks = getGuestTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    setGuestData(STORAGE_KEYS.TASKS, filteredTasks);
};

// --- NOTES ---
export const getGuestNotes = () => getGuestData(STORAGE_KEYS.NOTES);

export const addGuestNote = (note) => {
    const notes = getGuestNotes();
    const newNote = {
        id: `guest_note_${Date.now()}`,
        ...note,
        createdAt: { seconds: Date.now() / 1000 }
    };
    notes.unshift(newNote);
    setGuestData(STORAGE_KEYS.NOTES, notes);
    return newNote;
};

export const updateGuestNote = (noteId, updates) => {
    const notes = getGuestNotes();
    const updatedNotes = notes.map(note =>
        note.id === noteId ? { ...note, ...updates } : note
    );
    setGuestData(STORAGE_KEYS.NOTES, updatedNotes);
};

export const deleteGuestNote = (noteId) => {
    const notes = getGuestNotes();
    const filteredNotes = notes.filter(note => note.id !== noteId);
    setGuestData(STORAGE_KEYS.NOTES, filteredNotes);
};

// --- SUBJECTS (Study Planner) ---
export const getGuestSubjects = () => getGuestData(STORAGE_KEYS.SUBJECTS);

export const addGuestSubject = (subject) => {
    const subjects = getGuestSubjects();
    const newSubject = {
        id: `guest_subject_${Date.now()}`,
        ...subject,
        createdAt: { seconds: Date.now() / 1000 }
    };
    subjects.unshift(newSubject);
    setGuestData(STORAGE_KEYS.SUBJECTS, subjects);
    return newSubject;
};

export const deleteGuestSubject = (subjectId) => {
    const subjects = getGuestSubjects();
    const filteredSubjects = subjects.filter(sub => sub.id !== subjectId);
    setGuestData(STORAGE_KEYS.SUBJECTS, filteredSubjects);
};

// --- AI CHATS ---
export const getGuestAIChats = () => getGuestData(STORAGE_KEYS.AI_CHATS);

export const addGuestAIChat = (message) => {
    const chats = getGuestAIChats();
    const newMessage = {
        id: `guest_ai_${Date.now()}`,
        ...message,
        createdAt: { seconds: Date.now() / 1000 }
    };
    chats.push(newMessage);

    // Limit to last 10 messages (memory limit)
    const limitedChats = chats.slice(-10);
    setGuestData(STORAGE_KEYS.AI_CHATS, limitedChats);
    return newMessage;
};

export const clearGuestAIChats = () => {
    setGuestData(STORAGE_KEYS.AI_CHATS, []);
};

// --- MIGRATION TO FIRESTORE ---
/**
 * Migrate all guest data to Firestore when user signs up
 * @param {string} userId - Firebase user ID
 * @param {object} firestoreService - Firestore service functions
 */
export const migrateGuestDataToFirestore = async (userId, firestoreService) => {
    if (!isGuestMode()) return { success: true, migrated: 0 };

    try {
        let migratedCount = 0;

        // Migrate tasks
        const tasks = getGuestTasks();
        for (const task of tasks) {
            const { id, createdAt, ...taskData } = task; // Remove guest ID
            await firestoreService.addTaskToFirestore(userId, taskData);
            migratedCount++;
        }

        // Migrate notes
        const notes = getGuestNotes();
        for (const note of notes) {
            const { id, createdAt, ...noteData } = note;
            await firestoreService.addNoteToFirestore(userId, noteData);
            migratedCount++;
        }

        // Migrate subjects
        const subjects = getGuestSubjects();
        for (const subject of subjects) {
            const { id, createdAt, ...subjectData } = subject;
            await firestoreService.addSubjectToFirestore(userId, subjectData);
            migratedCount++;
        }

        // Migrate AI chats
        const aiChats = getGuestAIChats();
        for (const chat of aiChats) {
            const { id, createdAt, ...chatData } = chat;
            await firestoreService.addAIChatMessageToFirestore(userId, chatData);
            migratedCount++;
        }

        // Clear guest data after successful migration
        clearGuestData();

        return {
            success: true,
            migrated: migratedCount,
            details: {
                tasks: tasks.length,
                notes: notes.length,
                subjects: subjects.length,
                aiChats: aiChats.length
            }
        };
    } catch (error) {
        console.error('Migration error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Clear all guest data
export const clearGuestData = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
};

// Get all guest data stats
export const getGuestDataStats = () => {
    return {
        tasks: getGuestTasks().length,
        notes: getGuestNotes().length,
        subjects: getGuestSubjects().length,
        aiChats: getGuestAIChats().length,
        isGuest: isGuestMode()
    };
};
