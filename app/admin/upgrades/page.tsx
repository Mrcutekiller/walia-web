'use client';

import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { Check, Clock, Copy, Download } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface UpgradeRequest {
    id: string;
    userId: string;
    name: string;
    username: string;
    email: string;
    screenshotURL: string;
    status: string;
    planRequest: string;
    createdAt: any;
}

export default function AdminUpgrades() {
    const [requests, setRequests] = useState<UpgradeRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [selectedDurations, setSelectedDurations] = useState<Record<string, number>>({});

    useEffect(() => {
        const q = query(collection(db, 'upgrades'), where('status', '==', 'Pending'), orderBy('createdAt', 'asc'));
        const unsub = onSnapshot(q, (snap) => {
            setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() } as UpgradeRequest)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleApprove = async (req: UpgradeRequest) => {
        const months = selectedDurations[req.id] || 1; // Default to 1 month
        if (!confirm(`Approve this upgrade for ${months} month(s)?`)) return;
        setProcessingId(req.id);

        try {
            // Calculate Dates
            const now = new Date();
            const expiration = new Date();
            expiration.setMonth(expiration.getMonth() + months);

            // Update request status
            await updateDoc(doc(db, 'upgrades', req.id), { status: 'Approved', approvedDuration: months });

            // Update user to PRO
            await updateDoc(doc(db, 'users', req.userId), {
                plan: 'Pro',
                proSince: now,
                proUntil: expiration,
            });

            // Optional: send notification
            const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
            await addDoc(collection(db, 'notifications'), {
                userId: req.userId,
                title: 'Upgrade Approved 🎉',
                message: 'Your payment was verified. You are now a Pro member!',
                type: 'system',
                read: false,
                createdAt: serverTimestamp(),
            });

        } catch (error) {
            console.error('Error approving request:', error);
            alert('Error approving request');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (req: UpgradeRequest) => {
        if (!confirm('Reject this payment request?')) return;
        setProcessingId(req.id);

        try {
            await updateDoc(doc(db, 'upgrades', req.id), { status: 'Rejected' });

            // Notify user
            const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
            await addDoc(collection(db, 'notifications'), {
                userId: req.userId,
                title: 'Upgrade Rejected',
                message: 'We could not verify your payment proof. Please try again or contact support.',
                type: 'system',
                read: false,
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Error rejecting request');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">Pending Upgrades</h1>
                    <p className="text-white/30 text-sm font-medium">Review and approve manual payment receipts.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-white/20">Loading pending requests...</div>
                ) : requests.length === 0 ? (
                    <div className="col-span-full py-20 text-center flex flex-col items-center">
                        <Check className="w-16 h-16 text-white/5 mb-4" />
                        <h3 className="text-xl font-bold text-white/40">All caught up!</h3>
                        <p className="text-white/20 mt-1">No pending upgrade requests at the moment.</p>
                    </div>
                ) : (
                    requests.map(req => (
                        <div key={req.id} className="p-6 rounded-[32px] bg-[#141415] border border-white/5 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1 min-w-0 flex-1">
                                    <h3 className="font-bold text-white text-lg truncate">{req.name}</h3>
                                    <p className="text-sm font-black text-indigo-400 uppercase tracking-widest">{req.planRequest} Plan Request</p>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/10 text-orange-500 font-bold text-[10px] uppercase tracking-wider">
                                    <Clock className="w-3 h-3" /> Pending
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Email</p>
                                    <p className="text-sm font-medium text-white/80 truncate flex items-center gap-2">
                                        {req.email}
                                        <Copy className="w-3 h-3 text-white/20 cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText(req.email)} />
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Username</p>
                                    <p className="text-sm font-medium text-white/80 truncate">@{req.username}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3">Payment Proof</p>
                                <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-black/50 border border-white/10 group">
                                    <Image src={req.screenshotURL} alt="Proof" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <a href={req.screenshotURL} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20">
                                            <Download className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => handleReject(req)}
                                    disabled={processingId !== null}
                                    className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                >
                                    {processingId === req.id ? '...' : 'Reject'}
                                </button>

                                <div className="flex-[2] flex gap-2">
                                    <select
                                        className="bg-[#0A0A0B] border border-white/10 text-white text-xs rounded-xl px-3 outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                                        value={selectedDurations[req.id] || 1}
                                        onChange={(e) => setSelectedDurations({ ...selectedDurations, [req.id]: parseInt(e.target.value) })}
                                    >
                                        <option value={1}>1 Month</option>
                                        <option value={3}>3 Months</option>
                                        <option value={6}>6 Months</option>
                                        <option value={12}>1 Year</option>
                                    </select>
                                    <button
                                        onClick={() => handleApprove(req)}
                                        disabled={processingId !== null}
                                        className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-600/20"
                                    >
                                        <Check className="w-4 h-4" /> {processingId === req.id ? 'Processing...' : 'Approve'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
