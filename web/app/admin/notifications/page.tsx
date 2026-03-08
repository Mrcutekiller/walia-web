'use client';

import { db } from '@/lib/firebase';
import { cn, formatTimeAgo } from '@/lib/utils';
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Activity, Bell, History, Send, Target, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NotificationHistory {
    id: string;
    title: string;
    message: string;
    target: string;
    createdAt: any;
}

export default function AdminNotifications() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState('all');
    const [customTarget, setCustomTarget] = useState('');
    const [sending, setSending] = useState(false);
    const [history, setHistory] = useState<NotificationHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(20));
        const unsub = onSnapshot(q, (snap) => {
            setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() } as NotificationHistory)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) return;
        if (target === 'custom' && !customTarget.trim()) return;
        if (!confirm('Are you sure you want to broadcast this notification?')) return;

        setSending(true);
        try {
            await addDoc(collection(db, 'notifications'), {
                title: title.trim(),
                message: message.trim(),
                target: target === 'custom' ? customTarget.trim() : target,
                type: 'system',
                createdAt: serverTimestamp(),
            });

            setTitle('');
            setMessage('');
            setTarget('all');
            setCustomTarget('');
            alert('Notification sent successfully!');
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Failed to send notification.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up py-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">Broadcast Alerts</h1>
                    <p className="text-white/30 text-sm font-medium">Send platform-wide or targeted notifications to users.</p>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Global Messaging</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Compose Form */}
                <div className="p-8 rounded-[32px] bg-[#141415] border border-white/5 space-y-6">
                    <h3 className="text-sm font-bold text-white tracking-tight uppercase tracking-widest text-white/40 mb-6">Compose Message</h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 pl-1">Alert Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Scheduled Maintenance"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 pl-1">Message Body</label>
                            <textarea
                                placeholder="What do you want to tell the users?"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 pl-1">Target Audience</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                    { id: 'all', label: 'All Users', icon: Users },
                                    { id: 'pro', label: 'Pro Only', icon: Activity },
                                    { id: 'free', label: 'Free Only', icon: Bell },
                                    { id: 'custom', label: 'Custom ID', icon: Target },
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTarget(t.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2",
                                            target === t.id
                                                ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-400"
                                                : "bg-black/20 border-white/5 text-white/40 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <t.icon className="w-5 h-5" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {target === 'custom' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 pl-1">User ID</label>
                                <input
                                    type="text"
                                    placeholder="Enter targeted user ID..."
                                    value={customTarget}
                                    onChange={(e) => setCustomTarget(e.target.value)}
                                    className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
                                />
                            </motion.div>
                        )}
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={sending || !title.trim() || !message.trim() || (target === 'custom' && !customTarget.trim())}
                        className="w-full py-4 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6 shadow-lg shadow-indigo-600/20"
                    >
                        {sending ? 'Broadcasting...' : 'Broadcast Alert'}
                        <Send className="w-4 h-4" />
                    </button>
                </div>

                {/* History */}
                <div className="p-8 rounded-[32px] bg-[#141415] border border-white/5 flex flex-col h-[600px]">
                    <div className="flex items-center space-x-2 mb-6 shrink-0">
                        <History className="w-4 h-4 text-white/40" />
                        <h3 className="text-sm font-bold text-white tracking-tight uppercase tracking-widest text-white/40">Broadcast History</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="h-full flex items-center justify-center text-[10px] font-black uppercase text-white/20 tracking-widest">Loading...</div>
                        ) : history.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-[10px] font-black uppercase text-white/20 tracking-widest">No previous broadcasts</div>
                        ) : (
                            history.map((alert) => (
                                <div key={alert.id} className="p-4 rounded-2xl bg-black/20 border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30 whitespace-nowrap ml-2">
                                            {alert.createdAt?.toDate() ? formatTimeAgo(alert.createdAt) : 'Just now'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/60 mb-3 line-clamp-2">{alert.message}</p>
                                    <div className="flex">
                                        <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest">
                                            Target: {alert.target}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
