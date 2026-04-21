'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { formatTimeAgo } from '@/lib/utils';
import { collection, onSnapshot, orderBy, query, updateDoc, where, doc, deleteDoc } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bell, Check, CreditCard, Info, MessageSquare, ShieldAlert, Users, X, BellOff, Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string; dot: string }> = {
    message:   { icon: MessageSquare, color: 'text-blue-500',    bg: 'bg-blue-500/10',    dot: 'bg-blue-500' },
    invite:    { icon: Users,         color: 'text-violet-500',  bg: 'bg-violet-500/10',  dot: 'bg-violet-500' },
    community: { icon: Users,         color: 'text-indigo-500',  bg: 'bg-indigo-500/10',  dot: 'bg-indigo-500' },
    system:    { icon: ShieldAlert,   color: 'text-rose-500',    bg: 'bg-rose-500/10',    dot: 'bg-rose-500' },
    payment:   { icon: CreditCard,    color: 'text-emerald-500', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
    default:   { icon: Info,          color: 'text-gray-400',    bg: 'bg-gray-100',        dot: 'bg-gray-400' },
};

function groupNotifications(notifs: any[]) {
    const now = new Date();
    const today: any[] = [];
    const earlier: any[] = [];

    notifs.forEach(n => {
        const date = n.createdAt?.toDate ? n.createdAt.toDate() : new Date(n.createdAt?.seconds * 1000 || Date.now());
        const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
        if (diffHours < 24) today.push(n);
        else earlier.push(n);
    });

    return { today, earlier };
}

export default function NotificationPanel() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', user.id),
            orderBy('createdAt', 'desc')
        );
        const unsubscribe = onSnapshot(q, snapshot => {
            setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const unreadCount = notifications.filter(n => !n.read).length;
    const { today, earlier } = groupNotifications(notifications);

    const markAsRead = async (id: string) => {
        try { await updateDoc(doc(db, 'notifications', id), { read: true }); } catch { }
    };

    const deleteNotification = async (id: string) => {
        try { await deleteDoc(doc(db, 'notifications', id)); } catch { }
    };

    const NotifItem = ({ notif }: { notif: any }) => {
        const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.default;
        const Icon = cfg.icon;

        return (
            <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => { if (!notif.read) markAsRead(notif.id); }}
                className={`relative flex gap-3 p-4 rounded-2xl cursor-pointer transition-all group border ${
                    !notif.read
                        ? 'bg-[var(--color-surface-container-low)] border-[var(--color-outline-variant)]/20 shadow-sm'
                        : 'bg-transparent border-transparent hover:bg-[var(--color-surface-container-low)]'
                }`}
            >
                {/* Unread dot */}
                {!notif.read && (
                    <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-full ${cfg.dot}`} />
                )}

                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-tight truncate ${!notif.read ? 'font-black text-[var(--color-on-surface)]' : 'font-semibold text-[var(--color-on-surface-variant)]'}`}>
                            {notif.title}
                        </p>
                        <button
                            onClick={e => { e.stopPropagation(); deleteNotification(notif.id); }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-all"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-1 line-clamp-2 leading-relaxed">
                        {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-[var(--color-outline)] font-bold uppercase tracking-wider">
                            {formatTimeAgo(notif.createdAt)}
                        </span>
                        {notif.link && (
                            <Link
                                href={notif.link}
                                onClick={e => e.stopPropagation()}
                                className="text-[10px] font-black uppercase text-[var(--color-primary)] hover:underline"
                            >
                                View Details
                            </Link>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="relative z-50" ref={panelRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-xl text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] transition-all"
            >
                <Bell className="w-5.5 h-5.5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[var(--color-surface)]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-4 w-[380px] max-h-[500px] flex flex-col bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/20 rounded-[2rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[var(--color-outline-variant)]/10 flex items-center justify-between">
                            <div>
                                <h3 className="font-black text-lg text-[var(--color-on-surface)]">Notifications</h3>
                                <p className="text-xs text-[var(--color-outline)] font-bold">{unreadCount} unread today</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setNotifications([])}
                                    className="p-2 rounded-xl border border-[var(--color-outline-variant)]/20 text-[var(--color-outline)] hover:text-rose-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-xl border border-[var(--color-outline-variant)]/20 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="py-20 flex flex-col items-center gap-4 text-[var(--color-outline)] opacity-40">
                                    <BellOff className="w-12 h-12" />
                                    <p className="text-sm font-black uppercase tracking-widest">No notifications</p>
                                </div>
                            ) : (
                                <>
                                    {today.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-[var(--color-outline)] uppercase tracking-[0.2em] px-2">Today</p>
                                            {today.map(n => <NotifItem key={n.id} notif={n} />)}
                                        </div>
                                    )}
                                    {earlier.length > 0 && (
                                        <div className="space-y-2 mt-4">
                                            <p className="text-[10px] font-black text-[var(--color-outline)] uppercase tracking-[0.2em] px-2">Earlier</p>
                                            {earlier.map(n => <NotifItem key={n.id} notif={n} />)}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
