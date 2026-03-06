'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface ReviewFormProps {
    onSuccess?: () => void;
}

export default function ReviewForm({ onSuccess }: ReviewFormProps) {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!user) { setError('Please log in to submit a review.'); return; }
        if (rating === 0) { setError('Please select a star rating.'); return; }
        if (text.trim().length < 10) { setError('Please write at least 10 characters.'); return; }

        setLoading(true);
        setError('');
        try {
            await addDoc(collection(db, 'reviews'), {
                userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
                rating,
                comment: text.trim(),
                userId: user.uid,
                createdAt: serverTimestamp(),
            });
            setSuccess(true);
            setRating(0);
            setText('');
            onSuccess?.();
        } catch (err) {
            setError('Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="p-8 rounded-3xl bg-black/5 border border-black/10 text-center">
                <p className="text-sm text-gray-500 font-medium">
                    <a href="/login" className="text-black font-bold underline">Log in</a> to leave a review.
                </p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="p-8 rounded-3xl bg-black border border-black text-center space-y-3">
                <div className="text-4xl">🎉</div>
                <p className="text-white font-bold text-lg">Thank you for your review!</p>
                <p className="text-white/60 text-sm font-medium">It's now live on the homepage.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-2 text-xs font-bold text-white/40 hover:text-white underline"
                >
                    Write another review
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-200 space-y-6">
            <div>
                <h3 className="text-lg font-black text-black mb-1">Rate Your Experience</h3>
                <p className="text-sm text-gray-500">Your review will appear live on the website.</p>
            </div>

            {/* Star picker */}
            <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Your Rating</p>
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-9 h-9 transition-colors ${star <= (hover || rating) ? 'fill-black text-black' : 'fill-gray-200 text-gray-200'
                                    }`}
                            />
                        </button>
                    ))}
                    {rating > 0 && (
                        <span className="ml-2 text-sm font-bold text-black">{rating}/5</span>
                    )}
                </div>
            </div>

            {/* Text */}
            <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Your Review</p>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={300}
                    rows={4}
                    placeholder="Share your experience with Walia..."
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-black outline-none text-sm text-black font-medium placeholder-gray-300 resize-none transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{text.length}/300</p>
            </div>

            {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-black text-white font-bold text-base hover:bg-zinc-800 transition-all hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Submitting...' : 'Publish Review'}
            </button>

            <p className="text-xs text-gray-400 text-center font-medium">
                Submitting as <span className="font-bold text-black">{user.displayName || user.email?.split('@')[0]}</span>
            </p>
        </div>
    );
}
