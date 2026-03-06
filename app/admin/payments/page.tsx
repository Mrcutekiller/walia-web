'use client';

import { cn } from '@/lib/utils';
import {
    CreditCard,
    DollarSign,
    Download,
    TrendingUp,
    XCircle
} from 'lucide-react';

interface Transaction {
    id: string;
    user: string;
    plan: string;
    amount: string;
    status: string;
    date: string;
    method: string;
}

const mockTransactions: Transaction[] = [
    { id: 'TX-90210', user: 'Biruk Anteneh', plan: 'Pro Monthly', amount: '$9.99', status: 'Completed', date: '2024-03-05 14:20', method: 'Visa ****4242' },
    { id: 'TX-90211', user: 'Sarah Miller', plan: 'Pro Annual', amount: '$89.00', status: 'Completed', date: '2024-03-05 11:45', method: 'Mastercard ****8812' },
    { id: 'TX-90212', user: 'John Doe', plan: 'Pro Monthly', amount: '$9.99', status: 'Failed', date: '2024-03-04 09:15', method: 'Visa ****1111' },
    { id: 'TX-90213', user: 'Emma Wilson', plan: 'Pro Monthly', amount: '$9.99', status: 'Completed', date: '2024-03-04 08:30', method: 'PayPal' },
    { id: 'TX-90214', user: 'Kris Payer', plan: 'Pro Monthly', amount: '$9.99', status: 'Pending', date: '2024-03-03 16:40', method: 'Visa ****5566' },
];

export default function AdminPayments() {
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
                    { label: 'Net Revenue', value: '$45,200', change: '+12%', icon: DollarSign, color: 'text-walia-success' },
                    { label: 'Subscription Yield', value: '42%', change: '+4%', icon: TrendingUp, color: 'text-blue-500' },
                    { label: 'Avg Ticket', value: '$12.45', change: '-2%', icon: CreditCard, color: 'text-purple-500' },
                    { label: 'Failed Payments', value: '14', change: '+2', icon: XCircle, color: 'text-red-500' },
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
                            {mockTransactions.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-black text-white/60 group-hover:text-white transition-colors">#{tx.id}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-bold text-white group-hover:text-walia-success transition-colors">{tx.user}</span>
                                    </td>
                                    <td className="px-6 py-5 text-xs text-white/40">{tx.plan}</td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-black text-white">{tx.amount}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={cn(
                                            "inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                            tx.status === 'Completed' ? "bg-walia-success/10 text-walia-success" :
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination / Load more */}
            <div className="flex items-center justify-center pt-4">
                <button className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white/60">
                    Sync All Historical Subscriptions
                </button>
            </div>
        </div>
    );
}
