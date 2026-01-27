import { collection, addDoc, getDocs, query, updateDoc, deleteDoc, doc, serverTimestamp, setDoc, where, limit, onSnapshot, orderBy, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// --- USERS & DISCOVERY ---

export const syncUserProfile = async (user) => {
    if (!user) return;
    try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName || "Anonymous Student",
            email: user.email,
            lastSeen: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error("Error syncing user profile:", error);
    }
};

export const searchUsers = async (searchTerm, currentUserId) => {
    if (!searchTerm || searchTerm.length < 2) return [];
    try {
        const usersRef = collection(db, "users");

        // Search by email (exact match)
        const qEmail = query(usersRef, where("email", "==", searchTerm.trim().toLowerCase()), limit(10));
        const snapshotEmail = await getDocs(qEmail);

        // Search by Name
        const qName = query(usersRef,
            where("displayName", ">=", searchTerm),
            where("displayName", "<=", searchTerm + '\uf8ff'),
            limit(10)
        );
        const snapshotName = await getDocs(qName);

        const results = new Map();
        [...snapshotEmail.docs, ...snapshotName.docs].forEach(doc => {
            if (doc.id !== currentUserId) {
                results.set(doc.id, { id: doc.id, ...doc.data() });
            }
        });

        return Array.from(results.values());
    } catch (error) {
        console.error("Error searching users:", error);
        return [];
    }
};

// --- FRIENDS ---

export const addFriendToFirestore = async (userId, friend) => {
    try {
        const friendRef = doc(db, "users", userId, "friends", friend.id);
        await setDoc(friendRef, {
            ...friend,
            addedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding friend:", error);
        throw error;
    }
};

export const getFriendsFromFirestore = async (userId) => {
    try {
        const q = query(collection(db, "users", userId, "friends"));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        results.sort((a, b) => (b.addedAt?.seconds || 0) - (a.addedAt?.seconds || 0));
        return results;
    } catch (error) {
        console.error("Error fetching friends:", error);
        throw error;
    }
};

export const removeFriendFromFirestore = async (userId, friendId) => {
    try {
        await deleteDoc(doc(db, "users", userId, "friends", friendId));
    } catch (error) {
        console.error("Error removing friend:", error);
        throw error;
    }
};

export const acceptFriendInvite = async (currentUserId, targetUserId) => {
    if (currentUserId === targetUserId) return;
    try {
        // Fetch profiles
        const [meSnap, themSnap] = await Promise.all([
            getDoc(doc(db, "users", currentUserId)),
            getDoc(doc(db, "users", targetUserId))
        ]);

        if (!meSnap.exists() || !themSnap.exists()) return;

        const me = meSnap.data();
        const them = themSnap.data();

        // Establish mutual friendship
        await Promise.all([
            setDoc(doc(db, "users", currentUserId, "friends", targetUserId), {
                id: targetUserId,
                displayName: them.displayName,
                email: them.email,
                addedAt: serverTimestamp()
            }),
            setDoc(doc(db, "users", targetUserId, "friends", currentUserId), {
                id: currentUserId,
                displayName: me.displayName,
                email: me.email,
                addedAt: serverTimestamp()
            })
        ]);
    } catch (error) {
        console.error("Error accepting invite:", error);
        throw error;
    }
};

// --- CHATS ---

export const getOrCreateChat = async (userId1, userId2) => {
    try {
        const sortedIds = [userId1, userId2].sort();
        const chatId = sortedIds.join("_");
        const chatRef = doc(db, "chats", chatId);
        const chatDoc = await getDoc(chatRef);

        if (!chatDoc.exists()) {
            await setDoc(chatRef, {
                members: sortedIds,
                createdAt: serverTimestamp(),
                lastUpdatedAt: serverTimestamp(),
                lastMessage: ""
            });
        }
        return chatId;
    } catch (error) {
        console.error("Error getting chat:", error);
        throw error;
    }
};

export const sendChatMessage = async (chatId, senderId, text) => {
    try {
        const messagesRef = collection(db, "chats", chatId, "messages");
        const chatRef = doc(db, "chats", chatId);
        await addDoc(messagesRef, { text, senderId, createdAt: serverTimestamp() });
        await updateDoc(chatRef, { lastMessage: text, lastUpdatedAt: serverTimestamp() });
    } catch (error) {
        console.error("Error sending chat message:", error);
        throw error;
    }
};

export const subscribeToChatMessages = (chatId, callback) => {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
};

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
// --- AI ASSISTANT ---

export const addAIChatMessageToFirestore = async (userId, message) => {
    try {
        return await addDoc(collection(db, "users", userId, "aiChats"), {
            ...message,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error saving AI message:", error);
        throw error;
    }
};

export const getAIChatMessagesFromFirestore = async (userId) => {
    try {
        const q = query(collection(db, "users", userId, "aiChats"), orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching AI messages:", error);
        throw error;
    }
};

// --- USER PROFILE ---

export const updateUserProfile = async (userId, profileData) => {
    try {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {
            ...profileData,
            updatedAt: serverTimestamp()
        }, { merge: true });
        return true;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

export const getUserProfile = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

// --- FRIEND REQUESTS ---

export const sendFriendRequest = async (senderId, senderProfile, receiverId) => {
    try {
        const requestId = `${senderId}_${receiverId}`;
        const requestRef = doc(db, "friendRequests", requestId);
        await setDoc(requestRef, {
            senderId,
            senderName: senderProfile.displayName,
            senderEmail: senderProfile.email,
            receiverId,
            status: "pending",
            createdAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Error sending friend request:", error);
        throw error;
    }
};

export const subscribeToFriendRequests = (userId, callback) => {
    const q = query(collection(db, "friendRequests"), where("receiverId", "==", userId), where("status", "==", "pending"));
    return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
};

export const handleFriendRequestStatus = async (requestId, status, senderId, receiverId) => {
    try {
        const requestRef = doc(db, "friendRequests", requestId);
        await updateDoc(requestRef, { status });

        if (status === "accepted") {
            // Establish mutual friendship
            const [senderSnap, receiverSnap] = await Promise.all([
                getDoc(doc(db, "users", senderId)),
                getDoc(doc(db, "users", receiverId))
            ]);

            if (senderSnap.exists() && receiverSnap.exists()) {
                const senderData = senderSnap.data();
                const receiverData = receiverSnap.data();

                await Promise.all([
                    // Receiver adds Sender
                    setDoc(doc(db, "users", receiverId, "friends", senderId), {
                        id: senderId,
                        displayName: senderData.displayName,
                        email: senderData.email,
                        addedAt: serverTimestamp()
                    }),
                    // Sender adds Receiver
                    setDoc(doc(db, "users", senderId, "friends", receiverId), {
                        id: receiverId,
                        displayName: receiverData.displayName,
                        email: receiverData.email,
                        addedAt: serverTimestamp()
                    })
                ]);
            }
        }
    } catch (error) {
        console.error("Error handling friend request:", error);
        throw error;
    }
};

// --- GLOBAL TEAM CHAT ---

export const sendGlobalMessage = async (senderId, senderName, text) => {
    try {
        const msgData = {
            senderId,
            senderName,
            text,
            createdAt: serverTimestamp()
        };
        await addDoc(collection(db, "globalChat"), msgData);
    } catch (error) {
        console.error("Error sending global message:", error);
        throw error;
    }
};

export const subscribeToGlobalChat = (callback) => {
    const q = query(collection(db, "globalChat"), orderBy("createdAt", "asc"), limit(50));
    return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
};
