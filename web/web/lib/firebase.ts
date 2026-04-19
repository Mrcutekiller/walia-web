import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDM64dydNEEZq4eSRWX-oecelpdcnFvPuY",
    authDomain: "walia-b8584.firebaseapp.com",
    projectId: "walia-b8584",
    storageBucket: "walia-b8584.firebasestorage.app",
    messagingSenderId: "962189431750",
    appId: "1:962189431750:web:7e4e8c19ae757cc59818c7",
    measurementId: "G-R6447RSCNT"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});
export default app;
