'use client';

import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Loader2,
    RotateCcw,
    Sparkles,
    Trophy
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Flashcard {
    front: string;
    back: string;
}

export default function FlashcardsPage() {
    const { user } = useAuth();
    const [topic, setTopic] = useState('');
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState(false);
    const [gameState, setGameState] = useState<'setup' | 'studying' | 'complete'>('setup');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const generateCards = async () => {
        if (!topic.trim() || loading) return;
        setLoading(true);
        setCards([]);

        const systemPrompt = `You are an expert academic flashcard generator for Walia AI. 
        Create 10 high-quality flashcards on the provided topic or text.
        Return ONLY a valid JSON array of objects. Each object MUST have:
        "front": string (The question or term),
        "back": string (The concise definition or answer).
        
        Topic/Text: ${topic}`;

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: "Generate flashcard JSON.",
                    systemPrompt
                })
            });
            const data = await res.json();
            const cleanData = data.reply.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanData);

            if (Array.isArray(parsed)) {
                setCards(parsed);
                setGameState('studying');
                setCurrentIndex(0);
                setIsFlipped(false);
            }
        } catch (error) {
            console.error('Flashcard error:', error);
            alert('Failed to generate cards.');
        } finally {
            setLoading(false);
        }
    };

    const nextCard = () => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(c => c + 1), 150);
        } else {
            setGameState('complete');
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(c => c - 1), 150);
        }
    };

    return (
        <div className="min-h-full bg-white animate-in fade-in pb-20 selection:bg-black selection:text-white">
            <header className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/tools" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-black text-black">Flashcards</h1>
                </div>
                {gameState !== 'setup' && (
                    <button onClick={() => setGameState('setup')} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-black transition-colors flex items-center gap-2">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                    </button>
                )}
            </header>

            <main className="max-w-4xl mx-auto p-6 md:p-12">
                {gameState === 'setup' && (
                    <div className="space-y-10 animate-in slide-in-from-bottom-6 text-center">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto text-4xl shadow-sm">
                            🃏
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-black tracking-tight">AI Memory Cards</h2>
                            <p className="text-gray-500 font-medium text-sm max-w-sm mx-auto">Tell me what you're studying, and I'll build a deck of active recall cards for you.</p>
                        </div>
                        <div className="max-w-md mx-auto space-y-4">
                            <textarea
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. Mitosis Phases, Periodic Table, or 18th Century Literature..."
                                className="w-full h-32 p-6 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white outline-none text-gray-700 font-medium transition-all resize-none placeholder:text-gray-300"
                            />
                            <button
                                onClick={generateCards}
                                disabled={!topic.trim() || loading}
                                className="w-full py-5 bg-black text-white rounded-[2rem] font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 disabled:opacity-20 flex items-center justify-center gap-3 group"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5 group-hover:animate-pulse" /> Generate 10 Cards</>}
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'studying' && cards.length > 0 && (
                    <div className="space-y-12 animate-in fade-in">
                        {/* Status */}
                        <div className="flex items-center justify-between max-w-lg mx-auto px-4">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Deck: {topic.slice(0, 15)}...</span>
                            <span className="text-sm font-black text-black">{currentIndex + 1} / {cards.length}</span>
                        </div>

                        {/* Flashcard Component */}
                        <div
                            className="perspective-1000 w-full max-w-lg mx-auto h-[400px] cursor-pointer group"
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            <div className={cn(
                                "relative w-full h-full transition-all duration-700 preserve-3d shadow-2xl shadow-black/5 rounded-[3rem]",
                                isFlipped ? "rotate-y-180" : ""
                            )}>
                                {/* Front */}
                                <div className="absolute inset-0 backface-hidden bg-white border border-zinc-100 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest absolute top-8">Question</span>
                                    <h3 className="text-2xl font-black text-black leading-tight">{cards[currentIndex].front}</h3>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest absolute bottom-8 opacity-0 group-hover:opacity-100 transition-opacity">Click to Reveal Answer</p>
                                </div>
                                {/* Back */}
                                <div className="absolute inset-0 backface-hidden bg-zinc-950 border border-zinc-800 text-white rounded-[3rem] p-12 flex flex-col items-center justify-center text-center rotate-y-180">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest absolute top-8">Answer</span>
                                    <p className="text-lg font-bold leading-relaxed">{cards[currentIndex].back}</p>
                                    <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest absolute bottom-8">Click to Hide</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-center gap-6">
                            <button
                                onClick={(e) => { e.stopPropagation(); prevCard(); }}
                                disabled={currentIndex === 0}
                                className="w-14 h-14 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-all disabled:opacity-20"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextCard(); }}
                                className="h-14 px-8 rounded-full bg-black text-white font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-lg shadow-black/10"
                            >
                                {currentIndex === cards.length - 1 ? 'Finish Deck' : 'Next Card'}
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'complete' && (
                    <div className="text-center py-10 space-y-10 animate-in slide-in-from-bottom-8">
                        <div className="w-32 h-32 rounded-[3.5rem] bg-black flex items-center justify-center mx-auto text-5xl shadow-2xl">
                            <Trophy className="w-12 h-12 text-white" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-black">Deck Mastered!</h2>
                            <p className="text-gray-500 font-medium">You've successfully reviewed all <span className="text-black font-black">{cards.length}</span> cards.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <button onClick={() => setGameState('setup')} className="px-8 py-5 bg-black text-white rounded-[2rem] font-bold text-sm hover:bg-zinc-800 transition-all min-w-[200px]">New Deck</button>
                            <Link href="/dashboard/tools" className="px-8 py-5 bg-gray-50 text-black border border-gray-200 rounded-[2rem] font-bold text-sm hover:bg-white transition-all min-w-[200px]">Back to Tools</Link>
                        </div>
                    </div>
                )}
            </main>

            <style jsx global>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .animate-spin-slow { animation: spin 8s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
