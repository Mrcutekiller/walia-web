'use client';

import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowUpRight,
    Clock,
    Mail,
    Search,
    Shield,
    Trash2,
    TrendingUp,
    UserX,
    Zap
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    plan: string;
    status: string;
    joined: string;
    photoURL?: string;
    displayName?: string;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setUsers(snap.docs.map(d => ({
                id: d.id,
                ...d.data(),
                name: d.data().displayName || d.data().name || 'Unknown User',
                plan: d.data().plan || 'Free',
                status: d.data().status || 'Active',
                joined: d.data().createdAt?.toDate().toLocaleDateString() || 'N/A'
            } as User)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const toggleStatus = async (user: User) => {
        const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
        try {
            await updateDoc(doc(db, 'users', user.id), { status: newStatus });
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const confirmDelete = (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        try {
            // Note: In an actual production app, you'd trigger a Cloud Function
            // to delete the Firebase Auth user. Here we delete the Firestore doc.
            await deleteDoc(doc(db, 'users', selectedUser.id));
            setShowDeleteModal(false);
            setSelectedUser(null);
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
                            placeholder="Search by name, email or ID..."
                            className="w-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 outline-none focus:border-walia-primary/30 transition-all shadow-sm dark:shadow-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs group-hover:bg-walia-success group-hover:text-black transition-all overflow-hidden relative">
                                                {user.photoURL ? (
                                                    <Image src={user.photoURL} alt={user.name} fill className="object-cover" />
                                                ) : (
                                                    user.name.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-walia-success transition-colors">{user.name}</p>
                                                <div className="flex items-center space-x-2 text-[10px] text-white/20">
                                                    <Mail className="w-3 h-3" />
                                                    <span>{user.email || 'No email provided'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={cn(
                                            "inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                            user.plan === 'pro' || user.plan === 'Pro' ? "bg-walia-success/10 text-walia-success border border-walia-success/20" :
                                                user.plan === 'Admin' ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" :
                                                    "bg-white/5 text-white/40 border border-white/10"
                                        )}>
                                            {(user.plan === 'pro' || user.plan === 'Pro') && <Zap className="w-3 h-3" />}
                                            {user.plan === 'Admin' && <Shield className="w-3 h-3" />}
                                            <span>{user.plan}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full shadow-[0_0_8px]",
                                                user.status === 'Active' ? "bg-walia-success shadow-walia-success/50" :
                                                    user.status === 'Suspended' ? "bg-red-500 shadow-red-500/50" :
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
                                                onClick={() => toggleStatus(user)}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-orange-500/20 text-white/40 hover:text-orange-500 transition-all shadow-sm group/btn relative"
                                            >
                                                <UserX className="w-4 h-4" />
                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                                                    {user.status === 'Active' ? 'Suspend' : 'Reactivate'}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(user)}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-500 transition-all shadow-sm group/btn relative"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                                                    Delete
                                                </span>
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

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="relative w-full max-w-md p-10 rounded-[48px] bg-[#141415] border border-white/10 shadow-3xl text-center space-y-8"
                        >
                            <div className="w-20 h-20 bg-red-500/20 rounded-[32px] flex items-center justify-center mx-auto">
                                <AlertTriangle className="w-10 h-10 text-red-500" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-white">Delete User?</h3>
                                <p className="text-white/40 font-medium leading-relaxed">
                                    Are you sure you want to permanently delete <span className="text-white font-bold">{selectedUser.name}</span>? This action cannot be undone and will wipe all their data.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={handleDelete}
                                    className="w-full py-5 rounded-3xl bg-red-600 text-white font-black uppercase tracking-widest text-sm hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
                                >
                                    Yes, Terminate Account
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="w-full py-5 rounded-3xl bg-white/5 text-white/40 font-bold uppercase tracking-widest text-xs hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
