'use client';

import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
    ArrowLeft,
    Check,
    ChevronRight,
    HelpCircle,
    Loader2,
    Plus,
    RotateCcw,
    Sparkles,
    Trophy,
    X
} from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

interface Question {
    question: string;
    options: string[];
    answer: number; // Index of correct option
    explanation: string;
    type: 'multiple' | 'boolean';
}

export default function QuizPage() {
    const { user } = useAuth();
    const [topic, setTopic] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [gameState, setGameState] = useState<'setup' | 'playing' | 'result'>('setup');
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const generateQuiz = async () => {
        if (!topic.trim() && !image) return;
        setLoading(true);
        setQuestions([]);

        const systemPrompt = `You are an expert academic quiz generator for Walia AI. 
        Create a 5-question quiz. Mix "Multiple Choice" and "True/False" questions.
        Return ONLY a valid JSON array of objects. Each object MUST have:
        "question": string,
        "type": "multiple" or "boolean",
        "options": array of strings (4 for multiple, exactly ["True", "False"] for boolean),
        "answer": number (index of the correct option),
        "explanation": string explaining why that answer is correct.
        
        Topic/Context: ${topic}`;

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: "Generate quiz JSON based on my text and image.",
                    systemPrompt,
                    attachments: image ? [{ type: 'image/jpeg', base64: image }] : []
                })
            });
            const data = await res.json();

            const cleanData = data.reply.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanData);

            if (Array.isArray(parsed)) {
                setQuestions(parsed);
                setGameState('playing');
                setCurrentStep(0);
                setScore(0);
            }
        } catch (error) {
            console.error('Quiz generation error:', error);
            alert('Failed to generate quiz. Make sure the topic or image is clear.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (idx: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(idx);
        setShowExplanation(true);
        if (idx === questions[currentStep].answer) {
            setScore(s => s + 1);
        }
    };

    const nextQuestion = () => {
        setSelectedOption(null);
        setShowExplanation(false);
        if (currentStep < questions.length - 1) {
            setCurrentStep(s => s + 1);
        } else {
            setGameState('result');
        }
    };

    const resetQuiz = () => {
        setGameState('setup');
        setQuestions([]);
        setTopic('');
        setImage(null);
    };

    return (
        <div className="min-h-full bg-white animate-in fade-in pb-20 selection:bg-black selection:text-white">
            <header className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/tools" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-black text-black">Quiz Master Pro</h1>
                </div>
                {gameState !== 'setup' && (
                    <button onClick={resetQuiz} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-black transition-colors flex items-center gap-2">
                        <RotateCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                )}
            </header>

            <main className="max-w-3xl mx-auto p-6 md:p-12">
                {gameState === 'setup' && (
                    <div className="space-y-10 animate-in slide-in-from-bottom-6">
                        <div className="text-center space-y-4">
                            <div className="w-24 h-24 rounded-[3rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto shadow-sm">
                                <Sparkles className="w-10 h-10 text-indigo-500" />
                            </div>
                            <h2 className="text-3xl font-black text-black tracking-tight">AI Quiz Generator</h2>
                            <p className="text-gray-500 font-medium text-sm">Upload a diagram or paste notes to generate mixed T/F & MCQ tests.</p>
                        </div>

                        <div className="space-y-8 bg-gray-50 p-8 md:p-10 rounded-[3.5rem] border border-gray-200 shadow-2xl shadow-black/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Study Material</label>
                                    <textarea
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="Paste text here..."
                                        className="w-full h-48 p-6 rounded-[2rem] bg-white border-2 border-transparent focus:border-black transition-all outline-none text-sm font-medium resize-none placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Visual Context (Optional)</label>
                                    <div
                                        onClick={() => fileRef.current?.click()}
                                        className="h-48 border-2 border-dashed border-gray-200 rounded-[2rem] bg-white hover:border-black transition-all cursor-pointer flex flex-col items-center justify-center p-4 relative overflow-hidden group"
                                    >
                                        <input type="file" ref={fileRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                                        {image ? (
                                            <>
                                                <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform" alt="Preview" />
                                                <div className="relative z-10 flex flex-col items-center gap-1">
                                                    <Check className="w-8 h-8 text-indigo-500" />
                                                    <span className="text-[10px] font-black uppercase text-indigo-500">Image Attached</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-8 h-8 text-gray-200 mb-2 group-hover:scale-110 transition-transform" />
                                                <span className="text-[10px] font-black uppercase text-gray-300">Upload Image / PDF</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={generateQuiz}
                                disabled={(!topic.trim() && !image) || loading}
                                className="w-full py-5 bg-black text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 disabled:opacity-20 flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Generate Practice Test</>}
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'playing' && questions.length > 0 && (
                    <div className="space-y-10 animate-in fade-in">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end px-1">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest">Question {currentStep + 1}</span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {questions[currentStep].type === 'boolean' ? 'TRUE or FALSE' : 'MULTIPLE CHOICE'}
                                    </span>
                                </div>
                                <span className="text-sm font-black text-indigo-500">Score: {score}</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full">
                                <div className="h-full bg-black transition-all duration-500 rounded-full" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }} />
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-[3.5rem] p-10 md:p-16 shadow-2xl shadow-black/5 relative overflow-hidden">
                            <h3 className="text-2xl font-black text-black leading-tight mb-12">{questions[currentStep].question}</h3>

                            <div className={cn(
                                "grid gap-4",
                                questions[currentStep].type === 'boolean' ? "grid-cols-2" : "grid-cols-1"
                            )}>
                                {questions[currentStep].options.map((opt, i) => {
                                    const isCorrect = i === questions[currentStep].answer;
                                    const isSelected = i === selectedOption;
                                    return (
                                        <button
                                            key={i}
                                            disabled={selectedOption !== null}
                                            onClick={() => handleAnswer(i)}
                                            className={cn(
                                                "p-6 rounded-3xl border-2 text-sm font-black transition-all flex items-center justify-between",
                                                selectedOption === null
                                                    ? "bg-gray-50 border-gray-100 hover:border-black hover:bg-white"
                                                    : isCorrect ? "bg-green-50 border-green-500 text-green-700"
                                                        : isSelected ? "bg-red-50 border-red-500 text-red-700" : "bg-white border-transparent opacity-30"
                                            )}
                                        >
                                            {opt}
                                            {selectedOption !== null && (isCorrect ? <Check className="w-5 h-5" /> : isSelected ? <X className="w-5 h-5" /> : null)}
                                        </button>
                                    );
                                })}
                            </div>

                            {showExplanation && (
                                <div className="mt-12 p-8 bg-indigo-50/50 border border-indigo-100/50 rounded-[2.5rem] animate-in slide-in-from-top-4">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Explanation</p>
                                    <p className="text-sm font-medium text-indigo-900 leading-relaxed">{questions[currentStep].explanation}</p>
                                    <button onClick={nextQuestion} className="mt-8 w-full py-5 bg-black text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                        {currentStep === questions.length - 1 ? 'Finish Results' : 'Next Question'} <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="text-center py-20 animate-in slide-in-from-bottom-8">
                        <div className="w-32 h-32 rounded-[3.5rem] bg-black flex items-center justify-center mx-auto mb-10 shadow-2xl">
                            <Trophy className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-4xl font-black mb-4">Practice Finished!</h2>
                        <p className="text-gray-500 font-medium text-lg">You mastered <span className="text-indigo-500 font-black">{score} / {questions.length}</span> questions.</p>
                        <div className="flex gap-4 justify-center mt-12">
                            <button onClick={resetQuiz} className="px-10 py-5 bg-black text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10">Try Again</button>
                            <Link href="/dashboard/tools" className="px-10 py-5 bg-gray-50 border border-gray-200 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-white transition-all">Back to Tools</Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
