'use client';

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, writeBatch } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
    type: string;
    icon: string;
    link: string;
    createdAt?: any;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const q = query(
                    collection(db, 'users', user.uid, 'notifications'),
                    orderBy('createdAt', 'desc')
                );
                const unsub = onSnapshot(q, (snap) => {
                    const notifs = snap.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        read: doc.data().read || false,
                    })) as Notification[];
                    setNotifications(notifs);
                    setLoading(false);
                });
                return () => unsub();
            } else {
                setNotifications([]);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = async (id: string) => {
        if (!auth.currentUser) return;
        await updateDoc(doc(db, 'users', auth.currentUser.uid, 'notifications', id), { read: true });
    };

    const markAllAsRead = async () => {
        if (!auth.currentUser) return;
        const batch = writeBatch(db);
        notifications.forEach(n => {
            if (!n.read) {
                batch.update(doc(db, 'users', auth.currentUser!.uid, 'notifications', n.id), { read: true });
            }
        });
        await batch.commit();
    };

    const deleteNotification = async (id: string) => {
        if (!auth.currentUser) return;
        await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'notifications', id));
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            loading
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
