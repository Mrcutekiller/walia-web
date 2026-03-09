'use client';

import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Bell, Check, Clock, MessageSquare, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Mock Notifications Data
const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        title: 'New Community Reply',
        message: 'Sarah liked your answer on "Advanced Calculus Problem 4".',
        time: '2 mins ago',
        type: 'social',
        read: false,
    },
    {
        id: '2',
        title: 'System Update',
        message: 'Walia AI has been upgraded with vision capabilities! Try it out now.',
        time: '1 hour ago',
        type: 'system',
        read: false,
    },
    {
        id: '3',
        title: 'Study Reminder',
        message: 'Your Physics Final Exam prep session starts in 15 minutes.',
        time: '2 hours ago',
        type: 'reminder',
        read: true,
    },
    {
        id: '4',
        title: 'Achievement Unlocked',
        message: 'You have completed 10 Quizzes this week. Keep up the great work!',
        time: 'Yesterday',
        type: 'achievement',
        read: true,
    },
];

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const toggleReadStatus = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: !n.read } : n
        ));
    };

    const filteredNotifications = notifications.filter(n =>
        filter === 'unread' ? !n.read : true
    );

    const getIconForType = (type: string) => {
        switch (type) {
            case 'social': return <MessageSquare className="w-5 h-5" />;
            case 'system': return <Bell className="w-5 h-5" />;
            case 'reminder': return <Clock className="w-5 h-5" />;
            case 'achievement': return <Star className="w-5 h-5" />;
            default: return <Bell className="w-5 h-5" />;
        }
    };

    return (
        <div className="min-h-full bg-white dark:bg-[#0A0A18] text-black dark:text-white animate-in fade-in pb-20 transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#0A0A18]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-gray-800 relative">
                        <Bell className="w-6 h-6 text-black dark:text-white" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white dark:border-[#0A0A18] rounded-full"></span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-black dark:text-white">Notifications</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
                            You have {unreadCount} unread message{unreadCount !== 1 && 's'}.
                        </p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 text-sm font-bold shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 text-black dark:text-white transition-colors shrink-0"
                    >
                        <Check className="w-4 h-4" /> Mark all read
                    </button>
                )}
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-8">
                {/* Filters */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => setFilter('all')}
                        className={cn(
                            "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                            filter === 'all'
                                ? "bg-black dark:bg-white text-white dark:text-black shadow-md shadow-black/10"
                                : "bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white border border-gray-200 dark:border-gray-800"
                        )}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={cn(
                            "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                            filter === 'unread'
                                ? "bg-black dark:bg-white text-white dark:text-black shadow-md shadow-black/10"
                                : "bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white border border-gray-200 dark:border-gray-800"
                        )}
                    >
                        Unread
                    </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {filteredNotifications.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <Bell className="w-8 h-8 text-gray-300 dark:text-gray-700" />
                            </div>
                            <h3 className="text-lg font-black text-black dark:text-white mb-2">You're all caught up!</h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                There are no notifications to display in this view.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-sm">
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredNotifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => toggleReadStatus(notif.id)}
                                        className={cn(
                                            "p-6 flex gap-5 cursor-pointer transition-colors group relative",
                                            notif.read
                                                ? "bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10"
                                                : "bg-gray-50 dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20"
                                        )}
                                    >
                                        {!notif.read && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-black dark:bg-white" />
                                        )}

                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors border",
                                            notif.read
                                                ? "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600"
                                                : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-gray-700 text-black dark:text-white shadow-sm"
                                        )}>
                                            {getIconForType(notif.type)}
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex items-start justify-between gap-4 mb-1">
                                                <h4 className={cn(
                                                    "text-sm font-bold truncate",
                                                    notif.read ? "text-gray-600 dark:text-gray-400" : "text-black dark:text-white"
                                                )}>
                                                    {notif.title}
                                                </h4>
                                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap shrink-0">
                                                    {notif.time}
                                                </span>
                                            </div>
                                            <p className={cn(
                                                "text-sm font-medium line-clamp-2 leading-relaxed",
                                                notif.read ? "text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"
                                            )}>
                                                {notif.message}
                                            </p>
                                        </div>

                                        <button
                                            onClick={(e) => deleteNotification(notif.id, e)}
                                            className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 text-gray-400 dark:text-gray-500 transition-all self-center shrink-0"
                                            title="Delete notification"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
