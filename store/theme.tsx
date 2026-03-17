import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// ─── Color Palettes ───
const LightColors = {
    primary: '#000000',
    primaryLight: '#262626',
    primaryDark: '#000000',
    secondary: '#FF6B6B',
    accent: '#6366F1',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',

    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F9FAFB',
    card: '#FFFFFF',

    text: '#000000',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',

    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    divider: '#F3F4F6',

    sent: '#000000',
    received: '#F3F4F6',

    overlay: 'rgba(0,0,0,0.5)',
    shadow: 'rgba(0,0,0,0.08)',
};

const DarkColors = {
    primary: '#FFFFFF',
    primaryLight: '#F9FAFB',
    primaryDark: '#E5E7EB',
    secondary: '#FF6B6B',
    accent: '#818CF8',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',

    background: '#0A0A0A',
    surface: '#121212',
    surfaceAlt: '#1A1A1A',
    card: '#121212',

    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    textInverse: '#000000',

    border: '#262626',
    borderLight: '#1A1A1A',
    divider: '#1A1A1A',

    sent: '#FFFFFF',
    received: '#1A1A1A',

    overlay: 'rgba(0,0,0,0.7)',
    shadow: 'rgba(0,0,0,0.3)',
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
    const [mode, setMode] = useState<ThemeMode>('light');

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then(saved => {
            if (saved === 'dark' || saved === 'light') setMode(saved);
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

