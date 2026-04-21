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
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        case 'auth/network-request-failed':
            return 'No internet connection. Please check your network and try again.';
        case 'FIRESTORE':
        case 'client-offline':
            return 'Cannot connect to server. Please check your internet connection.';
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
    referralSource?: string;
    subjects?: string[];
    studyStyle?: string;
    studyHours?: string;
    createdAt?: any;
    plan?: string;
    isAdmin?: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<any>;
    signup: (userData: Partial<User>, password: string) => Promise<any>;
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
        let authUnsubscribe: (() => void) | null = null;
        let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

        let isResolved = false;
        const completeLoading = () => {
            if (!isResolved) {
                isResolved = true;
                clearNetworkTimeout();
                setIsLoading(false);
            }
        };

        const checkFirstTime = async () => {
            try {
                const hasOpened = await AsyncStorage.getItem('has_opened_before');
                if (!hasOpened) {
                    await AsyncStorage.setItem('has_opened_before', 'true');
                    completeLoading();
                }
            } catch (e) {
                // Ignore storage errors
            }
        };
        
        checkFirstTime();

        fallbackTimer = setTimeout(() => {
            console.warn('Auth check taking too long (2.5s max). Forcing app to load.');
            completeLoading();
        }, 2500);

        const networkTimeout = setTimeout(() => {
            console.warn('Network check timeout. Proceeding without Firebase.');
            completeLoading();
        }, 5000);
        const clearNetworkTimeout = () => clearTimeout(networkTimeout);

        authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            try {
                if (profileUnsubscribe) {
                    profileUnsubscribe();
                    profileUnsubscribe = null;
                }

                if (fallbackTimer) {
                    clearTimeout(fallbackTimer);
                    fallbackTimer = null;
                }

                if (firebaseUser) {
                    const userDocRef = doc(db, 'users', firebaseUser.uid);

                    profileUnsubscribe = onSnapshot(userDocRef, async (snap: any) => {
                        let snapshotResolved = false;
                        const snapshotTimeout = setTimeout(() => {
                            if (!snapshotResolved) {
                                console.warn('Firestore snapshot timeout, completing with partial data');
                                if (snap.exists()) {
                                    const userData = snap.data();
                                    setUser({ ...userData, id: userData.id || firebaseUser.uid } as User);
                                }
                                completeLoading();
                            }
                        }, 3000);

                        try {
                            if (snap.exists()) {
                                const userData = snap.data();
                                setUser({ ...userData, id: userData.id || firebaseUser.uid } as User);
                                snapshotResolved = true;
                                clearTimeout(snapshotTimeout);
                                completeLoading();
                            } else {
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
                                snapshotResolved = true;
                                clearTimeout(snapshotTimeout);
                                completeLoading();
                            }
                        } catch (error) {
                            console.error('Profile snapshot error:', error);
                            snapshotResolved = true;
                            clearTimeout(snapshotTimeout);
                            completeLoading();
                        }
                    }, (error) => {
                        console.error('Firestore snapshot error:', error);
                        completeLoading();
                    });
                } else {
                    setUser(null);
                    completeLoading();
                }
            } catch (error) {
                console.error('Auth state change error:', error);
                setUser(null);
                completeLoading();
            }
        });

        return () => {
            if (authUnsubscribe) authUnsubscribe();
            if (profileUnsubscribe) profileUnsubscribe();
            if (fallbackTimer) clearTimeout(fallbackTimer);
        };
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const result = await signInWithEmailAndPassword(auth, email.trim(), password);
            // Login succeeded - the onAuthStateChanged listener will update the user state
            // Don't set isLoading(false) here as it will be handled by the auth state listener
            return result;
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
            // Signup succeeded - don't set isLoading(false) here, let auth listener handle it
            return { user: newUser, firebaseUser };
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
        try {
            setIsLoading(true);
            // Google sign-in on native (Expo) requires expo-google-sign-in or @react-native-google-signin/google-signin.
            // Since those native modules are not configured here, we surface a clear message.
            // The web version (Next.js) supports Google sign-in via signInWithPopup correctly.
            throw new Error('Google sign-in is only available on the web version. Please use email sign-in, or try the Walia web app.');
        } catch (e: any) {
            setIsLoading(false);
            throw e;
        }
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
