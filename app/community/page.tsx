'use client';

import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { Heart, MessageCircle, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Post {
    id: string;
    authorName: string;
    authorId: string;
    type: 'text' | 'quiz' | 'note' | 'ai_share';
    title?: string;
    content: string;
    likes: number;
    createdAt: any;
    quizOptions?: string[];
    quizAnswer?: number;
}

export default function CommunityPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [type, setType] = useState<Post['type']>('text');
    const [posting, setPosting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [quizOptions, setQuizOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [quizStates, setQuizStates] = useState<Record<string, number>>({});

    useEffect(() => {
        const q = query(collection(db, 'community'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, snap => setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post))));
    }, []);

    const createPost = async () => {
        if (!content.trim() || !user) return;
        setPosting(true);

        const postData: any = {
            authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
            authorId: user.uid,
            type,
            title: title || null,
            content,
            likes: 0,
            createdAt: serverTimestamp(),
        };

        if (type === 'quiz') {
            postData.quizOptions = quizOptions.filter(o => o.trim() !== '');
            postData.quizAnswer = correctAnswer;
        }

        await addDoc(collection(db, 'community'), postData);
        setContent(''); setTitle(''); setType('text'); setPosting(false); setShowForm(false);
    };

    const handleQuizAnswer = (postId: string, idx: number, correct: number) => {
        if (quizStates[postId] !== undefined) return;
        setQuizStates(prev => ({ ...prev, [postId]: idx }));
    };

    return (
        <DashboardShell>
            <div className="p-6 max-w-2xl mx-auto pb-20">
                <div className="flex items-center justify-between mb-8 border-b border-black/5 dark:border-white/5 pb-4">
                    <div>
                        <p className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-widest mb-1">Social</p>
                        <h1 className="text-3xl font-black text-black dark:text-white tracking-tight">Community</h1>
                    </div>
                    <button onClick={() => setShowForm(v => !v)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black text-sm hover:opacity-90 transition-all shadow-lg">
                        <Plus className="w-4 h-4" /> {showForm ? 'Close' : 'New Post'}
                    </button>
                </div>

                {showForm && (
                    <div className="mb-8 p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/10 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                        {/* Type Selector */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {(['text', 'quiz', 'note', 'ai_share'] as const).map(t => (
                                <button key={t} onClick={() => setType(t)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${type === t
                                            ? 'bg-black dark:bg-white text-white dark:text-black border-transparent'
                                            : 'bg-transparent text-black/40 dark:text-white/40 border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'
                                        }`}>
                                    {t.replace('_', ' ')}
                                </button>
                            ))}
                        </div>

                        {type !== 'text' && (
                            <input value={title} onChange={e => setTitle(e.target.value)}
                                placeholder="Post Title..."
                                className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-2 mb-4 text-lg font-bold text-black dark:text-white outline-none placeholder:text-black/20 dark:placeholder:text-white/20"
                            />
                        )}

                        <textarea value={content} onChange={e => setContent(e.target.value)}
                            placeholder={type === 'quiz' ? "Question..." : "Share knowledge or ask a question..."}
                            rows={3}
                            className="w-full bg-transparent text-black dark:text-white text-sm placeholder:text-black/20 dark:placeholder:text-white/20 outline-none resize-none"
                        />

                        {type === 'quiz' && (
                            <div className="mt-4 space-y-2">
                                <p className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase mb-2">Options (Mark correct one)</p>
                                {quizOptions.map((opt, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <button onClick={() => setCorrectAnswer(i)}
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${correctAnswer === i ? 'bg-indigo-500 border-indigo-500' : 'border-black/20 dark:border-white/20'}`}>
                                            {correctAnswer === i && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </button>
                                        <input value={opt} onChange={e => {
                                            const next = [...quizOptions];
                                            next[i] = e.target.value;
                                            setQuizOptions(next);
                                        }} placeholder={`Option ${i + 1}`}
                                            className="flex-1 bg-black/5 dark:bg-white/5 border border-transparent rounded-lg px-3 py-1.5 text-xs text-black dark:text-white outline-none focus:border-black/10 dark:focus:border-white/10" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end mt-6 gap-3 pt-4 border-t border-black/5 dark:border-white/5">
                            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-black/40 dark:text-white/40 text-xs font-bold hover:text-black dark:hover:text-white">Cancel</button>
                            <button onClick={createPost} disabled={posting || !content.trim()}
                                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black text-xs disabled:opacity-30 shadow-md">
                                {posting ? 'Posting...' : 'Share Post'}
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {posts.length === 0 ? (
                        <div className="text-center py-24 text-black/10 dark:text-white/10">
                            <MessageCircle className="w-16 h-16 mx-auto mb-4" />
                            <p className="font-black text-xl">The feed is empty</p>
                            <p className="text-sm">Be the first to share something!</p>
                        </div>
                    ) : posts.map(post => {
                        const isQuiz = post.type === 'quiz';
                        const answeredIdx = quizStates[post.id];
                        const showResult = answeredIdx !== undefined;

                        return (
                            <div key={post.id} className="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/8 hover:border-black/10 dark:hover:border-white/15 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-sm font-black text-indigo-500">
                                            {post.authorName[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-black dark:text-white">{post.authorName}</p>
                                            <p className="text-[10px] text-black/25 dark:text-white/25 font-bold uppercase tracking-tighter">
                                                {post.createdAt?.toDate?.()?.toLocaleDateString?.() || 'Just now'} • {post.type.replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white">
                                        <Plus className="w-4 h-4 rotate-45" />
                                    </button>
                                </div>

                                {post.title && <h3 className="text-lg font-black text-black dark:text-white mb-2">{post.title}</h3>}
                                <p className={`text-sm text-black/70 dark:text-white/70 leading-relaxed ${isQuiz ? 'mb-4' : ''}`}>{post.content}</p>

                                {isQuiz && post.quizOptions && (
                                    <div className="mt-4 space-y-2">
                                        {post.quizOptions.map((opt, i) => {
                                            const isCorrect = i === post.quizAnswer;
                                            const isSelected = i === answeredIdx;
                                            let btnClass = "bg-black/5 dark:bg-white/5 border-transparent";
                                            if (showResult) {
                                                if (isCorrect) btnClass = "bg-green-500/10 dark:bg-green-500/20 border-green-500/50 text-green-600 dark:text-green-400";
                                                else if (isSelected) btnClass = "bg-red-500/10 dark:bg-red-500/20 border-red-500/50 text-red-600 dark:text-red-400";
                                                else btnClass = "bg-black/2 dark:bg-white/2 border-transparent opacity-40";
                                            }

                                            return (
                                                <button key={i} disabled={showResult}
                                                    onClick={() => handleQuizAnswer(post.id, i, post.quizAnswer!)}
                                                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold border transition-all ${btnClass}`}>
                                                    <span className="mr-2 opacity-40">{String.fromCharCode(65 + i)}.</span> {opt}
                                                </button>
                                            );
                                        })}
                                        {showResult && (
                                            <p className="text-[10px] font-black uppercase tracking-widest text-center mt-3 text-indigo-500 animate-pulse">
                                                {answeredIdx === post.quizAnswer ? "✨ Correct! +50 XP" : "Keep learning! ✨"}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-6 mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                                    <button className="flex items-center gap-2 text-[10px] font-black text-black/30 dark:text-white/30 hover:text-rose-500 transition-colors uppercase tracking-widest">
                                        <Heart className="w-4 h-4" /> {post.likes} Likes
                                    </button>
                                    <button className="flex items-center gap-2 text-[10px] font-black text-black/30 dark:text-white/30 hover:text-indigo-500 transition-colors uppercase tracking-widest">
                                        <MessageCircle className="w-4 h-4" /> Reply
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </DashboardShell>
    );
}
