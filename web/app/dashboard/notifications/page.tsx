'use client';

import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { cn } from '@/lib/utils';
import { BarChart3, Bell, Check, Clock, MessageSquare, ShieldAlert, Sparkles, Star, Users, X } from 'lucide-react';
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
        <div className="min-h-full bg-white text-black animate-in fade-in pb-20">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 relative">
                        <Bell className="w-6 h-6 text-black" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">Notifications</h1>
                        <p className="text-gray-500 text-sm font-medium mt-1">
                            You have {unreadCount} unread message{unreadCount !== 1 && 's'}.
                        </p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm font-bold shadow-sm hover:bg-gray-100 transition-colors shrink-0 text-black"
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
                                ? "bg-black text-white border-transparent shadow-md"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-black border-gray-200"
                        )}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={cn(
                            "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
                            filter === 'unread'
                                ? "bg-black text-white border-transparent shadow-md"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-black border-gray-200"
                        )}
                    >
                        Unread
                    </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Bell className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-black text-black mb-2">You're all caught up!</h3>
                            <p className="text-sm font-medium text-gray-500">
                                There are no notifications to display in this view.
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((notif) => (
                            <div
                                key={notif.id}
                                onClick={() => handleToggleReadStatus(notif.id, notif.read)}
                                className={cn(
                                    "p-5 flex gap-4 cursor-pointer transition-all group relative rounded-[1.5rem] border",
                                    notif.read
                                        ? "bg-white border-gray-100 hover:bg-gray-50"
                                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                )}
                            >
                                {/* Unread indicator */}
                                {!notif.read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-black rounded-l-[1.5rem]" />
                                )}

                                {/* Icon */}
                                <div className={cn(
                                    "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-colors",
                                    notif.read
                                        ? "bg-gray-50 border-gray-100 text-gray-400"
                                        : "bg-white border-gray-200 text-black shadow-sm"
                                )}>
                                    {getIconForType(notif.icon)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center pr-8">
                                    <div className="flex items-start justify-between gap-4 mb-1">
                                        <h4 className={cn(
                                            "text-sm font-bold truncate",
                                            notif.read ? "text-gray-600" : "text-black"
                                        )}>
                                            {notif.title}
                                        </h4>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap shrink-0">
                                            {notif.time}
                                        </span>
                                    </div>
                                    <p className={cn(
                                        "text-sm font-medium line-clamp-2 leading-relaxed",
                                        notif.read ? "text-gray-500" : "text-gray-700"
                                    )}>
                                        {notif.description}
                                    </p>
                                </div>

                                {/* X Close/Delete button — always visible, top-right corner */}
                                <button
                                    onClick={(e) => handleDelete(notif.id, e)}
                                    className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all"
                                    title="Dismiss notification"
                                    aria-label="Dismiss notification"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
