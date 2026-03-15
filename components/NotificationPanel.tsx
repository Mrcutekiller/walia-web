'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { formatTimeAgo } from '@/lib/utils';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Info, MessageSquare, ShieldAlert, Users, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export interface AppNotification {
    id?: string;
    userId: string;
    title: string;
    message: string;
    type: 'message' | 'invite' | 'community' | 'system';
    read: boolean;
    createdAt: any;
    link?: string;
}

export default function NotificationPanel() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AppNotification[];
            setNotifications(notifs);
        });

        return () => unsubscribe();
    }, [user]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = async (id: string) => {
        if (!id) return;
        try {
            await updateDoc(doc(db, 'notifications', id), { read: true });
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const deleteNotification = async (id: string) => {
        if (!id) return;
        try {
            await deleteDoc(doc(db, 'notifications', id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const markAllAsRead = async () => {
        const unread = notifications.filter(n => !n.read);
        for (const notif of unread) {
            if (notif.id) await markAsRead(notif.id);
        }
    };

    const clearAll = async () => {
        const confirmClear = window.confirm('Are you sure you want to delete all notifications?');
        if (!confirmClear) return;
        
        for (const notif of notifications) {
            if (notif.id) await deleteNotification(notif.id);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'message': return <MessageSquare className="w-4 h-4 text-blue-500" />;
            case 'invite': return <Users className="w-4 h-4 text-emerald-500" />;
            case 'community': return <Users className="w-4 h-4 text-indigo-500" />;
            case 'system': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
            default: return <Info className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="relative z-50" ref={panelRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-all flex items-center justify-center"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-black rounded-full" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-[calc(100%+10px)] left-0 lg:left-auto lg:right-0 w-[320px] max-h-[400px] flex flex-col bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 shrink-0">
                            <h3 className="font-black text-xs text-black dark:text-white uppercase tracking-[0.2em]">Notifications</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full text-black/40 dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/20 hover:text-black dark:hover:text-white transition-all text-black dark:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto w-full">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-black/40 dark:text-white/40">
                                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-xs font-bold">You're all caught up!</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-black/5 dark:divide-white/5">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => {
                                                if (!notif.read && notif.id) markAsRead(notif.id);
                                            }}
                                            className={`flex gap-3 p-4 transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 ${!notif.read ? 'bg-indigo-50 dark:bg-indigo-950/20' : ''}`}
                                        >
                                            <div className="mt-1 shrink-0 bg-white dark:bg-black p-2 rounded-full border border-black/5 dark:border-white/5 shadow-sm h-min">
                                                {getTypeIcon(notif.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`text-sm ${!notif.read ? 'font-bold text-black dark:text-white' : 'font-medium text-black/70 dark:text-white/70'}`}>
                                                        {notif.title}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-black/40 dark:text-white/40 whitespace-nowrap mt-0.5 font-semibold">
                                                            {formatTimeAgo(notif.createdAt)}
                                                        </span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (notif.id) deleteNotification(notif.id);
                                                            }}
                                                            className="p-2 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                            title="Dismiss notification"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-black/60 dark:text-white/60 mt-1 line-clamp-2 leading-relaxed">
                                                    {notif.message}
                                                </p>
                                                {notif.link && (
                                                    <Link
                                                        href={notif.link}
                                                        className="inline-block mt-2 text-[10px] uppercase font-black tracking-wider text-indigo-600 dark:text-indigo-400 hover:underline"
                                                    >
                                                        View Details →
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex gap-2 shrink-0">
                                <button
                                    onClick={markAllAsRead}
                                    className="flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-black/50 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/20 hover:text-black dark:hover:text-white transition-all"
                                >
                                    Mark all as Read
                                </button>
                                <button
                                    onClick={clearAll}
                                    className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-rose-500/20"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
