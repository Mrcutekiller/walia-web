import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Use NEXT_PUBLIC_ env vars so they work on both client and server.
// Fallback to hardcoded values so local dev works even without .env.local
const firebaseConfig = {
    apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            ?? "AIzaSyDM64dydNEEZq4eSRWX-oecelpdcnFvPuY",
    authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        ?? "walia-b8584.firebaseapp.com",
    projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         ?? "walia-b8584",
    storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     ?? "walia-b8584.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "962189431750",
    appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             ?? "1:962189431750:web:7e4e8c19ae757cc59818c7",
    measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID     ?? "G-R6447RSCNT",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
