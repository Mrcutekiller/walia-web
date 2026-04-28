'use client';

import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { 
    Edit3, Globe, Hash, Info, MapPin, Settings, 
    Users, Heart, MessageCircle, Calendar as CalendarIcon, 
    Camera, LogOut, CheckCircle2, Sparkles, X, MoreHorizontal
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
    doc, onSnapshot, updateDoc, collection, 
    query, where, orderBy, getDocs 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface UserProfile {
    username: string;
    displayName: string;
    about: string;
    country: string;
    age: string;
    interests: string[];
    following: string[];
    followersCount: number;
    level: number;
    xp: number;
    isPro: boolean;
    createdAt: string;
}

interface Post {
    id: string;
    content: string;
    likes: string[];
    commentsCount: number;
    createdAt: any;
}

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ displayName: '', about: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        
        // Fetch Profile
        const unsubProfile = onSnapshot(doc(db, 'users', user.uid), snap => {
            if (snap.exists()) {
                const data = snap.data() as UserProfile;
                setProfile(data);
                setEditData({ displayName: data.displayName || '', about: data.about || '' });
            }
        });

        // Fetch User Posts
        const fetchPosts = async () => {
            const q = query(
                collection(db, 'posts'), 
                where('uid', '==', user.uid),
                orderBy('createdAt', 'desc')
            );
            const snap = await getDocs(q);
            setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
        };
        fetchPosts();

        return () => unsubProfile();
    }, [user]);

    const handleUpdate = async () => {
        if (!user || loading) return;
        setLoading(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                displayName: editData.displayName,
                about: editData.about
            });
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return <div className="h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black dark:border-t-white rounded-full animate-spin" /></div>;

    return (
        <div className="h-full bg-white dark:bg-[#0A0A18] overflow-y-auto custom-scrollbar">
            {/* ── Banner ── */}
            <div className="h-64 bg-black relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#333_0%,_transparent_80%)]" />
                <div className="absolute bottom-6 right-8">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white/60 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
                        <Camera className="w-4 h-4" /> Change Banner
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 pb-20">
                {/* ── User Header ── */}
                <div className="relative -mt-20 mb-12 flex flex-col md:flex-row items-end gap-6">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[3rem] bg-black dark:bg-white border-8 border-white dark:border-[#0A0A18] flex items-center justify-center text-white dark:text-black font-black text-4xl uppercase shadow-2xl">
                            {profile.username.slice(0, 2)}
                        </div>
                        <button className="absolute bottom-2 right-2 w-10 h-10 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center border-4 border-white dark:border-[#0A0A18] hover:scale-110 transition-all shadow-xl">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 pb-2">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-4xl font-black text-black dark:text-white tracking-tighter uppercase">{profile.displayName || profile.username}</h1>
                            {profile.isPro && (
                                <div className="px-3 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-black/10">
                                    <Sparkles className="w-3 h-3" /> Pro
                                </div>
                            )}
                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                                Lvl {profile.level}
                            </div>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">@{profile.username}</p>
                    </div>

                    <div className="flex gap-3 pb-2">
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-black dark:text-white font-black text-xs uppercase tracking-widest hover:border-black dark:hover:border-white transition-all shadow-sm"
                        >
                            <Edit3 className="w-4 h-4" /> Edit Profile
                        </button>
                        <button className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-all shadow-sm">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Followers', value: profile.followersCount || 0, icon: Users },
                        { label: 'Following', value: profile.following?.length || 0, icon: UserPlus },
                        { label: 'Posts', value: posts.length, icon: MessageCircle },
                        { label: 'Rank', value: 'Silver', icon: Sparkles },
                    ].map((s, i) => (
                        <div key={i} className="p-6 rounded-[2.5rem] bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center group hover:bg-black dark:hover:bg-white transition-all duration-500">
                            <s.icon className="w-5 h-5 mx-auto mb-3 text-gray-400 group-hover:text-white/40 dark:group-hover:text-black/40 transition-colors" />
                            <p className="text-2xl font-black text-black dark:text-white tracking-tighter group-hover:text-white dark:group-hover:text-black transition-colors">{s.value}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white/40 dark:group-hover:text-black/40 transition-colors">{s.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left: About */}
                    <div className="lg:col-span-1 space-y-10">
                        <div>
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Info className="w-4 h-4" /> About
                            </h2>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                                {profile.about || "No bio yet. Tell the community about yourself!"}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                                    <MapPin className="w-4 h-4 text-black dark:text-white" /> {profile.country || 'Not specified'}
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                                    <CalendarIcon className="w-4 h-4 text-black dark:text-white" /> Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Recently'}
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                                    <Hash className="w-4 h-4 text-black dark:text-white" /> {profile.age || '—'} years old
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Heart className="w-4 h-4" /> Interests
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {profile.interests?.map(interest => (
                                    <span key={interest} className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[10px] font-black text-black dark:text-white uppercase tracking-widest">
                                        {interest}
                                    </span>
                                ))}
                                {(!profile.interests || profile.interests.length === 0) && (
                                    <p className="text-xs text-gray-400 font-medium">No interests selected</p>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={() => logout()}
                            className="w-full py-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-500 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                            <LogOut className="w-4 h-4" /> Log out
                        </button>
                    </div>

                    {/* Right: Posts Feed */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" /> Recent Posts
                        </h2>
                        
                        {posts.length === 0 ? (
                            <div className="text-center py-20 rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
                                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No posts yet</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {posts.map(post => (
                                    <div key={post.id} className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all group">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-[10px] uppercase">
                                                    {profile.username.slice(0, 2)}
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                                    {post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                                                </span>
                                            </div>
                                            <button className="text-gray-300 hover:text-black dark:hover:text-white transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center gap-6 pt-6 border-t border-gray-50 dark:border-white/5">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                <Heart className="w-4 h-4" /> {post.likes?.length || 0}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                <MessageCircle className="w-4 h-4" /> {post.commentsCount || 0}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Edit Modal ── */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsEditing(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-[#0A0A18] rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">Edit Profile</h3>
                                <button onClick={() => setIsEditing(false)} className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Display Name</label>
                                    <input 
                                        type="text" value={editData.displayName} onChange={e => setEditData({...editData, displayName: e.target.value})}
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white outline-none transition-all font-medium text-sm text-black dark:text-white"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Bio</label>
                                    <textarea 
                                        value={editData.about} onChange={e => setEditData({...editData, about: e.target.value})}
                                        rows={4}
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white outline-none transition-all font-medium text-sm text-black dark:text-white resize-none"
                                    />
                                </div>
                                <button 
                                    onClick={handleUpdate} disabled={loading}
                                    className="w-full py-5 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-black/10"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function UserPlus(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>; }
