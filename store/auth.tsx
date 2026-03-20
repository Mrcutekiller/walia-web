import { sendCredentialsEmail, sendWelcomeEmail } from '@/services/email';
import { auth, db, storage } from '@/services/firebase';
import {
    createUserWithEmailAndPassword,
    updateProfile as firebaseUpdateProfile,
    User as FirebaseUser,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please try logging in instead. ✨';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled. Please contact support.';
        case 'auth/weak-password':
            return 'Your password is too weak. Please use at least 6 characters.';
        case 'auth/user-not-found':
            return 'We couldn\'t find an account with this email. Would you like to sign up?';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again or reset it.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        default:
            return 'Something went wrong. Please try again.';
    }
};

interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    photoURL?: string;
    gender?: string;
    age?: string;
    schoolLevel?: string;
    school?: string;
    useCases?: string[];
    whyWalia?: string;
    bio?: string;
    phone?: string;
    country?: string;
    level?: string;
    goal?: string;
    createdAt?: any;
    plan?: string;
    isAdmin?: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (userData: Partial<User>, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    uploadAvatar: (uri: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: User = {
    id: '',
    name: 'User',
    username: 'user',
    email: '',
    photoURL: '/avatars/avatar1.jpg',
    gender: '',
    age: '',
    schoolLevel: '',
    school: '',
    useCases: [],
    whyWalia: '',
    bio: '',
    phone: '',
    country: '',
    level: '',
    goal: '',
    plan: 'free',
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let profileUnsubscribe: (() => void) | null = null;

        // Fallback: If Firebase hangs for more than 3 seconds, forcefully end the loading state
        const fallbackTimer = setTimeout(() => {
            if (isLoading) {
                console.warn('Firebase auth check timed out, forcing app to load.');
                setIsLoading(false);
            }
        }, 3000);

        const authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            clearTimeout(fallbackTimer);
            try {
                if (profileUnsubscribe) {
                    profileUnsubscribe();
                    profileUnsubscribe = null;
                }

                if (firebaseUser) {
                    const userDocRef = doc(db, 'users', firebaseUser.uid);

                    // Listen for real-time profile updates immediately
                    profileUnsubscribe = onSnapshot(userDocRef, async (snap: any) => {
                        if (snap.exists()) {
                            setUser(snap.data() as User);
                            setIsLoading(false);
                        } else {
                            // If user exists in Auth but not Firestore (e.g. Google login for first time)
                            if (!firebaseUser.providerData.some(p => p.providerId === 'password')) {
                                const newUser: User = {
                                    ...DEFAULT_USER,
                                    id: firebaseUser.uid,
                                    email: firebaseUser.email || '',
                                    name: firebaseUser.displayName || 'User',
                                    username: firebaseUser.email?.split('@')[0] || `user_${firebaseUser.uid.slice(0, 5)}`,
                                    photoURL: firebaseUser.photoURL || '/avatars/avatar1.jpg',
                                    createdAt: new Date().toISOString(),
                                };
                                await setDoc(userDocRef, newUser);
                                setUser(newUser);
                            }
                            setIsLoading(false);
                        }
                    });
                } else {
                    setUser(null);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Auth state change error:', error);
                setUser(null);
                setIsLoading(false);
            }
        });

        return () => {
            authUnsubscribe();
            if (profileUnsubscribe) profileUnsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, email.trim(), password);
        } catch (e: any) {
            setIsLoading(false);
            throw new Error(getFriendlyErrorMessage(e.code));
        }
    };

    const signup = async (userData: Partial<User>, password: string) => {
        try {
            setIsLoading(true);
            const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, userData.email || '', password);

            const newUser: User = {
                ...DEFAULT_USER,
                ...userData,
                id: firebaseUser.uid,
                name: userData.name || firebaseUser.email?.split('@')[0] || 'User',
                username: userData.username || firebaseUser.email?.split('@')[0] || `user_${firebaseUser.uid.slice(0, 5)}`,
                email: userData.email || firebaseUser.email || '',
                photoURL: userData.photoURL || '/avatars/avatar1.jpg',
                createdAt: new Date().toISOString(),
            };

            // Set Firestore doc FIRST so the listener picks it up
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            await firebaseUpdateProfile(firebaseUser, { displayName: newUser.name });

            // Send welcome emails via Resend
            try {
                if (newUser.email) {
                    await sendWelcomeEmail(newUser.email, newUser.name);
                    await sendCredentialsEmail(newUser.email, password);
                }
            } catch (emailError) {
                console.error("Emails failed, but signup succeeded", emailError);
            }
        } catch (e: any) {
            setIsLoading(false);
            throw new Error(getFriendlyErrorMessage(e.code));
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    const updateProfile = async (data: Partial<User>) => {
        if (auth.currentUser) {
            await updateDoc(doc(db, 'users', auth.currentUser.uid), data);
            if (data.name) {
                await firebaseUpdateProfile(auth.currentUser, { displayName: data.name });
            }
        }
    };

    const loginWithGoogle = async () => {
        // This will be implemented with expo-auth-session
        console.log('Google login requested');
    };

    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    const uploadAvatar = async (uri: string): Promise<string> => {
        if (!auth.currentUser) throw new Error('Not authenticated');
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        await updateProfile({ photoURL: url });
        return url;
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, signup, logout, updateProfile, loginWithGoogle, resetPassword, uploadAvatar }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
