'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light'; // Forced light mode

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme] = useState<Theme>('light');

    useEffect(() => {
        // Enforce light mode on mount
        document.documentElement.classList.remove('dark');
        localStorage.setItem('walia-theme', 'light');
    }, []);

    const toggleTheme = () => {
        // No-op to prevent crashing any leftover toggle buttons
        console.log('Dark mode is disabled.');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
