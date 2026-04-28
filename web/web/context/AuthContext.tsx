'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    id: string;
    uid: string;
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
    createdAt?: string;
    password?: string;
    [key: string]: any;
}

function normalizeUser(user: User): User {
    return {
        ...user,
        uid: user.uid || user.id,
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    login: (email: string, password: string) => Promise<any>;
    signup: (email: string, password: string) => Promise<any>;
    loginWithGoogle: () => Promise<any>;
    updateProfile: (data: Partial<User>) => Promise<void>;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'walia_users';
const CURRENT_USER_KEY = 'walia_current_user';

const DEFAULT_USER: User = {
    id: '',
    uid: '',
    name: 'User',
    username: 'user',
    email: '',
    photoURL: '/avatars/avatar1.jpg',
    plan: 'free',
};

function generateId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function getStoredUsers(): Promise<Record<string, User>> {
    if (typeof window === 'undefined') return {};
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
}

async function saveStoredUsers(users: Record<string, User>): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = localStorage.getItem(CURRENT_USER_KEY);
                if (userData) {
                    const parsed = JSON.parse(userData);
                    if (parsed.email && parsed.password) {
                        const users = await getStoredUsers();
                        const storedUser = users[parsed.email.toLowerCase()];
                        if (storedUser && storedUser.password === parsed.password) {
                            setUser(normalizeUser(storedUser));
                        } else {
                            localStorage.removeItem(CURRENT_USER_KEY);
                        }
                    }
                }
            } catch (e) {
                console.error('Auth load error:', e);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        loadUser();

        return () => clearTimeout(timer);
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const loginKey = email.toLowerCase().trim();
            const users = await getStoredUsers();
            let storedUser: User | undefined = users[loginKey];

            if (!storedUser) {
                storedUser = Object.values(users).find(
                    user => user.username?.toLowerCase() === loginKey || user.email?.toLowerCase() === loginKey
                );
            }

            if (!storedUser) {
                throw new Error("We couldn't find an account with that email or username. Would you like to sign up?");
            }

            if (storedUser.password !== password) {
                throw new Error('Incorrect password. Please try again.');
            }

            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email: storedUser.email, password: storedUser.password }));
            const normalizedUser = normalizeUser(storedUser);
            setUser(normalizedUser);
            return { user: normalizedUser };
        } catch (e: any) {
            throw new Error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email: string, password: string) => {
        setLoading(true);
        try {
            const normalizedEmail = email.toLowerCase().trim();
            if (!normalizedEmail) {
                throw new Error('Please enter a valid email address.');
            }

            const users = await getStoredUsers();
            
            if (users[normalizedEmail]) {
                throw new Error('This email is already registered. Please try logging in instead.');
            }

            const id = generateId();
            const newUser: User = {
                ...DEFAULT_USER,
                id,
                uid: id,
                name: normalizedEmail.split('@')[0] || 'User',
                username: normalizedEmail.split('@')[0] || `user_${Date.now()}`,
                email: normalizedEmail,
                photoURL: '/avatars/avatar1.jpg',
                password: password,
                createdAt: new Date().toISOString(),
                plan: 'free',
            };

            users[normalizedEmail] = newUser;
            await saveStoredUsers(users);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email: newUser.email, password: newUser.password }));
            
            const normalizedUser = normalizeUser(newUser);
            setUser(normalizedUser);
            return { user: normalizedUser };
        } catch (e: any) {
            throw new Error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        localStorage.removeItem(CURRENT_USER_KEY);
        setUser(null);
    };

    const updateProfile = async (data: Partial<User>) => {
        if (!user) return;
        
        const updatedUser = normalizeUser({ ...user, ...data });
        const users = await getStoredUsers();
        users[updatedUser.email.toLowerCase()] = updatedUser;
        await saveStoredUsers(users);
        
        if (updatedUser.email) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email: updatedUser.email, password: updatedUser.password }));
        }
        
        setUser(updatedUser);
    };

    const loginWithGoogle = async () => {
        throw new Error('Google sign-in is not available. Please use email sign-in.');
    };

    const refreshUser = () => {
        // No-op for local storage
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            isAuthenticated: !!user,
            login,
            signup,
            loginWithGoogle,
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