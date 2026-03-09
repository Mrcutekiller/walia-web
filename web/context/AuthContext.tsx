'use client';

import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: User | null;
<<<<<<< HEAD
    profile: any | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                const { doc, onSnapshot } = require('firebase/firestore');
                const { db } = require('@/lib/firebase');
                const unsubProfile = onSnapshot(doc(db, 'users', user.uid), (snap: any) => {
                    if (snap.exists()) setProfile(snap.data());
                    else setProfile(null);
                    setLoading(false);
                });
                return () => unsubProfile();
            } else {
                setProfile(null);
                setLoading(false);
            }
=======
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
        });

        return () => unsubscribe();
    }, []);

    return (
<<<<<<< HEAD
        <AuthContext.Provider value={{ user, profile, loading }}>
=======
        <AuthContext.Provider value={{ user, loading }}>
>>>>>>> 0e3ed76 (feat: web/mobile parity overhaul - all files included)
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
