import { useState, useEffect } from 'react';
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

/**
 * useFirestore Hook
 * 
 * Provides real-time synchronization and CRUD operations for a specific 
 * sub-collection under the current user's document.
 * 
 * Path: users/{uid}/{collectionName}
 */
const useFirestore = (collectionName) => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    // Collection reference scoped to the user
    const colRef = currentUser
        ? collection(db, 'users', currentUser.uid, collectionName)
        : null;

    useEffect(() => {
        if (!colRef) return;

        // Query documents ordered by creation time
        const q = query(colRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results = [];
            snapshot.docs.forEach((doc) => {
                results.push({ ...doc.data(), id: doc.id });
            });
            setDocs(results);
            setLoading(false);
        }, (error) => {
            console.error(`Error fetching ${collectionName}:`, error);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser, collectionName]);

    const addItem = async (item) => {
        if (!colRef) return;
        return await addDoc(colRef, {
            ...item,
            createdAt: serverTimestamp()
        });
    };

    const updateItem = async (id, updates) => {
        if (!colRef) return;
        const docRef = doc(db, 'users', currentUser.uid, collectionName, id);
        return await updateDoc(docRef, updates);
    };

    const deleteItem = async (id) => {
        if (!colRef) return;
        const docRef = doc(db, 'users', currentUser.uid, collectionName, id);
        return await deleteDoc(docRef);
    };

    return { docs, loading, addItem, updateItem, deleteItem };
};

export default useFirestore;
