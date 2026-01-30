import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * Firebase Configuration
 */
const firebaseConfig = {
    apiKey: "AIzaSyBUEqNY5zjsd98TRc77JsxdvdGxJ3Vv_68",
    authDomain: "student-dashboard-public.firebaseapp.com",
    projectId: "student-dashboard-public",
    storageBucket: "student-dashboard-public.firebasestorage.app",
    messagingSenderId: "668396838993",
    appId: "1:668396838993:web:64f7cd8531ccc1c6185870",
    measurementId: "G-R3E7WML52P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);

// Enable Offline Persistence for Firestore
if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Firestore Persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
            console.warn('Firestore Persistence failed: Browser not supported');
        }
    });
}

export { app, analytics, db, auth };
