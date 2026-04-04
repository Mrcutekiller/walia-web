'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ReviewPopup() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Logic to show popup: after 30 seconds
        const hasSeen = localStorage.getItem('walia_review_prompt_seen');
        if (hasSeen) return;

        const timer = setTimeout(() => {
            if (user) setIsOpen(true);
        }, 30000);

        const handleManualTrigger = () => setIsOpen(true);
        window.addEventListener('trigger-review-popup', handleManualTrigger);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('trigger-review-popup', handleManualTrigger);
        };
    }, [user]);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('walia_review_prompt_seen', 'true');
    };

    const handleSubmit = async () => {
        if (!user || rating === 0 || text.trim().length < 5) return;

        setLoading(true);
        setError(null);

        // Create a timeout promise
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('TIMEOUT')), 10000)
        );

        try {
            const reviewData = {
                userId: user.id,
                userName: user.name || user.email?.split('@')[0] || 'Anonymous',
                userPhoto: user.photoURL || '',
                rating,
                comment: text.trim(),
                status: 'approved',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            // Race the firestore call against the timeout
            await Promise.race([
                addDoc(collection(db, 'reviews'), reviewData),
                timeout
            ]);

            setSubmitted(true);
            localStorage.setItem('walia_review_prompt_seen', 'true');
            setTimeout(() => handleClose(), 2000);
        } catch (err: any) {
            console.error('Error submitting review:', err);
            if (err.message === 'TIMEOUT') {
                setError('Connection slow. Still trying...');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.9 }}
                    className="fixed bottom-6 right-6 z-[9999] w-full max-w-[380px] p-6 rounded-[32px] bg-black border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                    <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-white/20 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>

                    {!submitted ? (
                        <div className="relative z-10 space-y-5">
                            <div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase text-white/40 tracking-widest mb-3">
                                    ⭐ Feedback Requested
                                </div>
                                <h3 className="text-xl font-black text-white mb-2">Enjoying Walia?</h3>
                                <p className="text-white/40 text-sm font-medium">Your feedback helps thousands of students climb higher.</p>
                            </div>

                            <div className="flex items-center gap-2 py-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="transition-transform active:scale-90"
                                    >
                                        <Star
                                            className={`w-8 h-8 transition-colors ${star <= (hover || rating) ? 'fill-[#FFD700] text-[#FFD700]' : 'fill-white/5 text-white/10'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="What can we improve?..."
                                className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-all resize-none font-medium"
                            />

                            {error && (
                                <p className="text-[10px] font-bold text-red-400 text-center animate-pulse">{error}</p>
                            )}

                            <div className="space-y-3">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || rating === 0 || text.trim().length < 5}
                                    className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-20 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Publishing...</span>
                                        </>
                                    ) : 'Publish Feedback'}
                                </button>

                                <button
                                    onClick={handleClose}
                                    className="w-full text-center text-white/30 hover:text-white/60 text-[10px] font-black uppercase tracking-widest transition-colors py-1"
                                >
                                    Remind me later
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-10 py-10 text-center space-y-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
                            >
                                <Star className="w-8 h-8 fill-green-500 text-green-500" />
                            </motion.div>
                            <h3 className="text-xl font-black text-white">Thank You!</h3>
                            <p className="text-white/40 text-sm font-medium">Your review is now live on the world map.</p>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
