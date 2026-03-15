'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { formatTimeAgo } from '@/lib/utils';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Info, MessageSquare, ShieldAlert, Users, X, Calendar as CalendarIcon, Check } from 'lucide-react';
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

    // Real-time task/event checker
    useEffect(() => {
        if (!user) return;
        
        let notifiedEvents = new Set<string>();
        
        const q = query(collection(db, 'users', user.uid, 'events'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
            
            const checkEvents = setInterval(() => {
                const now = new Date();
                const currentDate = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
                const currentTime = now.toTimeString().substring(0, 5); // HH:MM
                
                events.forEach(async event => {
                    const eventKey = `${event.id}-${currentDate}-${currentTime}`;
                    if (event.date === currentDate && event.time === currentTime && !notifiedEvents.has(eventKey)) {
                        notifiedEvents.add(eventKey);
                        // Trigger real-time notification
                        try {
                            await addDoc(collection(db, 'notifications'), {
                                userId: user.uid,
                                title: 'Task Reminder',
                                message: `It's time for: ${event.title}`,
                                type: 'system',
                                read: false,
                                createdAt: serverTimestamp(),
                                link: '/dashboard/calendar'
                            });
                        } catch (e) {
                            console.error('Failed to create event notification:', e);
                        }
                    }
                });
            }, 60000); // Check every minute
            
            return () => clearInterval(checkEvents);
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

    const deleteNotification = async (id: string | undefined) => {
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
        <div className="relative z-50 font-sans" ref={panelRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-black/50 hover:bg-black/5 hover:text-black transition-all flex items-center justify-center transform active:scale-95"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute bottom-[calc(100%+12px)] left-0 lg:left-auto lg:right-0 w-[340px] max-h-[480px] flex flex-col bg-white border border-gray-100 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-5 border-b border-gray-50 bg-gray-50/30 shrink-0">
                            <h3 className="font-black text-[10px] text-black uppercase tracking-[0.2em] opacity-40">Live Notifications</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full text-black/20 hover:bg-black/5 hover:text-black transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-10 text-center text-gray-300">
                                    <Bell className="w-10 h-10 mx-auto mb-3 opacity-10" />
                                    <p className="text-xs font-black uppercase tracking-widest">Inbox Empty</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => {
                                                if (!notif.read && notif.id) markAsRead(notif.id);
                                            }}
                                            className={`flex gap-4 p-5 transition-all cursor-pointer hover:bg-gray-50 group ${!notif.read ? 'bg-indigo-50/30' : ''}`}
                                        >
                                            <div className="mt-1 shrink-0 bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm h-min group-hover:scale-110 transition-transform">
                                                {getTypeIcon(notif.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`text-[13px] leading-tight ${!notif.read ? 'font-black text-black' : 'font-bold text-gray-500'}`}>
                                                        {notif.title}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] text-gray-300 whitespace-nowrap font-black uppercase tracking-tighter">
                                                            {formatTimeAgo(notif.createdAt)}
                                                        </span>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                                                            className="p-1.5 rounded-full bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed font-medium">
                                                    {notif.message}
                                                </p>
                                                {notif.link && (
                                                    <Link
                                                        href={notif.link}
                                                        className="inline-flex items-center gap-1.5 mt-3 text-[9px] font-black uppercase tracking-[0.15em] text-indigo-500 hover:text-indigo-600 transition-colors"
                                                    >
                                                        Review Now <Check className="w-3 h-3" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-4 border-t border-gray-100 bg-white flex gap-3 shrink-0">
                                <button
                                    onClick={markAllAsRead}
                                    className="flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:text-black transition-all border border-gray-50"
                                >
                                    Mark as Read
                                </button>
                                <button
                                    onClick={clearAll}
                                    className="px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all border border-rose-100"
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
