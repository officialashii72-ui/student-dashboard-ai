import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * Firebase Configuration
 * 
 * Uses environment variables for security
 * NEVER expose API keys directly in source code!
 * 
 * Environment variables from .env.local:
 * - VITE_FIREBASE_API_KEY
 * - VITE_FIREBASE_AUTH_DOMAIN
 * - VITE_FIREBASE_PROJECT_ID
 * - VITE_FIREBASE_STORAGE_BUCKET
 * - VITE_FIREBASE_MESSAGING_SENDER_ID
 * - VITE_FIREBASE_APP_ID
 * - VITE_FIREBASE_MEASUREMENT_ID
 */
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate required environment variables
const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_AUTH_DOMAIN'
];

const missingVars = requiredVars.filter(v => !import.meta.env[v]);

if (missingVars.length > 0) {
    console.warn(`⚠️ Missing Firebase environment variables: ${missingVars.join(', ')}`);
    console.warn('📝 Create a .env.local file in your project root with these values.');
    console.warn('📝 See .env.example for template.');
}

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
            console.warn('Firestore offline persistence: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
            console.warn('Firestore offline persistence: Browser not supported');
        }
    });
}

export { app, analytics, db, auth };
