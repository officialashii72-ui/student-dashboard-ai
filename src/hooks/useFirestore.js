import { useState, useEffect, useMemo } from 'react';
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

/**
 * useFirestore Hook
 * 
 * Provides real-time synchronization and CRUD operations.
 * Scoped to users/{uid}/{collectionName}
 */
const useFirestore = (collectionName) => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    // Memoize collection reference to prevent unnecessary effect triggers
    const colRef = useMemo(() => {
        if (!currentUser) return null;
        return collection(db, 'users', currentUser.uid, collectionName);
    }, [currentUser, collectionName]);

    useEffect(() => {
        if (!colRef) {
            setLoading(false);
            return;
        }

        setLoading(true);
        // We remove the Firestore-level orderBy to avoid index issues and 
        // potential flickering with pending server timestamps.
        const q = query(colRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));

            // Sort in memory by createdAt (newest first)
            // Handle cases where createdAt might be null (pending write)
            results.sort((a, b) => {
                const timeA = a.createdAt?.seconds || Date.now() / 1000;
                const timeB = b.createdAt?.seconds || Date.now() / 1000;
                return timeB - timeA;
            });

            setDocs(results);
            setLoading(false);
        }, (error) => {
            console.error(`Firestore Error [${collectionName}]:`, error);
            setLoading(false);
        });

        return unsubscribe;
    }, [colRef, collectionName]);

    const addItem = async (item) => {
        if (!colRef) {
            console.error("Cannot add item: User not authenticated or collection reference missing.");
            return;
        }
        try {
            return await addDoc(colRef, {
                ...item,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error(`Error adding to ${collectionName}:`, error);
            throw error;
        }
    };

    const updateItem = async (id, updates) => {
        if (!colRef || !currentUser) return;
        try {
            const docRef = doc(db, 'users', currentUser.uid, collectionName, id);
            return await updateDoc(docRef, updates);
        } catch (error) {
            console.error(`Error updating ${collectionName}:`, error);
            throw error;
        }
    };

    const deleteItem = async (id) => {
        if (!colRef || !currentUser) return;
        try {
            const docRef = doc(db, 'users', currentUser.uid, collectionName, id);
            return await deleteDoc(docRef);
        } catch (error) {
            console.error(`Error deleting from ${collectionName}:`, error);
            throw error;
        }
    };

    return { docs, loading, addItem, updateItem, deleteItem };
};

export default useFirestore;

