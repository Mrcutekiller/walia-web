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
import Image from 'next/image';
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

/* ── Premium White ID Card ── */
function WaliaIDCard({ user, profile, formData, waliaId, isFlipped, setIsFlipped, fileInputRef, isEditing, uploading, handleAvatarUpload }: any) {
    const memberSince = profile?.createdAt?.toDate
        ? profile.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : '2026';

    return (
        <div className="flex flex-col items-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Digital Walia ID · Click to flip
            </p>

            <div
                className="relative w-full max-w-sm h-52 [perspective:1200px] cursor-pointer select-none"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className={`w-full h-full relative transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>

                    {/* ── FRONT: White premium card ── */}
                    <div className="absolute inset-0 w-full h-full rounded-[2rem] [backface-visibility:hidden] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                        {/* Card body - white */}
                        <div className="absolute inset-0 bg-white dark:bg-[#162032]" />

                        {/* Gold/black accent stripe at top */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-black via-amber-400 to-black dark:from-amber-500 dark:via-amber-300 dark:to-amber-500" />

                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]">
                            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full border-[40px] border-black dark:border-white" />
                            <div className="absolute -right-4 top-6 w-28 h-28 rounded-full border-[20px] border-black dark:border-white" />
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 p-5 flex flex-col">
                            {/* Header row */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-[8px] bg-black dark:bg-white border border-gray-100 dark:border-white/10 flex items-center justify-center font-black text-white dark:text-black text-base shadow-sm overflow-hidden">
                                        <Image src="/walia-logo.png" alt="Walia" width={20} height={20} unoptimized className="object-contain" />
                                    </div>
                                    <div>
                                        <p className="text-black dark:text-white font-black text-xs tracking-widest uppercase">Walia</p>
                                        <p className="text-gray-400 dark:text-gray-500 text-[9px] font-bold uppercase tracking-wider">AI Platform</p>
                                    </div>
                                </div>
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            </div>

                            {/* Avatar + Info row */}
                            <div className="flex items-center gap-4 flex-1">
                                {/* Avatar - click to upload */}
                                <div
                                    className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-white/10 shrink-0 group/avatar cursor-pointer shadow-md"
                                    onClick={(e) => { e.stopPropagation(); if (!isEditing) fileInputRef.current?.click(); }}
                                >
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                            <span className="text-2xl font-black text-gray-400">{formData.name?.charAt(0) || '?'}</span>
                                        </div>
                                    )}
                                    {!isEditing && (
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-opacity">
                                            <Camera className="w-4 h-4 text-white" />
                                            <span className="text-[7px] text-white font-bold mt-0.5">Update</span>
                                        </div>
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                            <Loader2 className="w-4 h-4 text-white animate-spin" />
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                                </div>

                                {/* Name / info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-black text-black dark:text-white truncate leading-tight">{formData.name || 'Set your name'}</h3>
                                    <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider truncate mt-0.5">@{profile?.username || 'member'}</p>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                            <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                                        </span>
                                        <span className="inline-flex px-2 py-0.5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {profile?.plan || 'Free'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ID number */}
                            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                                <p className="font-mono text-[10px] text-gray-400 dark:text-gray-500 tracking-[0.2em]">{waliaId}</p>
                                <p className="text-[9px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">Since {memberSince}</p>
                            </div>
                        </div>
                    </div>

                    {/* ── BACK FACE ── */}
                    <div className="absolute inset-0 w-full h-full rounded-[2rem] [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
                        {/* Dark premium back */}
                        <div className="absolute inset-0 bg-[#0f172a]" />
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />

                        {/* Giant Image watermark */}
                        <div className="absolute -left-10 -bottom-12 select-none pointer-events-none opacity-[0.04] grayscale">
                            <Image src="/walia-logo.png" alt="" width={220} height={220} unoptimized className="object-contain" />
                        </div>

                        <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-white">
                            {/* Barcode art */}
                            <div className="flex items-stretch gap-0.5 h-10 mb-6 w-48">
                                {[1,3,1,2,4,1,1,3,2,1,4,1,2,3,1,2,1,4,1,2,1,3].map((w, i) => (
                                    <div key={i} style={{ width: `${w * 4}px` }} className="bg-white rounded-sm flex-shrink-0" />
                                ))}
                            </div>
                            <p className="font-mono text-xs tracking-[0.3em] font-bold opacity-70 mb-5">{waliaId}</p>

                            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm mb-6">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-black tracking-widest uppercase">Verified Account</span>
                            </div>

                            <p className="text-[9px] text-white/30 text-center max-w-[200px] leading-relaxed">
                                This card confirms the digital identity of <span className="text-white/50 font-bold">{formData.name}</span> on the Walia platform.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

/* ── Main Profile Page ── */
export default function ProfilePage() {
    const { user, profile } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isFlipped, setIsFlipped] = useState(false);
    const [formData, setFormData] = useState<any>({
        name: '', username: '', email: '', bio: '',
        age: '', gender: '', school: '', schoolLevel: '',
    });

    useEffect(() => {
        if (profile && user) {
            setFormData({
                name: profile.name || profile.displayName || user.displayName || '',
                username: profile.username || '',
                email: user.email || '',
                bio: profile.bio || '',
                age: profile.age || '',
                gender: profile.gender || '',
                school: profile.school || '',
                schoolLevel: profile.schoolLevel || '',
            });
        }
    }, [profile, user]);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'posts'), where('authorId', '==', user.uid), orderBy('createdAt', 'desc'), limit(20));
        const unsub = onSnapshot(q, snap => setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post))));
        return () => unsub();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), { bio: formData.bio, name: formData.name });
            await updateProfile(user, { displayName: formData.name });
            setIsEditing(false);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
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
        } catch (error) { console.error(error); }
        finally { setUploading(false); }
    };

    const handleLike = async (post: Post) => {
        if (!user) return;
        const postRef = doc(db, 'posts', post.id);
        const isLiked = post.likes?.includes(user.uid);
        await updateDoc(postRef, { likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid) });
    };

    const handleDeletePost = async (postId: string) => {
        if (!user) return;
        await deleteDoc(doc(db, 'posts', postId));
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try { await deleteAccount(); router.push('/'); }
        catch (error: any) { alert(error.message); }
        finally { setLoading(false); setShowDeleteConfirm(false); }
    };

    if (!user) return null;
    const waliaId = `WAL-${user.uid.slice(0, 8).toUpperCase()}`;

    return (
        <div className="min-h-full bg-[#FAFAFA] dark:bg-[#0A101D] text-black dark:text-white pb-24">
            <main className="max-w-2xl mx-auto px-4 pt-8 md:pt-12 space-y-8">

                {/* ══ 1. PROFILE SECTION (TOP) ══ */}
                <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="bg-white dark:bg-[#162032] rounded-[2.5rem] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">

                        {/* Banner */}
                        <div className="h-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-[#0f172a] dark:to-[#1e293b] relative">
                            <div className="absolute inset-0 opacity-30">
                                <div className="absolute top-2 right-6 select-none pointer-events-none opacity-[0.04] grayscale">
                                    <Image src="/walia-logo.png" alt="" width={100} height={100} unoptimized className="object-contain" />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 pb-6">
                            {/* Avatar row */}
                            <div className="flex items-end justify-between -mt-10 mb-4">
                                <div className="relative group cursor-pointer" onClick={() => !isEditing && fileInputRef.current?.click()}>
                                    <div className="w-20 h-20 rounded-[1.25rem] border-4 border-white dark:border-[#162032] overflow-hidden bg-gray-100 dark:bg-white/10 shadow-lg">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-3xl font-black text-gray-400">{formData.name?.charAt(0) || '?'}</span>
                                            </div>
                                        )}
                                    </div>
                                    {!isEditing && (
                                        <div className="absolute inset-0 bg-black/50 rounded-[1.25rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            {uploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-2 mb-1">
                                    {isEditing ? (
                                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-full bg-gray-100 dark:bg-white/10 text-black dark:text-white font-bold text-xs border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">Cancel</button>
                                    ) : (
                                        <>
                                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-xs shadow hover:scale-105 transition-all">
                                                <Edit3 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Edit</span>
                                            </button>
                                            <Link href="/dashboard/settings" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:scale-105 transition-all">
                                                <Settings className="w-4 h-4" />
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Name + bio */}
                            {isEditing ? (
                                <div className="space-y-4 animate-in fade-in">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Display Name</label>
                                        <input className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-all font-semibold text-sm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Bio</label>
                                        <textarea className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-all font-medium h-24 resize-none text-sm" value={formData.bio} placeholder="Tell the community about yourself..." onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                                    </div>
                                    <button onClick={handleSave} disabled={loading} className="w-full py-3.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <div className="pt-2 flex justify-center">
                                        <button onClick={() => setShowDeleteConfirm(true)} className="text-xs font-bold text-red-500 hover:text-red-700 underline underline-offset-4 transition-colors">Delete Account</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-in fade-in">
                                    <h1 className="text-xl font-black text-black dark:text-white tracking-tight">{formData.name || 'Set your name'}</h1>
                                    <p className="text-sm font-bold text-gray-400 dark:text-gray-500 mt-0.5">@{profile?.username || `user_${user.uid.slice(0, 5)}`}</p>
                                    <p className="text-[14px] font-medium text-gray-600 dark:text-gray-300 leading-relaxed mt-3 mb-5">
                                        {formData.bio || 'No bio yet. Click Edit to add one.'}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex gap-6">
                                        <div className="text-center">
                                            <p className="text-lg font-black text-black dark:text-white">{posts.length}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Posts</p>
                                        </div>
                                        <div className="w-px bg-gray-100 dark:bg-white/10" />
                                        <div className="text-center">
                                            <p className="text-lg font-black text-black dark:text-white">{profile?.followersCount || 0}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Followers</p>
                                        </div>
                                        <div className="w-px bg-gray-100 dark:bg-white/10" />
                                        <div className="text-center">
                                            <p className="text-lg font-black text-black dark:text-white">{profile?.followingCount || 0}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Following</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ══ 2. WHITE ID CARD (BELOW) ══ */}
                {!isEditing && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                        <WaliaIDCard
                            user={user}
                            profile={profile}
                            formData={formData}
                            waliaId={waliaId}
                            isFlipped={isFlipped}
                            setIsFlipped={setIsFlipped}
                            fileInputRef={fileInputRef}
                            isEditing={isEditing}
                            uploading={uploading}
                            handleAvatarUpload={handleAvatarUpload}
                        />
                    </div>
                )}

                {/* ══ 3. POSTS ══ */}
                {!isEditing && (
                    <>
                        <div className="px-2 pt-4 border-b-2 border-black dark:border-white w-fit">
                            <h2 className="text-xs font-black text-black dark:text-white uppercase tracking-widest">Your Posts</h2>
                        </div>

                        <div className="space-y-5">
                            {posts.length === 0 ? (
                                <div className="text-center py-14 bg-white dark:bg-[#162032] rounded-[2.5rem] border border-gray-200 dark:border-white/5 shadow-sm">
                                    <p className="text-gray-400 font-bold mb-4">You haven't posted anything yet.</p>
                                    <Link href="/dashboard/community" className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform inline-block shadow-lg">
                                        Go to Community
                                    </Link>
                                </div>
                            ) : (
                                posts.map(post => {
                                    const isLiked = post.likes?.includes(user?.uid || '');
                                    return (
                                        <div key={post.id} className="p-6 rounded-[2.5rem] bg-white dark:bg-[#162032] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all">
                                            <div className="flex items-center justify-between mb-5">
                                                <div className="flex items-center gap-3">
                                                    <UserBadge uid={post.authorId} size="sm" />
                                                    <div>
                                                        <span className="text-sm font-black text-black dark:text-white leading-tight">{formData.name}</span>
                                                        <p className="text-xs font-bold text-gray-400">{formatTimeAgo(post.createdAt)}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDeletePost(post.id)} className="w-8 h-8 flex items-center justify-center text-gray-300 dark:text-gray-600 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="mb-5">
                                                {post.type !== 'general' && (
                                                    <span className="inline-block px-3 py-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-[10px] font-black uppercase text-gray-500 tracking-widest mb-3">
                                                        {post.type.replace('_share', '')}
                                                    </span>
                                                )}
                                                {post.title && <h3 className="text-lg font-black text-black dark:text-white mb-2">{post.title}</h3>}
                                                <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">{post.content}</p>
                                            </div>

                                            <div className="flex items-center border-t border-gray-100 dark:border-white/5 pt-4">
                                                <div className="flex items-center space-x-5">
                                                    <button onClick={() => handleLike(post)} className={cn('flex items-center gap-2 text-sm font-bold transition-all', isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500')}>
                                                        <div className={cn('w-9 h-9 rounded-full flex items-center justify-center transition-colors', isLiked ? 'bg-red-50 dark:bg-red-500/10' : 'hover:bg-red-50 dark:hover:bg-red-500/10')}>
                                                            <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
                                                        </div>
                                                        {post.likes?.length || 0}
                                                    </button>
                                                    <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black dark:hover:text-white transition-all">
                                                        <div className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                            <MessageCircle className="w-4 h-4" />
                                                        </div>
                                                        {post.commentCount || 0}
                                                    </button>
                                                </div>
                                                <button className="w-9 h-9 ml-auto rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-105 transition-all">
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
            </main>

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-[340px] p-8 rounded-[2rem] bg-white dark:bg-[#1E293B] shadow-2xl text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-5">
                                <AlertTriangle className="w-7 h-7 stroke-[2px]" />
                            </div>
                            <h3 className="text-xl font-black text-black dark:text-white mb-2">Delete Account</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-7 leading-relaxed">This will permanently delete your account and all your data. This action cannot be undone.</p>
                            <div className="flex gap-3 w-full">
                                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3.5 rounded-2xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">Keep it</button>
                                <button onClick={handleDeleteAccount} disabled={loading} className="flex-1 py-3.5 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50">
                                    {loading ? '...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
