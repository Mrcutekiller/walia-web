'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [theme, setTheme] = useState<Theme>('light');

    // 1. Initial load from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('walia-theme') as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
            applyTheme(savedTheme);
        } else {
            // Default to light
            applyTheme('light');
        }
    }, []);

    // 2. Load from User Settings if logged in
    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(doc(db, 'users', user.uid), (snap: any) => {
            // Only update if the change came from the server, 
            // to avoid flickering while local state is updated optimistically.
            if (snap.exists() && !snap.metadata.hasPendingWrites) {
                const firestoreTheme = snap.data().theme as Theme;
                if (firestoreTheme && firestoreTheme !== theme) {
                    setTheme(firestoreTheme);
                    applyTheme(firestoreTheme);
                }
            }
        });
        return () => unsub();
    }, [user, theme]);

    // 3. Load Global Appearance Settings
    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'appearance'), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                if (data.primary) document.documentElement.style.setProperty('--color-walia-primary', data.primary);
                if (data.accent) document.documentElement.style.setProperty('--color-walia-accent', data.accent);
            }
        });
        return () => unsub();
    }, []);

    const applyTheme = (t: Theme) => {
        if (t === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('walia-theme', newTheme);
        setTheme(newTheme);
        applyTheme(newTheme);

        if (user) {
            try {
                await updateDoc(doc(db, 'users', user.uid), { theme: newTheme });
            } catch (error) {
                console.error('Failed to sync theme to Firestore:', error);
            }
        }
    };

    const changeTheme = async (newTheme: Theme) => {
        localStorage.setItem('walia-theme', newTheme);
        setTheme(newTheme);
        applyTheme(newTheme);

        if (user) {
            try {
                await updateDoc(doc(db, 'users', user.uid), { theme: newTheme });
            } catch (error) {
                console.error('Failed to sync theme to Firestore:', error);
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
