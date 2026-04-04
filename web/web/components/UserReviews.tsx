'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Edit2, Star, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: any;
}

export default function UserReviews() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState('');

    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, 'reviews'), where('userId', '==', user.id));
        const unsub = onSnapshot(q, (snapshot) => {
            setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
            setLoading(false);
        });

        return () => unsub();
    }, [user]);

    const deleteReview = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        try {
            await deleteDoc(doc(db, 'reviews', id));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const startEdit = (review: Review) => {
        setEditingId(review.id);
        setEditRating(review.rating);
        setEditComment(review.comment);
    };

    const saveEdit = async () => {
        if (!editingId) return;
        try {
            await updateDoc(doc(db, 'reviews', editingId), {
                rating: editRating,
                comment: editComment,
                updatedAt: serverTimestamp()
            });
            setEditingId(null);
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    if (loading) return null;

    return (
        <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-widest">Your Reviews</h3>
                {reviews.length > 0 && <span className="px-2 py-0.5 rounded-md bg-walia-primary/10 text-[9px] text-walia-primary font-black uppercase">{reviews.length} Feedback Item{reviews.length !== 1 ? 's' : ''}</span>}
            </div>

            {reviews.length === 0 && (
                <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/8 shadow-sm dark:shadow-none">
                    <p className="text-xs text-black/40 dark:text-white/40 mb-4 font-medium italic">You haven't left a review yet. Your feedback helps Walia grow!</p>
                    <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button key={s} onClick={() => setEditRating(s)} className="transition-transform hover:scale-110">
                                <Star className={`w-6 h-6 ${editRating >= s ? 'fill-[#FFD700] text-[#FFD700]' : 'text-black/10 dark:text-white/20'}`} />
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        placeholder="Share your thoughts about Walia..."
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-black dark:text-white outline-none focus:border-walia-primary/30 transition-all resize-none mb-4"
                        rows={3}
                    />
                    <button
                        onClick={async () => {
                            if (!user || editRating === 0) return;
                            try {
                                await addDoc(collection(db, 'reviews'), {
                                    userId: user.id,
                                    userName: user.name || 'Anonymous',
                                    userPhoto: user.photoURL || '',
                                    rating: editRating,
                                    comment: editComment,
                                    createdAt: serverTimestamp(),
                                    updatedAt: serverTimestamp(),
                                });
                                setEditRating(0);
                                setEditComment('');
                            } catch (e) {
                                console.error(e);
                            }
                        }}
                        disabled={editRating === 0}
                        className="w-full py-3 rounded-xl bg-walia-primary text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-30 shadow-lg shadow-walia-primary/20"
                    >
                        Submit Feedback
                    </button>
                </div>
            )}

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-5 rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/8 group relative shadow-sm dark:shadow-none"
                        >
                            {editingId === review.id ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button key={s} onClick={() => setEditRating(s)}>
                                                <Star className={`w-5 h-5 ${editRating >= s ? 'fill-[#FFD700] text-[#FFD700]' : 'text-white/20'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={editComment}
                                        onChange={(e) => setEditComment(e.target.value)}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-black dark:text-white outline-none focus:border-walia-primary/30 transition-all resize-none"
                                        rows={3}
                                    />
                                    <div className="flex items-center gap-2">
                                        <button onClick={saveEdit} className="flex-1 py-2 rounded-xl bg-walia-primary text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                                            <Check className="w-3 h-3" /> Save Changes
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className={`w-3.5 h-3.5 ${review.rating >= s ? 'fill-[#FFD700] text-[#FFD700]' : 'text-black/10 dark:text-white/10'}`} />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => startEdit(review)} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-black/30 dark:text-white/30 hover:text-walia-primary transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => deleteReview(review.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-black/30 dark:text-white/30 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-black/70 dark:text-white/70 italic font-medium">"{review.comment}"</p>
                                    <p className="mt-3 text-[9px] text-black/30 dark:text-white/30 font-black uppercase tracking-widest">
                                        {review.createdAt?.toDate().toLocaleDateString() || 'Recently'}
                                    </p>
                                </>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
