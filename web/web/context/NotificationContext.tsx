'use client';

import React, { createContext, useContext, useState } from 'react';

// Mock Notifications Data (moved from page.tsx to global state)
const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        title: 'New AI Features Added',
        description: 'Try out the new Flashcard Generator and Session Planner in the Tools section.',
        time: '2 hours ago',
        read: false,
        type: 'feature',
        icon: 'Sparkles',
        link: '/dashboard/tools'
    },
    {
        id: '2',
        title: 'Community Milestone',
        description: 'The Walia community just reached 10,000 active learners! Thank you for being part of the journey.',
        time: '1 day ago',
        read: true,
        type: 'milestone',
        icon: 'Users',
        link: '/dashboard/community'
    },
    {
        id: '3',
        title: 'Security Alert',
        description: 'We noticed a new login from a Mac device in Addis Ababa. If this was you, you can ignore this message.',
        time: '2 days ago',
        read: true,
        type: 'security',
        icon: 'ShieldAlert',
        link: '/dashboard/settings'
    },
    {
        id: '4',
        title: 'Weekly Summary',
        description: 'You completed 5 study sessions and generated 20 AI notes this week. Keep up the great work!',
        time: '5 days ago',
        read: true,
        type: 'summary',
        icon: 'BarChart3',
        link: '/dashboard'
    }
];

export interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
    type: string;
    icon: string;
    link: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            deleteNotification
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
