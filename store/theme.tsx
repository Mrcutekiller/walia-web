import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// ─── Color Palettes ───
const LightColors = {
    primary: '#6366F1', // Indigo 500 — consistent with all dashboard screens
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#EC4899', // Pink 500
    accent: '#8B5CF6', // Violet 500
    accentLight: '#A78BFA',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',

    background: '#F8FAFC', // Soft off-white — premium feel
    surface: '#FFFFFF',
    surfaceAlt: '#F1F5F9', // Slate 100
    card: '#FFFFFF',

    text: '#0F172A',
    textSecondary: '#475569', // Slate 600
    textTertiary: '#94A3B8', // Slate 400
    textInverse: '#FFFFFF',

    border: '#E2E8F0', // Slate 200
    borderLight: '#F1F5F9',
    divider: '#F1F5F9',

    sent: '#6366F1',
    received: '#F1F5F9',

    overlay: 'rgba(15, 23, 42, 0.5)',
    shadow: 'rgba(99, 102, 241, 0.08)',
};

const DarkColors = {
    primary: '#6366F1', // Indigo 500 as primary action color in dark mode
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#F472B6',
    accent: '#818CF8',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',

    background: '#020617', // Deep slate/navy
    surface: '#0F172A',
    surfaceAlt: '#1E293B',
    card: '#0F172A',

    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textInverse: '#0F172A',

    border: '#1E293B',
    borderLight: '#334155',
    divider: '#1E293B',

    sent: '#6366F1',
    received: '#1E293B',

    overlay: 'rgba(0, 0, 0, 0.8)',
    shadow: 'rgba(0, 0, 0, 0.4)',
};

export type ThemeMode = 'light' | 'dark';
export type ThemeColors = typeof LightColors;

interface ThemeContextType {
    mode: ThemeMode;
    colors: ThemeColors;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    mode: 'light',
    colors: LightColors,
    toggleTheme: () => { },
    setTheme: () => { },
    isDark: false,
});

const STORAGE_KEY = '@walia_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>('light'); // Always default to light mode

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then(saved => {
            // Only switch to dark if user explicitly chose dark mode
            if (saved === 'dark') setMode('dark');
            // Otherwise keep light mode (default)
        });
    }, []);

    const toggleTheme = () => {
        const next = mode === 'light' ? 'dark' : 'light';
        setMode(next);
        AsyncStorage.setItem(STORAGE_KEY, next);
    };

    const setTheme = (m: ThemeMode) => {
        setMode(m);
        AsyncStorage.setItem(STORAGE_KEY, m);
    };

    const colors = mode === 'dark' ? DarkColors : LightColors;

    return (
        <ThemeContext.Provider value={{ mode, colors, toggleTheme, setTheme, isDark: mode === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}

// Export palettes for static usage
export { DarkColors, LightColors };

