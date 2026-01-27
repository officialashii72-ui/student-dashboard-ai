import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * Firebase Configuration
 * 
 * Note: For a production app, these should be stored in environment variables.
 * However, since these are provided directly by the user, I am placing them here.
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

export { app, analytics, db, auth };
