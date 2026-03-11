'use client';

import UserBadge from '@/components/UserBadge';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { deleteAccount } from '@/lib/user';
import { cn, formatTimeAgo } from '@/lib/utils';
import { updateProfile } from 'firebase/auth';
import {
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    limit,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    Camera,
    CheckCircle2,
    Edit3,
    Heart,
    Loader2,
    MessageCircle,
    Settings,
    Share2,
    ShieldCheck,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Post {
    id: string;
    authorId: string;
    title: string;
    content: string;
    type: 'ai_share' | 'quiz' | 'note' | 'general';
    likes: string[];
    commentCount: number;
    createdAt: any;
}

export default function ProfilePage() {
    const { user, profile } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // States
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);

    // Editable fields
    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        username: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                displayName: profile.name || profile.displayName || user?.displayName || '',
                bio: profile.bio || '',
                username: profile.username || ''
            });
        }
    }, [profile, user]);

    // Fetch user's posts
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'posts'),
            where('authorId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(20)
        );
        const unsub = onSnapshot(q, (snap) => {
            setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
        });
        return () => unsub();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                name: formData.displayName,
                displayName: formData.displayName,
                bio: formData.bio,
                username: formData.username
            });
            await updateProfile(user, { displayName: formData.displayName });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            await deleteAccount();
            router.push('/');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        setUploading(true);
        try {
            const storageRef = ref(storage, `avatars/${user.uid}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            await updateDoc(doc(db, 'users', user.uid), { photoURL: url });
            await updateProfile(user, { photoURL: url });
        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleLike = async (post: Post) => {
        if (!user) return;
        const postRef = doc(db, 'posts', post.id);
        const isLiked = post.likes?.includes(user.uid);
        try {
            await updateDoc(postRef, { likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid) });
        } catch (error) {
            console.error('Like error:', error);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, 'posts', postId));
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    if (!user) return null;

    const waliaId = `WAL-${user.uid.slice(0, 8).toUpperCase()}`;
    const memberSinceYear = user.metadata?.creationTime
        ? new Date(user.metadata.creationTime).getFullYear()
        : new Date().getFullYear();

    return (
        <div className="min-h-full bg-[#FAFAFA] dark:bg-[#0A101D] text-black dark:text-white pb-20 selection:bg-black selection:text-white">

            <main className="max-w-3xl mx-auto px-4 pt-8 md:pt-12 space-y-12">

                {/* Profile Controls Card */}
                <div className="bg-white dark:bg-[#162032] rounded-[3rem] p-6 lg:p-10 border border-gray-200 dark:border-white/5 shadow-xl shadow-black-[0.02] relative animate-in fade-in slide-in-from-top-4 duration-700">

                    {/* Top Right Actions */}
                    <div className="absolute top-6 right-6 flex gap-2">
                        {isEditing ? (
                            <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-white/10 text-black dark:text-white font-bold text-xs shadow-md border border-gray-100 hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                        ) : (
                            <>
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black dark:bg-[#4ade80] dark:text-black text-white font-bold text-xs shadow-md border hover:scale-105 transition-all">
                                    <Edit3 className="w-4 h-4" /> <span className="hidden sm:inline">Edit Bio</span>
                                </button>
                                <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 dark:bg-white/5 text-black dark:text-white font-bold text-xs shadow-md border border-gray-100 dark:border-white/5 hover:scale-105 transition-all">
                                    <Settings className="w-4 h-4" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Avatar Upload Container */}
                    <div className="flex justify-center mb-6">
                        <div
                            className="relative w-24 h-24 rounded-full border-[3px] border-black/10 p-1 bg-white overflow-hidden shadow-sm cursor-pointer"
                            onClick={() => {
                                !isEditing && fileInputRef.current?.click();
                            }}
                        >
                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center relative group">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="User Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-black text-black/30">{formData.displayName?.charAt(0) || '?'}</span>
                                )}
                                {!isEditing && (
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                                        <Camera className="w-5 h-5 text-white mb-0.5" />
                                        <span className="text-[8px] font-bold text-white uppercase tracking-wider">Update</span>
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                        </div>
                    </div>

                    {/* Bio and Info / Edit Mode */}
                    <div className="pt-2">
                        {isEditing ? (
                            <div className="space-y-6 max-w-sm mx-auto min-h-[300px] flex flex-col justify-center animate-in fade-in">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
                                    <p className="text-[9px] text-rose-500 font-bold mb-2 ml-1">Editable only during registration.</p>
                                    <input
                                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-black dark:text-white outline-none focus:border-black transition-all font-semibold text-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        value={formData.displayName}
                                        onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                        placeholder="Your full name"
                                        disabled={true}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Username</label>
                                    <p className="text-[9px] text-rose-500 font-bold mb-2 ml-1">Editable only during registration.</p>
                                    <input
                                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-black dark:text-white outline-none focus:border-black transition-all font-semibold text-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        placeholder="Your username"
                                        disabled={true}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Bio</label>
                                    <textarea
                                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-black dark:text-white outline-none focus:border-black transition-all font-medium h-32 resize-none text-center custom-scrollbar"
                                        value={formData.bio}
                                        placeholder="Tell the community about yourself..."
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>
                                <button onClick={handleSave} disabled={loading} className="w-full py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 hover:bg-zinc-800">
                                    {loading ? 'Saving...' : 'Save Details'}
                                </button>

                                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-white/5 flex justify-center">
                                    <button onClick={() => setShowDeleteConfirm(true)} className="text-xs font-bold text-red-500 hover:text-red-700 underline underline-offset-4 decoration-red-200 dark:decoration-red-900/40 hover:decoration-red-600 transition-colors">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center animate-in fade-in min-h-[200px] flex flex-col justify-center">
                                <h1 className="text-3xl font-black tracking-tight text-black dark:text-white mb-1">
                                    {formData.displayName || profile?.name || 'Set your name'}
                                </h1>
                                <p className="text-sm font-bold text-gray-400 mb-6 tracking-wide">
                                    @{formData.username || profile?.username || `user_${user.uid.slice(0, 5)}`}
                                </p>

                                <p className="max-w-md mx-auto text-[15px] font-medium text-gray-600 dark:text-gray-300 leading-relaxed mb-10">
                                    {formData.bio || "You haven't added a bio yet. Click edit to tell everyone who you are."}
                                </p>

                                {/* Stats Row */}
                                <div className="flex items-center justify-center gap-4 bg-gray-50 dark:bg-black/30 rounded-[2rem] p-4 max-w-sm mx-auto border border-gray-100 dark:border-white/5 shadow-sm">
                                    <div className="flex-1">
                                        <p className="text-xl font-black text-black dark:text-white">{posts.length}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Posts</p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
                                    <div className="flex-1">
                                        <p className="text-xl font-black text-black dark:text-white">{profile?.followersCount || 0}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Followers</p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
                                    <div className="flex-1">
                                        <p className="text-xl font-black text-black dark:text-white">{profile?.followingCount || 0}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Following</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Posts Heading */}
                {!isEditing && (
                    <div className="px-4 py-2 border-b-2 border-black dark:border-white w-fit mt-10 mb-6 mx-auto md:mx-0">
                        <h2 className="text-sm font-black text-black dark:text-white uppercase tracking-widest">Your Authored Posts</h2>
                    </div>
                )}

                {/* Posts List */}
                {!isEditing && (
                    <div className="space-y-6">
                        {posts.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-[#162032] rounded-[3rem] border border-gray-200 dark:border-white/5 shadow-sm">
                                <p className="text-gray-400 font-bold mb-4">You haven't posted anything yet.</p>
                                <Link href="/dashboard/community" className="px-6 py-3 rounded-full bg-black dark:bg-[#4ade80] dark:text-black text-white font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform inline-block">
                                    Go to Community
                                </Link>
                            </div>
                        ) : (
                            posts.map(post => {
                                const isLiked = post.likes?.includes(user?.uid || '');
                                return (
                                    <div key={post.id} className="p-6 md:p-8 rounded-[3rem] bg-white dark:bg-[#162032] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all group">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="scale-110 origin-left">
                                                    <UserBadge uid={post.authorId} size="sm" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-black dark:text-white leading-tight">{formData.displayName}</span>
                                                    <span className="text-xs font-bold text-gray-400">
                                                        {formatTimeAgo(post.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeletePost(post.id)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-300 dark:text-gray-600 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="mb-6">
                                            {post.type !== 'general' && (
                                                <span className="inline-block px-3 py-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-widest mb-3">
                                                    {post.type.replace('_share', '')}
                                                </span>
                                            )}
                                            {post.title && <h3 className="text-xl font-black text-black dark:text-white mb-3 tracking-tight">{post.title}</h3>}
                                            <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">{post.content}</p>
                                        </div>

                                        <div className="flex items-center border-t border-gray-100 dark:border-white/5 pt-5 mt-2">
                                            <div className="flex items-center space-x-6">
                                                <button
                                                    onClick={() => handleLike(post)}
                                                    className={cn(
                                                        "flex items-center space-x-2 text-sm font-bold transition-all group/btn",
                                                        isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                                        isLiked ? "bg-red-50 dark:bg-red-500/10" : "bg-transparent group-hover/btn:bg-red-50 dark:group-hover/btn:bg-red-500/10"
                                                    )}>
                                                        <Heart className={cn("w-5 h-5 transition-transform", isLiked && "fill-current group-hover/btn:scale-110")} />
                                                    </div>
                                                    <span>{post.likes?.length || 0}</span>
                                                </button>
                                                <button className="flex items-center space-x-2 text-sm font-bold text-gray-400 hover:text-black dark:hover:text-white transition-all group/btn">
                                                    <div className="w-10 h-10 rounded-full bg-transparent group-hover/btn:bg-gray-50 dark:group-hover/btn:bg-white/5 flex items-center justify-center transition-colors">
                                                        <MessageCircle className="w-5 h-5" />
                                                    </div>
                                                    <span>{post.commentCount || 0}</span>
                                                </button>
                                            </div>
                                            <button className="w-10 h-10 ml-auto rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-105 transition-all">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* ===== DIGITAL ID CARD — Bottom of Profile ===== */}
                {!isEditing && (
                    <div className="flex flex-col items-center pt-6 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Your Walia Digital ID
                        </p>

                        {/* Card Container — lanyard badge style */}
                        <div className="relative w-full max-w-[300px]">
                            {/* Lanyard string simulation */}
                            <div className="flex justify-center mb-0 -mb-1 z-10 relative">
                                <div className="w-0.5 h-10 bg-gradient-to-b from-gray-400 to-gray-300" />
                            </div>
                            {/* Clip / holder */}
                            <div className="flex justify-center mb-0 z-10 relative">
                                <div className="w-5 h-3 bg-gray-400 rounded-t-full" />
                            </div>

                            {/* The Badge Card */}
                            <div className="relative bg-white rounded-[2rem] shadow-2xl border border-black/10 overflow-hidden p-7 pb-0 min-h-[320px] flex flex-col">

                                {/* Abstract decorative shapes (black, top-right) */}
                                <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full border-[6px] border-black/8 pointer-events-none" />
                                <div className="absolute top-10 -right-4 w-16 h-16 rounded-full border-[5px] border-black/5 pointer-events-none" />
                                {/* Zigzag accent top-right */}
                                <svg className="absolute top-4 right-4 opacity-10" width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <polyline points="0,10 10,0 20,10 30,0 40,10 50,0 60,10" stroke="black" strokeWidth="3" fill="none" />
                                    <polyline points="0,25 10,15 20,25 30,15 40,25 50,15 60,25" stroke="black" strokeWidth="3" fill="none" />
                                </svg>

                                {/* App logo + name (top-left) */}
                                <div className="flex items-center gap-2.5 mb-6 relative z-10">
                                    <div className="w-9 h-9 bg-black flex items-center justify-center rounded-[10px] overflow-hidden shadow-md">
                                        <img src="/walia-logo.png" alt="Walia" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <span className="text-black font-black tracking-widest uppercase text-sm block leading-none">Walia</span>
                                        <span className="text-black/40 text-[9px] font-bold uppercase tracking-wider">Platform</span>
                                    </div>
                                </div>

                                {/* User full name — large hero text */}
                                <div className="relative z-10 mb-1">
                                    <h2 className="text-4xl font-black text-black tracking-tight leading-none break-words">
                                        {formData.displayName || 'Your Name'}
                                    </h2>
                                </div>

                                {/* Member since */}
                                <p className="text-black/50 text-sm font-bold tracking-wider mt-2 relative z-10 mb-6">
                                    Member since {memberSinceYear}
                                </p>

                                {/* Verified badge */}
                                <div className="inline-flex items-center gap-1.5 relative z-10">
                                    <ShieldCheck className="w-4 h-4 text-black/60" />
                                    <span className="text-[11px] font-black text-black/50 uppercase tracking-widest">Verified Member</span>
                                </div>

                                {/* Bottom section — divider + avatar + website */}
                                <div className="mt-auto relative">
                                    {/* ID number row */}
                                    <div className="border-t border-dashed border-black/10 mt-6 pt-4 pb-4 flex items-center justify-between">
                                        <p className="text-black/30 text-[9px] font-mono font-bold tracking-widest uppercase">
                                            ID: {waliaId}
                                        </p>
                                        <div className="bg-black/5 border border-black/10 rounded-full px-3 py-1">
                                            <p className="text-black/50 text-[9px] font-bold tracking-widest">walia.app</p>
                                        </div>
                                    </div>

                                    {/* Avatar — positioned bottom-right, partially cropped */}
                                    {user.photoURL && (
                                        <div className="absolute bottom-0 right-4">
                                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-[360px] p-8 rounded-[2rem] bg-[#F8F9FA] dark:bg-[#1E293B] shadow-2xl text-center flex flex-col items-center">

                            <div className="w-[72px] h-[72px] bg-white dark:bg-black/20 rounded-3xl flex items-center justify-center text-red-500 mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-white/5">
                                <AlertTriangle className="w-8 h-8 stroke-[2px]" />
                            </div>

                            <h3 className="text-[22px] font-black text-black dark:text-white mb-2 tracking-tight">Delete Account</h3>
                            <p className="text-[#6B7280] dark:text-gray-400 text-[15px] font-medium leading-relaxed mb-8">
                                You're going to delete your "Account"
                            </p>

                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-4 rounded-2xl bg-[#E5E7EB] dark:bg-white/10 text-[#4B5563] dark:text-gray-300 font-bold text-[14px] hover:bg-gray-300 dark:hover:bg-white/20 transition-colors shadow-sm"
                                >
                                    No, keep it.
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={loading}
                                    className="flex-1 py-4 rounded-2xl bg-[#FF3B30] text-white font-bold text-[14px] hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50"
                                >
                                    {loading ? '...' : 'Yes, Delete!'}
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
