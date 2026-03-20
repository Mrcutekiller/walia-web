'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send, BellPlus, Loader2 } from 'lucide-react';

export default function AdminNotifications() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetType, setTargetType] = useState<'all' | 'specific'>('all');
    const [targetUserId, setTargetUserId] = useState('');
    
    const [sending, setSending] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg('');
        if (!title.trim() || !message.trim()) return;
        if (targetType === 'specific' && !targetUserId.trim()) return;

        setSending(true);
        try {
            await addDoc(collection(db, 'notifications'), {
                userId: targetType === 'all' ? 'all' : targetUserId.trim(),
                title: title.trim(),
                message: message.trim(),
                sender: 'admin',
                createdAt: serverTimestamp(),
                read: false,
            });
            setTitle('');
            setMessage('');
            setTargetUserId('');
            setSuccessMsg('Notification broadcasted successfully!');
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (error) {
            console.error(error);
            alert("Failed to send notification");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">Broadcast Center</h1>
                <p className="text-gray-500 text-sm font-bold mt-1">Send in-app notifications and alerts.</p>
            </div>

            <div className="bg-white dark:bg-[#162032] p-8 rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-xl shadow-black/5 dark:shadow-none">
                <form onSubmit={handleSend} className="space-y-6">
                    {successMsg && (
                        <div className="bg-green-500/10 text-green-500 p-4 rounded-2xl text-sm font-bold border border-green-500/20 text-center">
                            {successMsg}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Target Audience</label>
                        <div className="flex gap-4">
                            <label className="flex-1 flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <input 
                                    type="radio" 
                                    checked={targetType === 'all'} 
                                    onChange={() => setTargetType('all')}
                                    className="w-4 h-4 accent-black dark:accent-white"
                                />
                                <span className="font-bold text-sm text-black dark:text-white">All Users</span>
                            </label>
                            <label className="flex-1 flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <input 
                                    type="radio" 
                                    checked={targetType === 'specific'} 
                                    onChange={() => setTargetType('specific')}
                                    className="w-4 h-4 accent-black dark:accent-white"
                                />
                                <span className="font-bold text-sm text-black dark:text-white">Specific User</span>
                            </label>
                        </div>
                    </div>

                    {targetType === 'specific' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">User ID</label>
                            <input 
                                type="text"
                                placeholder="Paste user ID here..."
                                value={targetUserId}
                                onChange={e => setTargetUserId(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-black/20 text-black dark:text-white px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 outline-none focus:border-black dark:focus:border-white font-bold text-sm"
                                required
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Title</label>
                        <input 
                            type="text"
                            placeholder="e.g. New Feature Released!"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-black/20 text-black dark:text-white px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 outline-none focus:border-black dark:focus:border-white font-bold text-sm"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Message</label>
                        <textarea 
                            placeholder="Write your announcement..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={4}
                            className="w-full bg-gray-50 dark:bg-black/20 text-black dark:text-white px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 outline-none focus:border-black dark:focus:border-white font-bold text-sm resize-none custom-scrollbar"
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={sending || !title || !message || (targetType === 'specific' && !targetUserId)}
                        className="w-full bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-black/10 dark:shadow-white/10"
                    >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <Send className="w-5 h-5" />
                                Send Broadcast
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
