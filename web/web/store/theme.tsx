import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// ─── Color Palettes ───
const LightColors = {
    primary: '#6C63FF',
    primaryLight: '#8B85FF',
    primaryDark: '#5A52E0',
    secondary: '#FF6B6B',
    accent: '#4ECDC4',
    success: '#2ED573',
    warning: '#FFA502',
    error: '#FF4757',

    background: '#F8F7FC',
    surface: '#FFFFFF',
    surfaceAlt: '#F0EEFF',
    card: '#FFFFFF',

    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',

    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    divider: '#F0F0F5',

    sent: '#6C63FF',
    received: '#F0F0F5',

    overlay: 'rgba(0,0,0,0.5)',
    shadow: 'rgba(0,0,0,0.08)',
};

const DarkColors = {
    primary: '#6C63FF',
    primaryLight: '#8B85FF',
    primaryDark: '#5A52E0',
    secondary: '#FF6B6B',
    accent: '#4ECDC4',
    success: '#2ED573',
    warning: '#FFA502',
    error: '#FF4757',

    background: '#0D0D1A',
    surface: '#1A1A2E',
    surfaceAlt: '#252540',
    card: '#1A1A2E',

    text: '#F0F0F5',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    textInverse: '#1A1A2E',

    border: '#2D2D45',
    borderLight: '#252540',
    divider: '#252540',

    sent: '#6C63FF',
    received: '#252540',

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

