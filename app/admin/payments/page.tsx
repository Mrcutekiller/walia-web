'use client';

import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { Check, X, ExternalLink, Clock, User, CreditCard, Mail, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaymentRequest {
    id: string;
    userId: string;
    userEmail: string;
    userName: string;
    plan: string;
    amount: number;
    currency: string;
    method: string;
    proofURL: string;
    status: 'processing' | 'approved' | 'rejected';
    createdAt: any;
}

export default function AdminPayments() {
    const [requests, setRequests] = useState<PaymentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'processing' | 'approved' | 'rejected'>('processing');

    useEffect(() => {
        const q = query(collection(db, 'payment_requests'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setRequests(snap.docs.map(d => ({
                id: d.id,
                ...d.data()
            } as PaymentRequest)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleAction = async (request: PaymentRequest, status: 'approved' | 'rejected') => {
        try {
            // 1. Update request status
            await updateDoc(doc(db, 'payment_requests', request.id), { status });

            // 2. If approved, update user plan
            if (status === 'approved') {
                await updateDoc(doc(db, 'users', request.userId), { 
                    plan: 'pro',
                    proType: request.plan, // monthly or yearly
                    planActivatedAt: serverTimestamp()
                });
            }

            // 3. Send Notification to User
            const message = status === 'approved' 
                ? `Your payment has been approved! You are now on the Pro plan. Enjoy unlimited access to all Walia AI features.`
                : `Your payment was rejected. Please ensure your proof of payment is clear and matches the requested amount.`;
            
            await addDoc(collection(db, 'notifications'), {
                userId: request.userId,
                title: status === 'approved' ? 'Payment Approved ✅' : 'Payment Rejected ❌',
                message,
                type: status === 'approved' ? 'system' : 'message',
                read: false,
                createdAt: serverTimestamp()
            });

            alert(`Request ${status} successfully.`);
        } catch (error) {
            console.error(`Error processing ${status}:`, error);
            alert(`Failed to ${status} request.`);
        }
    };

    const deleteRequest = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this payment record?')) return;
        try {
            await deleteDoc(doc(db, 'payment_requests', id));
        } catch (error) {
            console.error('Error deleting request:', error);
        }
    };

    const filteredRequests = requests.filter(r => filter === 'all' ? true : r.status === filter);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Payment Verification</h1>
                    <p className="text-white/40 text-sm mt-1">Review and approve manual payment proofs from users.</p>
                </div>

                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
                    {(['processing', 'approved', 'rejected', 'all'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filter === f ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 bg-white/5 border border-dashed border-white/10 rounded-[40px]">
                    <Clock className="w-12 h-12 text-white/10 mb-4" />
                    <p className="text-white/40 font-bold">No {filter !== 'all' ? filter : ''} requests found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filteredRequests.map((req) => (
                        <div key={req.id} className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden flex flex-col">
                            <div className="p-8 flex flex-col md:flex-row gap-8">
                                {/* Details */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            req.status === 'processing' ? 'bg-amber-500/10 text-amber-500' :
                                            req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                            'bg-rose-500/10 text-rose-500'
                                        }`}>
                                            {req.status}
                                        </div>
                                        <button onClick={() => deleteRequest(req.id)} className="p-2 text-white/20 hover:text-rose-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                                <User className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">{req.userName}</p>
                                                <div className="flex items-center gap-1.5 text-white/40">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="text-[11px] font-medium">{req.userEmail}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Plan</p>
                                                <p className="text-sm font-bold text-white capitalize">{req.plan}</p>
                                            </div>
                                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Amount</p>
                                                <p className="text-sm font-bold text-white">{req.amount} {req.currency}</p>
                                            </div>
                                        </div>

                                        <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Method</p>
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-3 h-3 text-indigo-400" />
                                                <span className="text-sm font-bold text-white uppercase">{req.method}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Proof Thumbnail */}
                                <div className="w-full md:w-48 shrink-0">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">Proof of Payment</p>
                                    <a href={req.proofURL} target="_blank" rel="noopener noreferrer" className="block relative aspect-square rounded-2xl overflow-hidden group">
                                        <img src={req.proofURL} alt="Payment Proof" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <ExternalLink className="w-6 h-6 text-white" />
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {req.status === 'processing' && (
                                <div className="p-4 bg-white/5 border-t border-white/10 flex gap-4">
                                    <button 
                                        onClick={() => handleAction(req, 'approved')}
                                        className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-black text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-4 h-4" /> Approve
                                    </button>
                                    <button 
                                        onClick={() => handleAction(req, 'rejected')}
                                        className="flex-1 py-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 font-black text-xs hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <X className="w-4 h-4" /> Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
