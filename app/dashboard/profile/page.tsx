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

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [bio, setBio] = useState('');

    // Read-only from sign-up: name, username, email
    const displayName = profile?.name || profile?.displayName || user?.displayName || '';
    const username = profile?.username || '';
    const email = user?.email || '';

    useEffect(() => {
        if (profile) {
            setBio(profile.bio || '');
        }
    }, [profile]);

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

    // Only save the bio (name and username from signup are locked)
    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), { bio });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving bio:', error);
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

    const photoURL = profile?.photoURL || user.photoURL;

    return (
        <div className="min-h-full bg-[#FAFAFA] text-black pb-20 selection:bg-black selection:text-white">

            <main className="max-w-3xl mx-auto px-4 pt-8 md:pt-12 space-y-8">

                {/* ── Profile Header Card ── */}
                <div className="bg-white rounded-[3rem] p-6 lg:p-10 border border-gray-200 shadow-xl relative animate-in fade-in slide-in-from-top-4 duration-700">

                    {/* Top Right Actions */}
                    <div className="absolute top-6 right-6 flex gap-2">
                        {isEditing ? (
                            <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 text-black font-bold text-xs shadow-sm border border-gray-100 hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                        ) : (
                            <>
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black text-white font-bold text-xs shadow-md border hover:scale-105 transition-all">
                                    <Edit3 className="w-4 h-4" /> <span className="hidden sm:inline">Edit Bio</span>
                                </button>
                                <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 text-black font-bold text-xs shadow-md border border-gray-100 hover:scale-105 transition-all">
                                    <Settings className="w-4 h-4" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Avatar */}
                    <div className="flex justify-center mb-6">
                        <div
                            className="relative w-24 h-24 rounded-full border-[3px] border-black/10 p-1 bg-white overflow-hidden shadow-sm cursor-pointer group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center relative">
                                {photoURL ? (
                                    <img src={photoURL} alt="User Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-black text-black/30">{displayName?.charAt(0) || email?.charAt(0) || '?'}</span>
                                )}
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                                    <Camera className="w-5 h-5 text-white mb-0.5" />
                                    <span className="text-[8px] font-bold text-white uppercase tracking-wider">Change Photo</span>
                                </div>
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                        </div>
                    </div>

                    {/* Info / Edit */}
                    <div className="pt-2">
                        {isEditing ? (
                            <div className="space-y-5 max-w-sm mx-auto animate-in fade-in">
                                {/* Name — read-only from sign-up */}
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
                                    <div className="flex items-center gap-2 w-full bg-gray-100 border border-gray-200 rounded-2xl px-5 py-3.5">
                                        <span className="font-semibold text-gray-700 flex-1 text-center">{displayName || 'Not set'}</span>
                                        <span className="text-[9px] font-bold text-red-400 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">From sign-up</span>
                                    </div>
                                </div>
                                {/* Username — read-only from sign-up */}
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Username</label>
                                    <div className="flex items-center gap-2 w-full bg-gray-100 border border-gray-200 rounded-2xl px-5 py-3.5">
                                        <span className="font-semibold text-gray-700 flex-1 text-center">@{username || 'not set'}</span>
                                        <span className="text-[9px] font-bold text-red-400 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">From sign-up</span>
                                    </div>
                                </div>
                                {/* Bio — editable */}
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Bio <span className="text-green-500 normal-case font-medium">(editable)</span></label>
                                    <textarea
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-black outline-none focus:border-black transition-all font-medium h-32 resize-none text-center custom-scrollbar"
                                        value={bio}
                                        placeholder="Tell the community about yourself..."
                                        onChange={e => setBio(e.target.value)}
                                    />
                                </div>
                                <button onClick={handleSave} disabled={loading} className="w-full py-4 rounded-full bg-black text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                                    {loading ? 'Saving...' : 'Save Bio'}
                                </button>

                                <div className="pt-4 border-t border-gray-100 flex justify-center">
                                    <button onClick={() => setShowDeleteConfirm(true)} className="text-xs font-bold text-red-500 hover:text-red-700 underline underline-offset-4 transition-colors">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center animate-in fade-in min-h-[200px] flex flex-col justify-center">
                                <h1 className="text-3xl font-black tracking-tight text-black mb-1">
                                    {displayName || 'Set your name'}
                                </h1>
                                <p className="text-sm font-bold text-gray-400 mb-6 tracking-wide">
                                    @{username || `user_${user.uid.slice(0, 5)}`}
                                </p>
                                <p className="max-w-md mx-auto text-[15px] font-medium text-gray-600 leading-relaxed mb-8">
                                    {bio || "You haven't added a bio yet. Click Edit Bio to tell everyone who you are."}
                                </p>

                                {/* Stats Row */}
                                <div className="flex items-center justify-center gap-4 bg-gray-50 rounded-[2rem] p-4 max-w-sm mx-auto border border-gray-100 shadow-sm">
                                    <div className="flex-1">
                                        <p className="text-xl font-black text-black">{posts.length}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Posts</p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200" />
                                    <div className="flex-1">
                                        <p className="text-xl font-black text-black">{profile?.followersCount || 0}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Followers</p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200" />
                                    <div className="flex-1">
                                        <p className="text-xl font-black text-black">{profile?.followingCount || 0}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Following</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Posts ── */}
                {!isEditing && (
                    <>
                        <div className="px-4 py-2 border-b-2 border-black w-fit mx-auto md:mx-0">
                            <h2 className="text-sm font-black text-black uppercase tracking-widest">Your Posts</h2>
                        </div>

                        <div className="space-y-6">
                            {posts.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-[3rem] border border-gray-200 shadow-sm">
                                    <p className="text-gray-400 font-bold mb-4">You haven't posted anything yet.</p>
                                    <Link href="/dashboard/community" className="px-6 py-3 rounded-full bg-black text-white font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform inline-block">
                                        Go to Community
                                    </Link>
                                </div>
                            ) : (
                                posts.map(post => {
                                    const isLiked = post.likes?.includes(user?.uid || '');
                                    return (
                                        <div key={post.id} className="p-6 md:p-8 rounded-[3rem] bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <UserBadge uid={post.authorId} size="sm" />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-black leading-tight">{displayName}</span>
                                                        <span className="text-xs font-bold text-gray-400">{formatTimeAgo(post.createdAt)}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeletePost(post.id)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="mb-6">
                                                {post.type !== 'general' && (
                                                    <span className="inline-block px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-black uppercase text-gray-500 tracking-widest mb-3">
                                                        {post.type.replace('_share', '')}
                                                    </span>
                                                )}
                                                {post.title && <h3 className="text-xl font-black text-black mb-3 tracking-tight">{post.title}</h3>}
                                                <p className="text-[15px] text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">{post.content}</p>
                                            </div>

                                            <div className="flex items-center border-t border-gray-100 pt-5 mt-2">
                                                <div className="flex items-center space-x-6">
                                                    <button
                                                        onClick={() => handleLike(post)}
                                                        className={cn("flex items-center space-x-2 text-sm font-bold transition-all group/btn", isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500")}
                                                    >
                                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors", isLiked ? "bg-red-50" : "bg-transparent group-hover/btn:bg-red-50")}>
                                                            <Heart className={cn("w-5 h-5 transition-transform", isLiked && "fill-current")} />
                                                        </div>
                                                        <span>{post.likes?.length || 0}</span>
                                                    </button>
                                                    <button className="flex items-center space-x-2 text-sm font-bold text-gray-400 hover:text-black transition-all group/btn">
                                                        <div className="w-10 h-10 rounded-full bg-transparent group-hover/btn:bg-gray-50 flex items-center justify-center transition-colors">
                                                            <MessageCircle className="w-5 h-5" />
                                                        </div>
                                                        <span>{post.commentCount || 0}</span>
                                                    </button>
                                                </div>
                                                <button className="w-10 h-10 ml-auto rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 hover:scale-105 transition-all">
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </>
                )}

                {/* ── Digital ID Card (bottom) ── */}
                {!isEditing && (
                    <div className="flex flex-col items-center pt-4 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Your Walia Digital ID
                        </p>

                        <div className="relative w-full max-w-[300px]">
                            {/* Lanyard string */}
                            <div className="flex justify-center">
                                <div className="w-px h-10 bg-gradient-to-b from-gray-400 to-gray-300" />
                            </div>
                            {/* Clip */}
                            <div className="flex justify-center mb-0">
                                <div className="w-5 h-2.5 bg-gray-400 rounded-t-full" />
                            </div>

                            {/* Badge */}
                            <div className="relative bg-white rounded-[2rem] shadow-2xl shadow-black/15 border border-black/10 overflow-hidden flex flex-col">
                                {/* Black header strip */}
                                <div className="bg-black px-6 py-4 flex items-center gap-3">
                                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-md shrink-0">
                                        <img src="/walia-logo.png" alt="Walia" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-base tracking-widest uppercase leading-none">Walia</p>
                                        <p className="text-white/50 text-[9px] font-bold uppercase tracking-wider mt-0.5">Official Member ID</p>
                                    </div>
                                    <ShieldCheck className="w-5 h-5 text-white/70 ml-auto" />
                                </div>

                                {/* White body */}
                                <div className="px-6 py-5 relative">
                                    {/* Abstract decorative circles */}
                                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full border-[5px] border-black/5 pointer-events-none" />
                                    <div className="absolute right-4 top-10 w-10 h-10 rounded-full border-[3px] border-black/4 pointer-events-none" />

                                    {/* Avatar */}
                                    <div className="absolute top-5 right-6">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                                            {photoURL ? (
                                                <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl font-black text-gray-400">{displayName?.charAt(0) || '?'}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* User info */}
                                    <div className="pr-20">
                                        <h2 className="text-2xl font-black text-black tracking-tight leading-tight break-words mb-1">
                                            {displayName || 'Your Name'}
                                        </h2>
                                        <p className="text-black/50 text-xs font-bold tracking-wider mb-4">
                                            Member since {memberSinceYear}
                                        </p>
                                        {username && (
                                            <p className="text-black/40 text-[11px] font-bold tracking-widest mb-4">@{username}</p>
                                        )}
                                    </div>

                                    {/* Bottom row */}
                                    <div className="border-t border-dashed border-black/10 pt-3 mt-2 flex items-center justify-between">
                                        <p className="text-black/30 text-[9px] font-mono font-bold tracking-widest uppercase">
                                            {waliaId}
                                        </p>
                                        <div className="bg-black text-white rounded-full px-3 py-1">
                                            <p className="text-[9px] font-bold tracking-widest">walia.app</p>
                                        </div>
                                    </div>
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
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-[360px] p-8 rounded-[2rem] bg-white shadow-2xl text-center flex flex-col items-center">
                            <div className="w-[72px] h-[72px] bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-6 border border-red-100">
                                <AlertTriangle className="w-8 h-8 stroke-[2px]" />
                            </div>
                            <h3 className="text-[22px] font-black text-black mb-2 tracking-tight">Delete Account</h3>
                            <p className="text-gray-500 text-[15px] font-medium leading-relaxed mb-8">
                                This will permanently delete your account and all your data.
                            </p>
                            <div className="flex gap-4 w-full">
                                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold text-[14px] hover:bg-gray-200 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleDeleteAccount} disabled={loading} className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold text-[14px] hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50">
                                    {loading ? '...' : 'Delete!'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
