'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, limit, getDocs, doc, updateDoc, increment, orderBy, where } from 'firebase/firestore';
import { Search, ShieldAlert, Star, UserMinus, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import UserBadge from '@/components/UserBadge';

interface AppUser {
    id: string;
    name: string;
    email: string;
    plan: string;
    tokensLeft?: number;
    isAdmin?: boolean;
    isSuspended?: boolean;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchUsers = async (search = '') => {
        setLoading(true);
        try {
            let q = query(collection(db, 'users'), limit(50));
            // Basic client-side search approximation (Firestore text search is limited without Algolia/Elastic)
            const snap = await getDocs(q);
            let results = snap.docs.map(d => ({ id: d.id, ...d.data() } as AppUser));
            
            if (search) {
                const lowerSearch = search.toLowerCase();
                results = results.filter(u => 
                    u.name?.toLowerCase().includes(lowerSearch) || 
                    u.email?.toLowerCase().includes(lowerSearch) ||
                    u.id.includes(lowerSearch)
                );
            }
            setUsers(results);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAction = async (userId: string, action: 'pro' | 'tokens' | 'suspend' | 'unsuspend') => {
        setProcessingId(userId);
        try {
            const userRef = doc(db, 'users', userId);
            if (action === 'pro') {
                if (!confirm("Are you sure you want to grant Pro Status indefinitely?")) return;
                await updateDoc(userRef, { plan: 'pro' });
                // Note: Production should handle updating platform_stats free->pro if necessary
            } else if (action === 'tokens') {
                const amount = window.prompt("How many tokens to add?", "100");
                if (!amount || isNaN(parseInt(amount))) return;
                await updateDoc(userRef, { tokensUsed: increment(-parseInt(amount)) });
            } else if (action === 'suspend') {
                if (!confirm("Suspend this user? They will lose access.")) return;
                await updateDoc(userRef, { isSuspended: true });
            } else if (action === 'unsuspend') {
                await updateDoc(userRef, { isSuspended: false });
            }
            
            // Re-sync local state to reflect changes instantly without re-fetching
            setUsers(prev => prev.map(u => {
                if (u.id === userId) {
                    if (action === 'pro') return { ...u, plan: 'pro' };
                    if (action === 'suspend') return { ...u, isSuspended: true };
                    if (action === 'unsuspend') return { ...u, isSuspended: false };
                }
                return u;
            }));

        } catch (error) {
            console.error(error);
            alert("Action failed.");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">User Management</h1>
                <p className="text-gray-500 text-sm font-bold mt-1">Search users, modify access, and issue grants.</p>
            </div>

            <div className="bg-white dark:bg-[#162032] p-6 rounded-[2rem] border border-gray-200 dark:border-white/5 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by name, email, or ID..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && fetchUsers(searchQuery)}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-black dark:focus:border-white transition-colors font-bold text-sm text-black dark:text-white"
                    />
                </div>
                <button 
                    onClick={() => fetchUsers(searchQuery)}
                    className="w-full md:w-auto bg-black dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Search
                </button>
            </div>

            <div className="bg-white dark:bg-[#162032] rounded-[2rem] border border-gray-200 dark:border-white/5 overflow-hidden">
                {loading ? (
                    <div className="py-24 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">User Details</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Plan</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-bold">No users found.</td>
                                    </tr>
                                )}
                                {users.map(u => (
                                    <tr key={u.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden relative hidden md:block">
                                                    <UserBadge uid={u.id} size="sm" hideName className="absolute inset-0" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-black dark:text-white flex items-center gap-2">
                                                        {u.name} 
                                                        {u.isAdmin && <ShieldAlert className="w-3 h-3 text-amber-500" />}
                                                    </p>
                                                    <p className="text-xs font-bold text-gray-400 truncate w-32 md:w-48">{u.email}</p>
                                                    <p className="text-[9px] font-mono text-gray-300 dark:text-gray-600 mt-1">ID: {u.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg",
                                                u.plan === 'pro' ? "bg-amber-500/10 text-amber-500" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                                            )}>
                                                {u.plan || 'free'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.isSuspended ? (
                                                <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
                                                    <ShieldAlert className="w-4 h-4" /> Suspended
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-green-500 text-xs font-bold">
                                                    <CheckCircle2 className="w-4 h-4" /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                {u.plan !== 'pro' && (
                                                    <button onClick={() => handleAction(u.id, 'pro')} disabled={processingId === u.id} className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors" title="Grant Pro">
                                                        {processingId === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                                                    </button>
                                                )}
                                                <button onClick={() => handleAction(u.id, 'tokens')} disabled={processingId === u.id} className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white transition-colors" title="Grant Tokens">
                                                    {processingId === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="font-serif font-black text-sm">T</span>}
                                                </button>
                                                {u.isSuspended ? (
                                                    <button onClick={() => handleAction(u.id, 'unsuspend')} disabled={processingId === u.id} className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-3 h-9 rounded-xl hover:bg-green-500 hover:text-white transition-all">
                                                        Unsuspend
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleAction(u.id, 'suspend')} disabled={processingId === u.id || u.isAdmin} className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-colors" title="Suspend">
                                                        <UserMinus className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
