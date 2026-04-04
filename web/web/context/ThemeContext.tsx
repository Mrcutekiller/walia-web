'use client';

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
    colors: {
        primary: string;
        background: string;
        surface: string;
        text: string;
        border: string;
    };
}

const lightColors = {
    primary: '#000000',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#1A1A2E',
    border: '#E5E7EB',
};

const darkColors = {
    primary: '#FFFFFF',
    background: '#0A0A0A',
    surface: '#121212',
    text: '#FFFFFF',
    border: '#262626',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('walia-theme') as Theme;
        if (savedTheme === 'dark' || savedTheme === 'light') {
            setThemeState(savedTheme);
            applyTheme(savedTheme);
        }
    }, []);

    const applyTheme = (t: Theme) => {
        if (t === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setThemeState(newTheme);
        localStorage.setItem('walia-theme', newTheme);
        applyTheme(newTheme);

        if (auth.currentUser) {
            await updateDoc(doc(db, 'users', auth.currentUser.uid), { theme: newTheme });
        }
    };

    const setTheme = async (t: Theme) => {
        setThemeState(t);
        localStorage.setItem('walia-theme', t);
        applyTheme(t);

        if (auth.currentUser) {
            await updateDoc(doc(db, 'users', auth.currentUser.uid), { theme: t });
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const unsub = onSnapshot(doc(db, 'users', user.uid), (snap: any) => {
                    if (snap.exists() && snap.data().theme) {
                        const userTheme = snap.data().theme as Theme;
                        if (userTheme !== theme) {
                            setThemeState(userTheme);
                            localStorage.setItem('walia-theme', userTheme);
                            applyTheme(userTheme);
                        }
                    }
                });
                return () => unsub();
            }
        });

        return () => unsubscribe();
    }, []);

    const colors = theme === 'dark' ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark: theme === 'dark', colors }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
