'use client';

import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
    ArrowLeft,
    Check,
    ChevronRight,
    HelpCircle,
    Loader2,
    Play,
    RotateCcw,
    Sparkles,
    Trophy,
    X
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Question {
    question: string;
    options: string[];
    answer: number; // Index of correct option
    explanation: string;
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

    const generateQuiz = async () => {
        if (!topic.trim() || loading) return;
        setLoading(true);
        setQuestions([]);

        const systemPrompt = `You are an expert academic quiz generator for Walia AI. 
        Create a 5-question multiple choice quiz on the provided topic or text.
        Return ONLY a valid JSON array of objects. Each object MUST have:
        "question": string,
        "options": array of 4 strings,
        "answer": number (0-3 index of the correct option),
        "explanation": string explaining why that answer is correct.
        
        Topic/Text: ${topic}`;

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: "Generate quiz JSON.",
                    systemPrompt
                })
            });
            const data = await res.json();

            // Basic JSON cleaning in case AI wraps it in markdown blocks
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
            alert('Failed to generate quiz. Make sure the topic is clear.');
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
    };

    return (
        <div className="min-h-full bg-white animate-in fade-in pb-20 selection:bg-black selection:text-white">
            {/* Header */}
            <header className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/tools" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-black text-black flex items-center gap-2">
                        Quiz Maker
                        <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Interactive</span>
                    </h1>
                </div>
                {gameState !== 'setup' && (
                    <button onClick={resetQuiz} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-black transition-colors flex items-center gap-2">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Exit Quiz
                    </button>
                )}
            </header>

            <main className="max-w-3xl mx-auto p-6 md:p-12">

                {gameState === 'setup' && (
                    <div className="space-y-10 animate-in slide-in-from-bottom-6">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto text-4xl shadow-sm">
                                🧠
                            </div>
                            <h2 className="text-3xl font-black text-black tracking-tight">Generate custom quizzes</h2>
                            <p className="text-gray-500 font-medium text-sm max-w-sm mx-auto">Paste a topic or study material, and I'll create a challenging test for you.</p>
                        </div>

                        <div className="space-y-6 bg-gray-50 p-8 rounded-[3rem] border border-gray-200 shadow-xl shadow-black/5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quiz Topic or Material</label>
                                <textarea
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g. Plate Tectonics, The Great Gatsby Plot, or paste your lecture notes..."
                                    className="w-full h-40 p-6 rounded-[2rem] bg-white border-2 border-transparent focus:border-black outline-none text-gray-700 font-medium transition-all resize-none placeholder:text-gray-300"
                                />
                            </div>

                            <button
                                onClick={generateQuiz}
                                disabled={!topic.trim() || loading}
                                className="w-full py-5 bg-black text-white rounded-[2rem] font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 disabled:opacity-20 flex items-center justify-center gap-3 group"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                                        Generate 5 Questions
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'playing' && questions.length > 0 && (
                    <div className="space-y-8 animate-in fade-in">
                        {/* Progress Bar */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-end px-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Question {currentStep + 1} of {questions.length}</span>
                                <span className="text-sm font-black text-black">Score: {score}</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-black transition-all duration-500 rounded-full"
                                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Question Card */}
                        <div className="bg-white border border-gray-200 rounded-[3rem] p-10 shadow-2xl shadow-black/5 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-[100px] -z-0" />

                            <h3 className="text-2xl font-black text-black leading-tight mb-10 relative z-10">{questions[currentStep].question}</h3>

                            <div className="space-y-4 relative z-10">
                                {questions[currentStep].options.map((opt, i) => {
                                    const isCorrect = i === questions[currentStep].answer;
                                    const isSelected = i === selectedOption;

                                    return (
                                        <button
                                            key={i}
                                            disabled={selectedOption !== null}
                                            onClick={() => handleAnswer(i)}
                                            className={cn(
                                                "w-full p-5 rounded-2xl border-2 text-left text-sm font-bold transition-all flex items-center justify-between group",
                                                selectedOption === null
                                                    ? "bg-gray-50 border-gray-100 hover:border-black hover:bg-white"
                                                    : isCorrect
                                                        ? "bg-green-50 border-green-500 text-green-700"
                                                        : isSelected
                                                            ? "bg-red-50 border-red-500 text-red-700"
                                                            : "bg-white border-transparent opacity-40"
                                            )}
                                        >
                                            <span className="flex-1 pr-4">{opt}</span>
                                            {selectedOption !== null && (
                                                <div className="shrink-0">
                                                    {isCorrect ? <Check className="w-5 h-5" /> : isSelected ? <X className="w-5 h-5" /> : null}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {showExplanation && (
                                <div className="mt-8 p-6 bg-zinc-50 rounded-3xl animate-in slide-in-from-top-2">
                                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <HelpCircle className="w-3.5 h-3.5" />
                                        Explanation
                                    </p>
                                    <p className="text-sm font-medium text-zinc-700 leading-relaxed">{questions[currentStep].explanation}</p>

                                    <button
                                        onClick={nextQuestion}
                                        className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:zinc-800 transition-all"
                                    >
                                        {currentStep === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="text-center py-10 space-y-10 animate-in slide-in-from-bottom-8">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 rounded-[3.5rem] bg-black border-[8px] border-zinc-100 flex items-center justify-center mx-auto text-5xl shadow-2xl">
                                <Trophy className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 bg-zinc-100 text-black text-xs font-black px-3 py-1.5 rounded-full border-4 border-white">
                                {Math.round((score / questions.length) * 100)}%
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-black">Quiz Completed!</h2>
                            <p className="text-gray-500 font-medium">You got <span className="text-black font-black">{score}</span> out of <span className="text-black font-black">{questions.length}</span> questions correct.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <button
                                onClick={resetQuiz}
                                className="px-8 py-5 bg-black text-white rounded-[2rem] font-bold text-sm hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 min-w-[200px]"
                            >
                                <Play className="w-4 h-4" />
                                Try Another
                            </button>
                            <Link
                                href="/dashboard/tools"
                                className="px-8 py-5 bg-gray-50 text-black border border-gray-200 rounded-[2rem] font-bold text-sm hover:bg-white transition-all min-w-[200px]"
                            >
                                Back to Tools
                            </Link>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
