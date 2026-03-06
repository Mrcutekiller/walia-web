'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import {
    addDoc,
    collection,
    onSnapshot,
    query,
    serverTimestamp,
    where
} from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ReviewBanner() {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!user) return;

        // Check if user has already reviewed
        const q = query(collection(db, 'reviews'), where('userId', '==', user.uid));
        const unsub = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                // Only show if no review exists
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        });

        return () => unsub();
    }, [user]);

    const submitReview = async () => {
        if (!user || rating === 0) return;
        setSubmitting(true);
        try {
            await addDoc(collection(db, 'reviews'), {
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                userPhoto: user.photoURL || '',
                rating,
                comment,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            setSubmitted(true);
            setTimeout(() => setIsVisible(false), 2000);
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-walia-primary/10 border-b border-walia-primary/20 overflow-hidden relative"
            >
                <div className="max-w-3xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-walia-primary/20 flex items-center justify-center shrink-0">
                            <MessageSquare className="w-5 h-5 text-walia-primary" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white">How is your experience?</h4>
                            <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Your feedback helps Walia grow Higher</p>
                        </div>
                    </div>

                    {!submitted ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        onClick={() => setRating(star)}
                                        className="transition-all hover:scale-125 hover:-rotate-12"
                                    >
                                        <Star
                                            className={`w-5 h-5 ${(hover || rating) >= star
                                                    ? 'fill-walia-primary text-walia-primary'
                                                    : 'text-white/20'
                                                } transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="bg-black/20 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-walia-primary/30 transition-all w-32 md:w-48"
                                />
                                <button
                                    onClick={submitReview}
                                    disabled={rating === 0 || submitting}
                                    className="px-4 py-1.5 rounded-xl bg-walia-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-walia-primary/90 transition-all disabled:opacity-20"
                                >
                                    {submitting ? '...' : 'Review'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2 text-walia-primary font-black text-xs uppercase tracking-[0.2em]"
                        >
                            <span>Thank you for your review! ✓</span>
                        </motion.div>
                    )}

                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
