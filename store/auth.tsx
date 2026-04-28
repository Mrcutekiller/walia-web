import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { sendCredentialsEmail, sendWelcomeEmail } from '@/services/email';

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
    createdAt?: string;
    plan?: string;
    isAdmin?: boolean;
    password?: string;
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

const STORAGE_KEY = 'walia_users';
const CURRENT_USER_KEY = 'walia_current_user';

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

function generateId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function getStoredUsers(): Promise<Record<string, User>> {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
}

async function saveStoredUsers(users: Record<string, User>): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem(CURRENT_USER_KEY);
                if (userData) {
                    const parsed = JSON.parse(userData);
                    if (parsed.email && parsed.password) {
                        const users = await getStoredUsers();
                        const storedUser = users[parsed.email];
                        if (storedUser && storedUser.password === parsed.password) {
                            setUser(storedUser);
                        } else {
                            await AsyncStorage.removeItem(CURRENT_USER_KEY);
                        }
                    }
                }
            } catch (e) {
                console.error('Auth load error:', e);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        loadUser();

        return () => clearTimeout(timer);
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const users = await getStoredUsers();
            const storedUser = users[email.toLowerCase().trim()];
            
            if (!storedUser) {
                throw new Error("We couldn't find an account with this email. Would you like to sign up?");
            }
            
            if (storedUser.password !== password) {
                throw new Error('Incorrect password. Please try again or reset it.');
            }

            await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email: storedUser.email, password: storedUser.password }));
            setUser(storedUser);
            return { user: storedUser };
        } catch (e: any) {
            throw new Error(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (userData: Partial<User>, password: string) => {
        setIsLoading(true);
        try {
            const email = (userData.email || '').toLowerCase().trim();
            if (!email) {
                throw new Error('Please enter a valid email address.');
            }

            const users = await getStoredUsers();
            
            if (users[email]) {
                throw new Error('This email is already registered. Please try logging in instead.');
            }

            const newUser: User = {
                ...DEFAULT_USER,
                ...userData,
                id: generateId(),
                name: userData.name || email.split('@')[0] || 'User',
                username: userData.username || email.split('@')[0] || `user_${Date.now()}`,
                email: email,
                photoURL: userData.photoURL || '/avatars/avatar1.jpg',
                password: password,
                createdAt: new Date().toISOString(),
            };

            users[email] = newUser;
            await saveStoredUsers(users);
            await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email: newUser.email, password: newUser.password }));
            
            try {
                if (newUser.email) {
                    await sendWelcomeEmail(newUser.email, newUser.name);
                    await sendCredentialsEmail(newUser.email, password);
                }
            } catch (emailError) {
                console.error('Emails failed, but signup succeeded', emailError);
            }

            setUser(newUser);
            return { user: newUser };
        } catch (e: any) {
            throw new Error(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
        setUser(null);
    };

    const updateProfile = async (data: Partial<User>) => {
        if (!user) return;
        
        const updatedUser = { ...user, ...data };
        const users = await getStoredUsers();
        users[user.email.toLowerCase()] = updatedUser;
        await saveStoredUsers(users);
        
        if (user.email) {
            await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email: updatedUser.email, password: updatedUser.password }));
        }
        
        setUser(updatedUser);
    };

    const loginWithGoogle = async () => {
        throw new Error('Google sign-in is not available in this version. Please use email sign-in.');
    };

    const resetPassword = async (email: string) => {
        const users = await getStoredUsers();
        const storedUser = users[email.toLowerCase().trim()];
        
        if (!storedUser) {
            throw new Error("We couldn't find an account with this email.");
        }
        
        throw new Error('Password reset is not available in this version. Please contact support.');
    };

    const uploadAvatar = async (uri: string): Promise<string> => {
        if (!user) throw new Error('Not authenticated');
        return uri;
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