'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { Check, X, Loader2, CreditCard, ChevronDown, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import UserBadge from '@/components/UserBadge';

interface Payment {
    id: string;
    userId: string;
    amount: number;
    currency: 'ETB' | 'USD';
    status: 'pending' | 'approved' | 'rejected';
    receiptUrl?: string;
    createdAt: any;
    durationDays?: number; // what they requested or what admin sets
}

export default function AdminPayments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDuration, setSelectedDuration] = useState<{ [id: string]: number }>({});
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Payment));
            setPayments(data);
            
            // Set default durations map
            const durs: any = {};
            data.forEach(p => durs[p.id] = p.durationDays || 30);
            setSelectedDuration(durs);

            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleAction = async (paymentId: string, action: 'approve' | 'reject', userId: string, authAmount: number, currency: string) => {
        if (!confirm(`Are you sure you want to ${action} this payment?`)) return;
        setProcessing(paymentId);
        
        try {
            const status = action === 'approve' ? 'approved' : 'rejected';
            await updateDoc(doc(db, 'payments', paymentId), { status });
            
            if (status === 'approved') {
                const days = selectedDuration[paymentId] || 30;
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + days);

                await updateDoc(doc(db, 'users', userId), {
                    plan: 'pro',
                    planExpiresAt: expiryDate.toISOString(),
                });

                // Update Stats
                const statsRef = doc(db, 'platform_stats', 'main');
                await updateDoc(statsRef, {
                    revenueEtb: currency === 'ETB' ? increment(authAmount) : increment(0),
                    revenueUsd: currency === 'USD' ? increment(authAmount) : increment(0),
                }).catch(() => {}); // catch missing stats doc
            }
        } catch (err) {
            console.error(err);
            alert(`Failed to ${action} payment.`);
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return <div className="flex-1 flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">Payments</h1>
                <p className="text-gray-500 text-sm font-bold mt-1">Review pending receipts and manage subscriptions.</p>
            </div>

            <div className="bg-white dark:bg-[#162032] rounded-[2rem] border border-gray-200 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">User</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Receipt</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Duration (Days)</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-bold">No payments found.</td>
                                </tr>
                            )}
                            {payments.map(p => {
                                const isPending = p.status === 'pending';
                                return (
                                    <tr key={p.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            {/* Assuming UserBadge fetches user. If not, fallback text */}
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 hidden md:block overflow-hidden relative">
                                                <UserBadge uid={p.userId} size="sm" hideName className="absolute inset-0" />
                                            </div>
                                            <div className="text-xs font-bold text-black dark:text-gray-300 xl:w-48 truncate">
                                                ID: {p.userId.substring(0, 8)}...
                                                <p className="font-medium text-gray-400 text-[10px] mt-0.5">
                                                    {p.createdAt?.toDate ? formatDistanceToNow(p.createdAt.toDate()) + ' ago' : 'Recently'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-black text-black dark:text-white">
                                                <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", p.currency === 'USD' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-green-500/10 text-green-500')}>
                                                    <DollarSign className="w-3 h-3" />
                                                </div>
                                                {p.amount.toLocaleString()} <span className="text-[10px] text-gray-400">{p.currency}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg",
                                                p.status === 'approved' ? "bg-green-500/10 text-green-500" :
                                                p.status === 'rejected' ? "bg-red-500/10 text-red-500" :
                                                "bg-amber-500/10 text-amber-500"
                                            )}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {p.receiptUrl ? (
                                                <a href={p.receiptUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline font-bold text-xs flex gap-1 items-center">
                                                    View Receipt
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 font-bold text-xs">No Receipt</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative inline-block w-24">
                                                <select 
                                                    disabled={!isPending}
                                                    value={selectedDuration[p.id]}
                                                    onChange={e => setSelectedDuration(prev => ({...prev, [p.id]: parseInt(e.target.value)}))}
                                                    className="w-full bg-gray-50 dark:bg-black/20 text-black dark:text-white font-bold text-xs py-2 px-3 rounded-xl border border-gray-200 dark:border-white/10 appearance-none outline-none disabled:opacity-50"
                                                >
                                                    <option value={30}>1 Month</option>
                                                    <option value={90}>3 Months</option>
                                                    <option value={180}>6 Months</option>
                                                    <option value={365}>1 Year</option>
                                                    <option value={3650}>Lifetime</option>
                                                </select>
                                                <ChevronDown className="w-3 h-3 absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {isPending ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleAction(p.id, 'reject', p.userId, p.amount, p.currency)}
                                                        disabled={processing === p.id}
                                                        className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(p.id, 'approve', p.userId, p.amount, p.currency)}
                                                        disabled={processing === p.id}
                                                        className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors disabled:opacity-50"
                                                    >
                                                        {processing === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 dark:text-gray-600 font-black text-[10px] uppercase tracking-widest">Resolved</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
