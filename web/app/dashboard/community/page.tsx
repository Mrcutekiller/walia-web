'use client';
import Image from 'next/image';

import UserBadge from '@/components/UserBadge';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { cn, formatTimeAgo } from '@/lib/utils';
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import {
    Clock,
    Eye,
    FileText,
    Heart,
    HelpCircle,
    MessageCircle,
    MoreHorizontal,
    Plus,
    Share2,
    Trash2,
    Users,
    X
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface Story {
    id: string;
    authorId: string;
    imageUrl?: string;
    content?: string;
    views: string[];
    likes: string[];
    createdAt: any;
}

interface QuizOption {
    text: string;
    votes: string[]; // user IDs
}

interface Post {
    id: string;
    authorId: string;
    authorName?: string;
    title: string;
    content: string;
    type: 'ai_share' | 'quiz' | 'note' | 'general';
    quizOptions?: QuizOption[];
    correctAnswerIndex?: number;
    imageUrl?: string;
    likes: string[];
    commentCount: number;
    createdAt: any;
}

export default function CommunityPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [postInput, setPostInput] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postType, setPostType] = useState<'ai_share' | 'quiz' | 'note' | 'general'>('general');
    const [isPosting, setIsPosting] = useState(false);
    const [isSharingStory, setIsSharingStory] = useState(false);
    const [showNewPost, setShowNewPost] = useState(false);
    const [activeTab, setActiveTab] = useState('Latest');
    const [followingIds, setFollowingIds] = useState<string[]>([]);
    const [quizOptions, setQuizOptions] = useState<string[]>(['', '']);
    const [correctIndex, setCorrectIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [quizType, setQuizType] = useState<'multiple' | 'boolean'>('multiple');
    const storyFileRef = useRef<HTMLInputElement>(null);
    const postFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
        const unsub = onSnapshot(q, (snap) => {
            setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
        });

        // Fetch following list
        if (user) {
            const fq = query(collection(db, 'follows'), where('followerId', '==', user.uid));
            const unsubFollows = onSnapshot(fq, (snap) => {
                setFollowingIds(snap.docs.map(d => d.data().followedId));
            });
            // Cleanup for follows
            return () => { unsub(); unsubFollows(); };
        }

        // Fetch stories from last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const sq = query(
            collection(db, 'stories'),
            where('createdAt', '>=', twentyFourHoursAgo),
            orderBy('createdAt', 'desc')
        );
        const unsubStories = onSnapshot(sq, (snap) => {
            setStories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Story)));
        });

        return () => { unsub(); unsubStories(); };
    }, [user]);

    const filteredStories = stories.filter(story =>
        story.authorId === user?.uid || followingIds.includes(story.authorId)
    );

    const filteredPosts = posts.filter(post => {
        if (activeTab === 'Following') return followingIds.includes(post.authorId);
        if (activeTab === 'Trending') return (post.likes?.length || 0) > 0;
        return true;
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'story' | 'post') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            if (type === 'story') {
                createStory(reader.result as string);
            } else {
                setSelectedImage(reader.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const createStory = async (base64: string) => {
        if (!user) return;
        setIsSharingStory(true);
        try {
            await addDoc(collection(db, 'stories'), {
                authorId: user.uid,
                imageUrl: base64,
                views: [],
                likes: [],
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Story error:', error);
        } finally {
            setIsSharingStory(false);
        }
    };

    const handleCreatePost = async () => {
        if (!postInput.trim() || !user) return;
        setIsPosting(true);
        try {
            const postData: any = {
                authorId: user.uid,
                authorName: user.displayName || 'Anonymous',
                title: postTitle || '',
                content: postInput,
                type: postType,
                imageUrl: selectedImage || null,
                likes: [],
                commentCount: 0,
                createdAt: serverTimestamp()
            };

            if (postType === 'quiz') {
                postData.quizOptions = quizOptions
                    .filter(opt => opt.trim() !== '')
                    .map(opt => ({ text: opt, votes: [] }));
                postData.correctAnswerIndex = correctIndex;
            }

            await addDoc(collection(db, 'posts'), postData);
            setPostInput('');
            setPostTitle('');
            setPostType('general');
            setQuizOptions(['', '']);
            setSelectedImage(null);
            setShowNewPost(false);
        } catch (error) {
            console.error('Post error:', error);
        } finally {
            setIsPosting(false);
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

    const handleVote = async (post: Post, optionIndex: number) => {
        if (!user) return;
        const postRef = doc(db, 'posts', post.id);
        const newOptions = [...(post.quizOptions || [])];

        // Remove user's previous vote if any
        newOptions.forEach(opt => {
            if (opt.votes) {
                opt.votes = opt.votes.filter(id => id !== user.uid);
            } else {
                opt.votes = [];
            }
        });

        // Add new vote
        if (!newOptions[optionIndex].votes) newOptions[optionIndex].votes = [];
        newOptions[optionIndex].votes.push(user.uid);

        try {
            await updateDoc(postRef, { quizOptions: newOptions });
        } catch (error) {
            console.error('Vote error:', error);
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

    return (
        <div className="min-h-full bg-white dark:bg-[#0A0A18] text-black dark:text-white animate-in fade-in pb-20 selection:bg-black selection:text-white">
            {/* Header / Top Navigation */}
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#0A0A18]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-6">
                    {['Latest', 'Following', 'Trending'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "text-xl font-bold transition-all border-b-2 pb-1",
                                activeTab === tab
                                    ? "text-black dark:text-white border-black dark:border-white font-black"
                                    : "text-gray-400 border-transparent hover:text-black dark:hover:text-white"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 pt-8 space-y-10">

                {/* Horizontal Stories Section */}
                <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar snap-x scroll-smooth">
                    <div
                        onClick={() => storyFileRef.current?.click()}
                        className="shrink-0 snap-start w-32 h-48 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-4 hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden"
                    >
                        <input
                            type="file"
                            ref={storyFileRef}
                            onChange={(e) => handleImageChange(e, 'story')}
                            accept="image/*"
                            className="hidden"
                        />
                        {isSharingStory ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin" />
                                <span className="text-[10px] font-black uppercase text-black/40">Sharing...</span>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-black/20 dark:shadow-white/5">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-black text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">Your Story</span>
                            </>
                        )}
                    </div>

                    {filteredStories.map(story => (
                        <div
                            key={story.id}
                            className="shrink-0 snap-start w-32 h-48 rounded-[2.5rem] bg-gray-100 dark:bg-white/5 overflow-hidden relative cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-1 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white group"
                        >
                            {story.imageUrl ? (
                                <Image src={story.imageUrl} fill className="object-cover transition-transform duration-500 group-hover:scale-110" alt="Story" />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 opacity-50" />
                            )}

                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full border border-white/50 overflow-hidden">
                                        <UserBadge uid={story.authorId} size="sm" />
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-white uppercase tracking-widest">
                                        <Eye className="w-2 h-2" />
                                        {story.views?.length || 0}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-white uppercase tracking-widest">
                                        <Heart className="w-2 h-2 fill-current" />
                                        {story.likes?.length || 0}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-[7px] font-bold text-white/60 uppercase tracking-tighter">
                                    <Clock className="w-2 h-2" />
                                    {formatTimeAgo(story.createdAt)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Compose Post Area */}
                <div className="relative z-10 w-full mb-8">
                    {!showNewPost ? (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowNewPost(true)}
                                className="flex-1 flex items-center justify-between p-4 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white hover:shadow-md hover:bg-white dark:hover:bg-white/10 transition-all font-medium text-gray-500 group"
                            >
                                <span className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shrink-0 group-hover:scale-110 transition-transform">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <span className="group-hover:text-black dark:group-hover:text-white transition-colors">Post an update...</span>
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 shadow-xl space-y-4 animate-in slide-in-from-top-4 fade-in">
                            <input
                                type="text"
                                placeholder="Post Title (optional)"
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                className="w-full bg-transparent text-xl font-black text-black dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700"
                            />
                            <textarea
                                placeholder="What's the question? (e.g., What is the capital of Ethiopia?)"
                                value={postInput}
                                onChange={(e) => setPostInput(e.target.value)}
                                className="w-full bg-transparent text-base text-gray-700 dark:text-gray-300 outline-none resize-none min-h-[80px] placeholder:text-gray-400 dark:placeholder:text-gray-700 font-medium custom-scrollbar"
                            />

                            {selectedImage && (
                                <div className="relative w-full aspect-video rounded-3xl overflow-hidden group">
                                    <Image src={selectedImage || ''} alt="Post preview" fill className="object-cover" unoptimized />
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-md z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {postType === 'quiz' && (
                                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-1 rounded-2xl w-fit">
                                        {[
                                            { id: 'multiple', label: 'Multiple Choice' },
                                            { id: 'boolean', label: 'True / False' }
                                        ].map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => {
                                                    setQuizType(t.id as any);
                                                    if (t.id === 'boolean') {
                                                        setQuizOptions(['True', 'False']);
                                                    } else {
                                                        setQuizOptions(['', '', '', '']);
                                                    }
                                                }}
                                                className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                    quizType === t.id
                                                        ? "bg-white dark:bg-white/10 text-black dark:text-white shadow-sm"
                                                        : "text-gray-400 hover:text-gray-600"
                                                )}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {quizOptions.map((option, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <button
                                                    onClick={() => setCorrectIndex(idx)}
                                                    className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center border transition-all shrink-0",
                                                        correctIndex === idx
                                                            ? "bg-green-500 border-green-600 text-white shadow-lg shadow-green-500/20"
                                                            : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-gray-800 text-gray-300"
                                                    )}
                                                >
                                                    {correctIndex === idx ? '✓' : idx + 1}
                                                </button>
                                                <input
                                                    type="text"
                                                    value={option}
                                                    readOnly={quizType === 'boolean'}
                                                    onChange={(e) => {
                                                        const newOpts = [...quizOptions];
                                                        newOpts[idx] = e.target.value;
                                                        setQuizOptions(newOpts);
                                                    }}
                                                    placeholder={`Option ${idx + 1}`}
                                                    className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl px-4 text-sm font-medium focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-colors"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {quizType === 'multiple' && quizOptions.length < 5 && (
                                        <button
                                            onClick={() => setQuizOptions([...quizOptions, ''])}
                                            className="text-[10px] font-black uppercase text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-2"
                                        >
                                            <Plus className="w-3 h-3" /> Add Option
                                        </button>
                                    )}
                                </div>
                            )}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        ref={postFileRef}
                                        onChange={(e) => handleImageChange(e, 'post')}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => postFileRef.current?.click()}
                                        className="p-3 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-black dark:hover:text-white transition-all"
                                    >
                                        <Share2 className="w-4 h-4 rotate-45" />
                                    </button>
                                    {[
                                        { id: 'general', icon: Share2, label: 'Discussion' },
                                        { id: 'quiz', icon: HelpCircle, label: 'Quiz' },
                                        { id: 'note', icon: FileText, label: 'Notes' }
                                    ].map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setPostType(t.id as any)}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border",
                                                postType === t.id
                                                    ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                                                    : "bg-white dark:bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                                            )}
                                        >
                                            <t.icon className="w-4 h-4" />
                                            <span className="hidden sm:inline">{t.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowNewPost(false)}
                                        className="px-5 py-2.5 rounded-full text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreatePost}
                                        disabled={!postInput.trim() || isPosting}
                                        className="px-6 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold disabled:opacity-50 hover:bg-zinc-800 dark:hover:bg-gray-200 transition-colors shadow-lg shadow-black/20 dark:shadow-white/5"
                                    >
                                        {isPosting ? 'Posting...' : 'Publish'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Feed Header */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">{activeTab} Feed</h2>
                    <button className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-xl hover:bg-gray-50 dark:hover:bg-white/5">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>

                {/* Feed Body */}
                <div className="space-y-8">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-gray-200 dark:border-gray-800">
                            <Users className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                            <h3 className="text-lg font-black text-black dark:text-white">No posts yet</h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                                {activeTab === 'Following' ? "You're not following anyone yet or they haven't posted." : "Be the first to share something!"}
                            </p>
                        </div>
                    ) : (
                        filteredPosts.map((post) => {
                            const isLiked = post.likes?.includes(user?.uid || '');
                            return (
                                <div
                                    key={post.id}
                                    className="p-6 md:p-8 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all group"
                                >
                                    {/* Post Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <Link href={`/dashboard/profile/${post.authorId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                            <div className="scale-110 origin-left ring-2 ring-transparent group-hover:ring-black/5 rounded-full transition-all">
                                                <UserBadge uid={post.authorId} size="sm" />
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-black dark:text-white leading-tight">
                                                        {post.authorName || 'Anonymous'}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-bold text-gray-400">
                                                    Posted in <span className="text-black dark:text-white">walia</span> - {formatTimeAgo(post.createdAt)}
                                                </span>
                                            </div>
                                        </Link>

                                        <div className="flex items-center gap-2">
                                            {post.type !== 'general' && (
                                                <span className="hidden sm:inline-block px-3 py-1 bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gray-800 rounded-full text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-widest">
                                                    {post.type.replace('_share', '')}
                                                </span>
                                            )}
                                            {post.authorId === user?.uid && (
                                                <button
                                                    onClick={() => handleDeletePost(post.id)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-300 dark:text-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <div className="mb-6">
                                        {post.title && <h3 className="text-xl font-black text-black dark:text-white mb-3 tracking-tight">{post.title}</h3>}
                                        <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium whitespace-pre-wrap mb-4">{post.content}</p>

                                        {post.imageUrl && (
                                            <div className="mb-4 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm relative w-full h-[300px] md:h-[400px]">
                                                <Image src={post.imageUrl} fill className="object-cover" alt="Post" />
                                            </div>
                                        )}

                                        {/* Quiz Section */}
                                        {post.type === 'quiz' && post.quizOptions && (
                                            <div className="space-y-3 mt-4">
                                                {post.quizOptions.map((option, idx) => {
                                                    const totalVotes = post.quizOptions?.reduce((acc, opt) => acc + (opt.votes?.length || 0), 0) || 0;
                                                    const optionVotes = option.votes?.length || 0;
                                                    const percentage = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
                                                    const hasVoted = post.quizOptions?.some(opt => opt.votes?.includes(user?.uid || ''));
                                                    const myVote = option.votes?.includes(user?.uid || '');
                                                    const isCorrect = idx === post.correctAnswerIndex;

                                                    return (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handleVote(post, idx)}
                                                            disabled={hasVoted}
                                                            className={cn(
                                                                "w-full relative overflow-hidden rounded-2xl border transition-all text-left p-4 group/opt",
                                                                hasVoted
                                                                    ? "cursor-default"
                                                                    : "hover:border-black dark:hover:border-white active:scale-[0.98]",
                                                                hasVoted && isCorrect
                                                                    ? "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400 font-bold"
                                                                    : hasVoted && myVote && !isCorrect
                                                                        ? "bg-red-500/10 border-red-500 text-red-700 dark:text-red-400 font-bold"
                                                                        : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                                                            )}
                                                        >
                                                            {/* Progress Bar Background */}
                                                            {hasVoted && (
                                                                <div
                                                                    className={cn(
                                                                        "absolute inset-y-0 left-0 transition-all duration-1000",
                                                                        isCorrect ? "bg-green-500/10" : "bg-gray-200 dark:bg-white/10"
                                                                    )}
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            )}

                                                            <div className="relative flex justify-between items-center z-10">
                                                                <span className="text-sm">{option.text}</span>
                                                                {hasVoted && (
                                                                    <div className="flex items-center gap-2">
                                                                        {myVote && <span className="text-[10px] font-black uppercase text-gray-400">Your Vote</span>}
                                                                        <span className="text-xs font-black">{percentage}%</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Post Footer Actions */}
                                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-5 mt-2">
                                        <div className="flex items-center space-x-6">
                                            <button
                                                onClick={() => handleLike(post)}
                                                className={cn(
                                                    "flex items-center space-x-2 text-sm font-bold transition-all group/btn",
                                                    isLiked ? "text-black dark:text-white" : "text-gray-400 hover:text-black dark:hover:text-white"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                                    isLiked ? "bg-gray-100 dark:bg-white/10" : "bg-transparent group-hover/btn:bg-gray-50 dark:group-hover/btn:bg-white/5"
                                                )}>
                                                    <Heart className={cn("w-5 h-5 transition-transform", isLiked && "fill-current group-hover/btn:scale-110")} />
                                                </div>
                                                <span>{post.likes?.length || 0} Likes</span>
                                            </button>
                                            <button className="flex items-center space-x-2 text-sm font-bold text-gray-400 hover:text-black dark:hover:text-white transition-all group/btn">
                                                <div className="w-10 h-10 rounded-full bg-transparent group-hover/btn:bg-gray-50 dark:group-hover/btn:bg-white/5 flex items-center justify-center transition-colors">
                                                    <MessageCircle className="w-5 h-5" />
                                                </div>
                                                <span className="hidden sm:inline">{post.commentCount || 0} Comments</span>
                                            </button>
                                        </div>
                                        <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-105 transition-all outline-none">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}
