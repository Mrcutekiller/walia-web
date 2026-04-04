'use client';

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';

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
    bio?: string;
    phone?: string;
    country?: string;
    level?: string;
    goal?: string;
    referralSource?: string;
    subjects?: string[];
    studyStyle?: string;
    plan?: string;
    isAdmin?: boolean;
    xp?: number;
    isPro?: boolean;
    followers?: string[];
    following?: string[];
    createdAt?: any;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: User = {
    id: '',
    name: 'User',
    username: 'user',
    email: '',
    photoURL: '/avatars/avatar1.jpg',
    plan: 'free',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = (uid: string) => {
        const userDocRef = doc(db, 'users', uid);
        return onSnapshot(userDocRef, (snap: any) => {
            if (snap.exists()) {
                setUser({ id: uid, ...snap.data() } as User);
            } else {
                setUser(null);
            }
            setLoading(false);
        }, (error) => {
            console.error('Error fetching user profile:', error);
            setLoading(false);
        });
    };

    useEffect(() => {
        let unsubscribeProfile: (() => void) | null = null;

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (unsubscribeProfile) {
                unsubscribeProfile();
                unsubscribeProfile = null;
            }

            if (firebaseUser) {
                unsubscribeProfile = fetchUserProfile(firebaseUser.uid);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribe();
            if (unsubscribeProfile) unsubscribeProfile();
        };
    }, []);

    const logout = async () => {
        const { signOut: firebaseSignOut } = await import('firebase/auth');
        await firebaseSignOut(auth);
        setUser(null);
    };

    const updateProfile = async (data: Partial<User>) => {
        if (!auth.currentUser) return;
        const { updateDoc } = await import('firebase/firestore');
        await updateDoc(doc(db, 'users', auth.currentUser.uid), data);
    };

    const refreshUser = () => {
        if (auth.currentUser) {
            fetchUserProfile(auth.currentUser.uid);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            isAuthenticated: !!user,
            logout,
            updateProfile,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
