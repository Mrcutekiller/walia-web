'use client';

import { cn } from '@/lib/utils';
import {
    ArrowUpRight,
    Clock,
    ExternalLink,
    Mail,
    MoreVertical,
    Search,
    Shield,
    Zap
} from 'lucide-react';
import { useState } from 'react';

const mockUsers = [
    { id: '1', name: 'Biruk Anteneh', email: 'biruk@example.com', plan: 'Pro', status: 'Active', joined: '2024-02-15', avatar: 'B' },
    { id: '2', name: 'Antonio Samuel', email: 'antonio@walia.com', plan: 'Admin', status: 'Active', joined: '2023-11-20', avatar: 'A' },
    { id: '3', name: 'Kris Payer', email: 'kris.payer@gmail.com', plan: 'Free', status: 'Pending', joined: '2024-03-01', avatar: 'K' },
    { id: '4', name: 'Sarah Miller', email: 'sarah.m@outlook.com', plan: 'Pro', status: 'Active', joined: '2024-01-10', avatar: 'S' },
    { id: '5', name: 'John Doe', email: 'john@doe.net', plan: 'Free', status: 'Banned', joined: '2023-12-05', avatar: 'J' },
    { id: '6', name: 'Emma Wilson', email: 'emma@wilson.io', plan: 'Pro', status: 'Active', joined: '2024-02-28', avatar: 'E' },
];

export default function AdminUsers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    const filteredUsers = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">Identity & Access</h1>
                    <p className="text-white/30 text-sm font-medium">Manage user profiles, permissions, and subscriptions.</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-walia-success transition-colors" />
                        <input
                            type="text"
                            placeholder="Find user by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:bg-white/10 focus:border-walia-success/20 transition-all w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            {/* User List Table */}
            <div className="rounded-[32px] bg-[#141415] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">User Identity</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Plan Level</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Registry Date</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs group-hover:bg-walia-success group-hover:text-black transition-all">
                                                {user.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-walia-success transition-colors">{user.name}</p>
                                                <div className="flex items-center space-x-2 text-[10px] text-white/20">
                                                    <Mail className="w-3 h-3" />
                                                    <span>{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={cn(
                                            "inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                            user.plan === 'Pro' ? "bg-walia-success/10 text-walia-success border border-walia-success/20" :
                                                user.plan === 'Admin' ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" :
                                                    "bg-white/5 text-white/40 border border-white/10"
                                        )}>
                                            {user.plan === 'Pro' && <Zap className="w-3 h-3" />}
                                            {user.plan === 'Admin' && <Shield className="w-3 h-3" />}
                                            <span>{user.plan}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full shadow-[0_0_8px]",
                                                user.status === 'Active' ? "bg-walia-success shadow-walia-success/50" :
                                                    user.status === 'Banned' ? "bg-red-500 shadow-red-500/50" :
                                                        "bg-orange-500 shadow-orange-500/50"
                                            )} />
                                            <span className="text-xs font-semibold text-white/60">{user.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-white/30">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium">{user.joined}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setSelectedUser(user.id)}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all shadow-sm active:scale-95"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all shadow-sm active:scale-95">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Analytics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Growth Index</p>
                        <h4 className="text-2xl font-black text-white">+24.5%</h4>
                    </div>
                    <div className="p-3 rounded-2xl bg-walia-success/10 text-walia-success shadow-inner shadow-walia-success/5">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Conversion</p>
                        <h4 className="text-2xl font-black text-white">12.8%</h4>
                    </div>
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 shadow-inner shadow-blue-500/5">
                        <ArrowUpRight className="w-6 h-6" />
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Avg Session</p>
                        <h4 className="text-2xl font-black text-white">18m 24s</h4>
                    </div>
                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 shadow-inner shadow-purple-500/5">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex items-center justify-between p-8 rounded-[32px] bg-gradient-to-r from-walia-success/10 via-emerald-500/5 to-transparent border border-walia-success/10">
                <div className="flex items-center space-x-6">
                    <div className="p-4 rounded-2xl bg-walia-success shadow-lg shadow-walia-success/20">
                        <Shield className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white tracking-tight">System Integrity Check</h4>
                        <p className="text-xs text-white/40 font-medium">Verify all user permissions and sync security protocols.</p>
                    </div>
                </div>
                <button className="px-6 py-3 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                    Secure All Nodes
                </button>
            </div>
        </div>
    );
}
