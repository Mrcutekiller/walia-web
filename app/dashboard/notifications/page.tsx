'use client';

import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { cn } from '@/lib/utils';
import { BarChart3, Bell, Check, Clock, MessageSquare, ShieldAlert, Sparkles, Star, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

export default function NotificationsPage() {
    const { user } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const handleToggleReadStatus = (id: string, currentlyRead: boolean, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!currentlyRead) {
            markAsRead(id);
        }
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        deleteNotification(id);
    };

    const filteredNotifications = notifications.filter(n =>
        filter === 'unread' ? !n.read : true
    );

    const getIconForType = (iconString: string) => {
        switch (iconString) {
            case 'MessageSquare': return <MessageSquare className="w-5 h-5" />;
            case 'Bell': return <Bell className="w-5 h-5" />;
            case 'Clock': return <Clock className="w-5 h-5" />;
            case 'Star': return <Star className="w-5 h-5" />;
            case 'Sparkles': return <Sparkles className="w-5 h-5" />;
            case 'Users': return <Users className="w-5 h-5" />;
            case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
            case 'BarChart3': return <BarChart3 className="w-5 h-5" />;
            default: return <Bell className="w-5 h-5" />;
        }
    };

    return (
        <div className="min-h-full bg-white dark:bg-[#0a0a0a] text-black dark:text-white animate-in fade-in pb-20">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-white/10 relative">
                        <Bell className="w-6 h-6 text-black dark:text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">Notifications</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
                            You have {unreadCount} unread message{unreadCount !== 1 && 's'}.
                        </p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-sm font-bold shadow-sm hover:bg-gray-100 dark:hover:bg-white/20 transition-colors shrink-0 text-black dark:text-white"
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
                            "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
                            filter === 'all'
                                ? "bg-black text-white dark:bg-white dark:text-black border-transparent shadow-md"
                                : "bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white border-gray-200 dark:border-white/10"
                        )}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={cn(
                            "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
                            filter === 'unread'
                                ? "bg-black text-white dark:bg-white dark:text-black border-transparent shadow-md"
                                : "bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white border-gray-200 dark:border-white/10"
                        )}
                    >
                        Unread
                    </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {filteredNotifications.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                            </div>
                            <h3 className="text-lg font-black text-black dark:text-white mb-2">You're all caught up!</h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                There are no notifications to display in this view.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#162032] border border-gray-200 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-sm">
                            <div className="divide-y divide-gray-100 dark:divide-white/5">
                                {filteredNotifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleToggleReadStatus(notif.id, notif.read)}
                                        className={cn(
                                            "p-6 flex gap-5 cursor-pointer transition-colors group relative",
                                            notif.read ? "bg-white dark:bg-[#162032] hover:bg-gray-50 dark:hover:bg-white/5" : "bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10"
                                        )}
                                    >
                                        {!notif.read && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-black dark:bg-[#4ade80]" />
                                        )}

                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors border",
                                            notif.read
                                                ? "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-500"
                                                : "bg-white dark:bg-[#162032] border-gray-200 dark:border-white/20 text-black dark:text-[#4ade80] shadow-sm"
                                        )}>
                                            {getIconForType(notif.icon)}
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
                                                {notif.description}
                                            </p>
                                        </div>

                                        <button
                                            onClick={(e) => handleDelete(notif.id, e)}
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
