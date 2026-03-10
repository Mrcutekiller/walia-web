'use client';

import { Check, Crown, Gift, Search, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';

type ApprovalRequest = {
    id: string;
    userName: string;
    avatar: string;
    type: 'upgrade' | 'birthday';
    plan?: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
};

const initialRequests: ApprovalRequest[] = [
    { id: '1', userName: 'Lianna Tudakova', avatar: 'L', type: 'upgrade', plan: 'Walia Pro', status: 'pending', date: 'Just now' },
    { id: '2', userName: 'Michael Chang', avatar: 'M', type: 'birthday', status: 'pending', date: '5 mins ago' },
    { id: '3', userName: 'Sarah Jenkins', avatar: 'S', type: 'upgrade', plan: 'Elite Tier', status: 'pending', date: '1 hour ago' },
    { id: '4', userName: 'David O.', avatar: 'D', type: 'birthday', status: 'approved', date: 'Yesterday' },
];

export default function AdminDashboardPage() {
    const [requests, setRequests] = useState<ApprovalRequest[]>(initialRequests);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAction = (id: string, action: 'approved' | 'rejected') => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
    };

    const filteredRequests = requests.filter(r => r.userName.toLowerCase().includes(searchTerm.toLowerCase()));
    const pendingCount = requests.filter(r => r.status === 'pending').length;

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0A101D] text-black dark:text-white p-6 md:p-10 animate-in fade-in duration-500">

            <div className="max-w-5xl mx-auto">

                {/* Header Secton */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Admin Console</h1>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Manage user upgrades, rewards, and platform moderation.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:placeholder-gray-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-200/20 dark:shadow-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest mb-2 relative z-10">Pending Action</h3>
                        <p className="text-4xl font-black relative z-10">{pendingCount}</p>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-200/20 dark:shadow-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest mb-2 relative z-10">Pro Upgrades</h3>
                        <p className="text-4xl font-black relative z-10">142</p>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-indigo-600 border border-indigo-500 shadow-xl shadow-indigo-600/20 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                        <h3 className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2 relative z-10">Total Revenue</h3>
                        <p className="text-4xl font-black relative z-10">$12.4k</p>
                    </div>
                </div>

                {/* Glassmorphism List View */}
                <h3 className="text-lg font-bold mb-6">Pending Approvals</h3>

                <div className="w-full bg-white/50 dark:bg-white/5 backdrop-blur-2xl rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col divide-y divide-gray-100 dark:divide-white/5">

                    {filteredRequests.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 dark:text-gray-400 font-medium">
                            No requests found.
                        </div>
                    ) : (
                        filteredRequests.map((req) => (
                            <div key={req.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/80 dark:hover:bg-white/[0.02] transition-colors relative group">

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black shrink-0 shadow-md">
                                        {req.avatar}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold">{req.userName}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            {req.type === 'upgrade' ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-400/20">
                                                    <Crown className="w-3 h-3" /> {req.plan}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-400/10 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-400/20">
                                                    <Gift className="w-3 h-3" /> Birthday Reward
                                                </span>
                                            )}
                                            <span className="text-[10px] text-gray-400 font-medium">• {req.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {req.status === 'pending' ? (
                                        <>
                                            <button
                                                onClick={() => handleAction(req.id, 'rejected')}
                                                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                                title="Reject"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleAction(req.id, 'approved')}
                                                className="px-5 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg transition-all"
                                            >
                                                <Check className="w-4 h-4" /> Verify
                                            </button>
                                        </>
                                    ) : (
                                        <span className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl ${req.status === 'approved' ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-500/10' : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10'}`}>
                                            {req.status}
                                        </span>
                                    )}
                                </div>

                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
