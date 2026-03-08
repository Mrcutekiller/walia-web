'use client';

import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import {
    CreditCard,
    DollarSign,
    Download,
    Search,
    TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Transaction {
    id: string;
    user: string;
    plan: string;
    amount: string;
    status: string;
    date: string;
    method: string;
}

export default function AdminPayments() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'payments'), orderBy('date', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setTransactions(snap.docs.map(d => ({
                id: d.id,
                ...d.data(),
                date: d.data().date || (d.data().createdAt?.toDate ? d.data().createdAt.toDate().toLocaleString() : 'N/A')
            } as Transaction)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const filteredTransactions = transactions.filter(tx =>
        tx.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">Financial Records</h1>
                    <p className="text-white/30 text-sm font-medium">Verify transaction logs and monitor subscription revenue.</p>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Net Revenue', value: `$${transactions.filter(t => t.status === 'Completed').reduce((acc, t) => acc + (parseFloat(t.amount.replace('$', '')) || 0), 0).toLocaleString()}`, change: '+12%', icon: DollarSign, color: 'text-walia-success' },
                    { label: 'Active Subs', value: transactions.filter(t => t.status === 'Completed').length, change: '+4%', icon: TrendingUp, color: 'text-blue-500' },
                    { label: 'Avg Ticket', value: '$9.99', change: '-2%', icon: CreditCard, color: 'text-purple-500' },
                    { label: 'Transactions', value: transactions.length, change: '+2', icon: CreditCard, color: 'text-orange-500' },
                ].map((stat, i) => (
                    <div key={stat.label} className="p-6 rounded-[28px] bg-[#141415] border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className={cn("w-5 h-5", stat.color)} />
                            <span className="text-[10px] font-black text-white/20">{stat.change}</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 truncate">{stat.label}</p>
                        <h4 className="text-2xl font-black text-white mt-1">{stat.value}</h4>
                    </div>
                ))}
            </div>

            {/* Transaction Table */}
            <div className="rounded-[32px] bg-[#141415] border border-white/5 overflow-hidden">
                <div className="p-6">
                    <div className="relative">
                        <Search className="w-4 h-4 text-white/20 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by User or Transaction ID..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-walia-primary/30 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">ID / Hash</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">User</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Tier</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Value</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Date</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Method</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-white/20 text-xs font-bold uppercase tracking-widest">Loading records...</td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-white/20 text-xs font-bold uppercase tracking-widest">No transactions found</td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-black text-white/60 group-hover:text-white transition-colors">#{tx.id.slice(-8)}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-white group-hover:text-walia-primary transition-colors">{tx.user}</span>
                                        </td>
                                        <td className="px-6 py-5 text-xs text-white/40">{tx.plan}</td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-white">{tx.amount}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={cn(
                                                "inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                                tx.status === 'Completed' || tx.status === 'succeeded' ? "bg-walia-success/10 text-walia-success" :
                                                    tx.status === 'Failed' ? "bg-red-500/10 text-red-500" :
                                                        "bg-orange-500/10 text-orange-500"
                                            )}>
                                                {tx.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-[10px] text-white/20 whitespace-nowrap">{tx.date}</td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="text-[10px] font-bold text-white/30 group-hover:text-white/60 transition-colors uppercase tracking-tighter">{tx.method}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-center pt-4">
                <button className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white/60">
                    Sync All Historical Subscriptions
                </button>
            </div>
        </div>
    );
}
