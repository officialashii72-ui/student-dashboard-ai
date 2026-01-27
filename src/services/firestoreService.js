import { collection, addDoc, getDocs, query, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// --- TASKS ---

export const addTaskToFirestore = async (userId, task) => {
    try {
        return await addDoc(collection(db, "users", userId, "tasks"), {
            ...task,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding task:", error);
        throw error;
    }
};

export const getTasksFromFirestore = async (userId) => {
    try {
        const q = query(collection(db, "users", userId, "tasks"));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort in memory by createdAt (newest first)
        results.sort((a, b) => {
            const timeA = a.createdAt?.seconds || Date.now() / 1000;
            const timeB = b.createdAt?.seconds || Date.now() / 1000;
            return timeB - timeA;
        });

        return results;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
};

export const updateTaskInFirestore = async (userId, taskId, updates) => {
    try {
        const docRef = doc(db, "users", userId, "tasks", taskId);
        await updateDoc(docRef, updates);
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};

export const deleteTaskFromFirestore = async (userId, taskId) => {
    try {
        const docRef = doc(db, "users", userId, "tasks", taskId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
};

// --- NOTES ---

export const addNoteToFirestore = async (userId, note) => {
    try {
        return await addDoc(collection(db, "users", userId, "notes"), {
            ...note,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding note:", error);
        throw error;
    }
};

export const getNotesFromFirestore = async (userId) => {
    try {
        const q = query(collection(db, "users", userId, "notes"));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort in memory by createdAt (newest first)
        results.sort((a, b) => {
            const timeA = a.createdAt?.seconds || Date.now() / 1000;
            const timeB = b.createdAt?.seconds || Date.now() / 1000;
            return timeB - timeA;
        });

        return results;
    } catch (error) {
        console.error("Error fetching notes:", error);
        throw error;
    }
};

export const updateNoteInFirestore = async (userId, noteId, updates) => {
    try {
        const docRef = doc(db, "users", userId, "notes", noteId);
        await updateDoc(docRef, updates);
    } catch (error) {
        console.error("Error updating note:", error);
        throw error;
    }
};

export const deleteNoteFromFirestore = async (userId, noteId) => {
    try {
        const docRef = doc(db, "users", userId, "notes", noteId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting note:", error);
        throw error;
    }
};

// --- PLANNER ---

export const addSubjectToFirestore = async (userId, subject) => {
    try {
        return await addDoc(collection(db, "users", userId, "planner"), {
            ...subject,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding subject:", error);
        throw error;
    }
};

export const getSubjectsFromFirestore = async (userId) => {
    try {
        const q = query(collection(db, "users", userId, "planner"));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        results.sort((a, b) => {
            const timeA = a.createdAt?.seconds || Date.now() / 1000;
            const timeB = b.createdAt?.seconds || Date.now() / 1000;
            return timeB - timeA;
        });
        return results;
    } catch (error) {
        console.error("Error fetching subjects:", error);
        throw error;
    }
};

export const deleteSubjectFromFirestore = async (userId, subjectId) => {
    try {
        const docRef = doc(db, "users", userId, "planner", subjectId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting subject:", error);
        throw error;
    }
};

// --- TEAM ---

export const addMemberToFirestore = async (userId, member) => {
    try {
        return await addDoc(collection(db, "users", userId, "team"), {
            ...member,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding member:", error);
        throw error;
    }
};

export const getMembersFromFirestore = async (userId) => {
    try {
        const q = query(collection(db, "users", userId, "team"));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        results.sort((a, b) => {
            const timeA = a.createdAt?.seconds || Date.now() / 1000;
            const timeB = b.createdAt?.seconds || Date.now() / 1000;
            return timeB - timeA;
        });
        return results;
    } catch (error) {
        console.error("Error fetching members:", error);
        throw error;
    }
};

export const deleteMemberFromFirestore = async (userId, memberId) => {
    try {
        const docRef = doc(db, "users", userId, "team", memberId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting member:", error);
        throw error;
    }
};

// --- MESSAGES ---

export const addMessageToFirestore = async (userId, message) => {
    try {
        return await addDoc(collection(db, "users", userId, "messages"), {
            ...message,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

export const getMessagesFromFirestore = async (userId) => {
    try {
        const q = query(collection(db, "users", userId, "messages"));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort by createdAt ascending for chat
        results.sort((a, b) => {
            const timeA = a.createdAt?.seconds || (Date.now() / 1000);
            const timeB = b.createdAt?.seconds || (Date.now() / 1000);
            return timeA - timeB;
        });
        return results;
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw error;
    }
};
