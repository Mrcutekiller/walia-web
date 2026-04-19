'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';
import { Users, DollarSign, FileText, Hash, Loader2, RefreshCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminOverview() {
    const [loading, setLoading] = useState(true);
    const [calculating, setCalculating] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        proUsers: 0,
        freeUsers: 0,
        revenueEtb: 0,
        revenueUsd: 0,
        totalPosts: 0,
        totalHashtags: 0,
        downloads: 0,
    });

    // Real-time listener for stats
    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'platform_stats', 'main'), (docSnap) => {
            if (docSnap.exists()) {
                setStats(docSnap.data() as any);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Also listen to users collection for real-time user count updates
    useEffect(() => {
        const usersUnsubscribe = onSnapshot(query(collection(db, 'users')), (snap) => {
            setStats(prev => ({
                ...prev,
                totalUsers: snap.size,
                lastUpdated: new Date().toISOString()
            }));
        });

        return () => usersUnsubscribe();
    }, []);

    // Real-time listener for posts
    useEffect(() => {
        const postsUnsubscribe = onSnapshot(query(collection(db, 'posts')), (snap) => {
            let totalTags = 0;
            snap.forEach(d => {
                if (d.data().tags) totalTags += d.data().tags.length;
            });
            setStats(prev => ({
                ...prev,
                totalPosts: snap.size,
                totalHashtags: totalTags
            }));
        });

        return () => postsUnsubscribe();
    }, []);

    // Real-time listener for payments/revenue
    useEffect(() => {
        const paymentsUnsubscribe = onSnapshot(query(collection(db, 'payments')), (snap) => {
            let revEtb = 0;
            let revUsd = 0;
            let proUsers = 0;
            let freeUsers = 0;
            snap.forEach(d => {
                const data = d.data();
                if (data.status === 'approved') {
                    if (data.currency === 'ETB') revEtb += data.amount;
                    else revUsd += data.amount;
                }
            });
            setStats(prev => ({
                ...prev,
                revenueEtb: revEtb,
                revenueUsd: revUsd
            }));
        });

        return () => paymentsUnsubscribe();
    }, []);

    // Real-time listener for downloads
    useEffect(() => {
        const downloadsUnsubscribe = onSnapshot(doc(db, 'stats', 'global'), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setStats(prev => ({
                    ...prev,
                    downloads: data.downloads || 0
                }));
            }
        });

        return () => downloadsUnsubscribe();
    }, []);

    const syncStats = async () => {
        if (calculating) return;
        setCalculating(true);
        try {
            const usersSnap = await getDocs(query(collection(db, 'users')));
            const postsSnap = await getDocs(query(collection(db, 'posts')));
            const paymentsSnap = await getDocs(query(collection(db, 'payments')));
            
            let proUsers = 0;
            let freeUsers = 0;
            usersSnap.forEach(d => {
                if (d.data().plan === 'pro') proUsers++;
                else freeUsers++;
            });

            let totalTags = 0;
            postsSnap.forEach(d => {
                if (d.data().tags) totalTags += d.data().tags.length;
            });

            let revEtb = 0;
            let revUsd = 0;
            paymentsSnap.forEach(d => {
                const data = d.data();
                if (data.status === 'approved') {
                    if (data.currency === 'ETB') revEtb += data.amount;
                    else revUsd += data.amount;
                }
            });

            const newStats = {
                totalUsers: usersSnap.size,
                proUsers,
                freeUsers,
                revenueEtb: revEtb,
                revenueUsd: revUsd,
                totalPosts: postsSnap.size,
                totalHashtags: totalTags,
                lastUpdated: new Date().toISOString()
            };

            await setDoc(doc(db, 'platform_stats', 'main'), newStats);
            setStats(newStats as any);
        } catch (error) {
            console.error("Failed to sync stats", error);
        } finally {
            setCalculating(false);
            setLoading(false);
        }
    };

    const CARDS = [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Pro Members', value: stats.proUsers, icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Revenue (ETB)', value: `${stats.revenueEtb.toLocaleString()} Br`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Revenue (USD)', value: `$${stats.revenueUsd.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Total Posts', value: stats.totalPosts, icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { label: 'Hashtags Used', value: stats.totalHashtags, icon: Hash, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'APK Downloads', value: stats.downloads, icon: Download, color: 'text-red-500', bg: 'bg-red-500/10' },
    ];

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-full">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">Business Overview</h1>
                    <p className="text-gray-500 text-sm font-bold mt-1">Real-time platform metrics and KPIs.</p>
                </div>
                <button 
                    onClick={syncStats}
                    disabled={calculating}
                    className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    <RefreshCw className={cn("w-4 h-4", calculating && "animate-spin")} />
                    {calculating ? 'Syncing...' : 'Sync Database'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CARDS.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="bg-white dark:bg-[#162032] p-6 rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all group overflow-hidden relative">
                            <div className={cn("absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity", card.bg.replace('/10', ''))} />
                            
                            <div className="flex items-center gap-4 mb-4 relative z-10">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", card.bg)}>
                                    <Icon className={cn("w-6 h-6", card.color)} />
                                </div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{card.label}</p>
                            </div>
                            <h2 className="text-4xl font-black text-black dark:text-white relative z-10">{card.value}</h2>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
