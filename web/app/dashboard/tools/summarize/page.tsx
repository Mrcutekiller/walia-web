'use client';

import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
    ArrowLeft,
    Check,
    Copy,
    FileText,
    Loader2,
    RotateCcw,
    Save,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function SummarizePage() {
    const { user } = useAuth();
    const [input, setInput] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [options, setOptions] = useState({
        type: 'bullets', // bullets | paragraph
        length: 'medium', // short | medium | long
    });

    const handleSummarize = async () => {
        if (!input.trim() || loading) return;
        setLoading(true);
        setSummary('');

        const systemPrompt = `You are an expert academic summarizer for Walia AI. 
        Summarize the provided text into a ${options.type === 'bullets' ? 'bulleted list' : 'concise paragraph'}.
        The length should be ${options.length}. 
        Maintain a professional, academic, yet accessible tone. 
        Focus on key arguments, data points, and conclusions.`;

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `Please summarize this text: \n\n${input}`,
                    systemPrompt
                })
            });
            const data = await res.json();
            setSummary(data.reply);
        } catch (error) {
            console.error('Summarization error:', error);
            setSummary('Sorry, I encountered an error while summarizing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setInput('');
        setSummary('');
    };

    return (
        <div className="min-h-full bg-white dark:bg-[#0A0A18] animate-in fade-in pb-20 selection:bg-black selection:text-white transition-colors">
            {/* Header */}
            <header className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#0A0A18]/80 backdrop-blur-md z-20 transition-colors">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/tools" className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-black dark:hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-black dark:text-white flex items-center gap-2">
                            Summarizer
                            <span className="text-[10px] font-black bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 rounded-full uppercase tracking-widest transition-colors">AI tool</span>
                        </h1>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                    <button onClick={handleReset} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                    </button>
                    <button
                        disabled={!summary}
                        className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-bold hover:bg-zinc-800 dark:hover:bg-gray-200 transition-all shadow-lg shadow-black/10 dark:shadow-white/5 disabled:opacity-20 flex items-center gap-2"
                    >
                        <Save className="w-3.5 h-3.5" />
                        Save to Notes
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-6 md:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Input Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Source Text</h2>
                            <div className="flex gap-2">
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600">{input.length} characters</span>
                            </div>
                        </div>

                        <div className="relative group">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Paste your essay, article, or notes here..."
                                className="w-full h-[400px] p-6 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 outline-none text-gray-700 dark:text-gray-300 font-medium leading-relaxed resize-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700 custom-scrollbar"
                            />
                        </div>

                        {/* Options */}
                        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-[2rem] p-6 space-y-6 transition-colors">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Summary Type</label>
                                    <div className="flex p-1 bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-2xl transition-colors">
                                        <button
                                            onClick={() => setOptions({ ...options, type: 'bullets' })}
                                            className={cn(
                                                "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                                                options.type === 'bullets' ? "bg-black dark:bg-white text-white dark:text-black shadow-md" : "text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white"
                                            )}
                                        >
                                            Bullets
                                        </button>
                                        <button
                                            onClick={() => setOptions({ ...options, type: 'paragraph' })}
                                            className={cn(
                                                "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                                                options.type === 'paragraph' ? "bg-black dark:bg-white text-white dark:text-black shadow-md" : "text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white"
                                            )}
                                        >
                                            Paragraph
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Target Length</label>
                                    <div className="flex p-1 bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-2xl transition-colors">
                                        {['short', 'medium', 'long'].map((l) => (
                                            <button
                                                key={l}
                                                onClick={() => setOptions({ ...options, length: l })}
                                                className={cn(
                                                    "flex-1 py-2 text-[10px] font-bold rounded-xl transition-all capitalize",
                                                    options.length === l ? "bg-black dark:bg-white text-white dark:text-black shadow-md" : "text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white"
                                                )}
                                            >
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSummarize}
                                disabled={!input.trim() || loading}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-black dark:bg-white text-white dark:text-black rounded-[1.5rem] font-bold hover:bg-zinc-800 dark:hover:bg-gray-200 transition-all shadow-xl shadow-black/10 dark:shadow-white/5 disabled:opacity-20 active:scale-95 group"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                                        Summarize with AI
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">AI Result</h2>
                            {summary && (
                                <button
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            )}
                        </div>

                        <div className={cn(
                            "w-full h-[530px] rounded-[3rem] border-2 transition-all overflow-hidden relative",
                            summary ? "bg-white dark:bg-white/5 border-black/5 dark:border-white/10 shadow-2xl shadow-black/5 dark:shadow-white/5" : "bg-gray-50 dark:bg-white/5 border-dashed border-gray-200 dark:border-gray-800"
                        )}>
                            {!summary && !loading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 transition-colors">
                                    <div className="w-16 h-16 rounded-[2rem] bg-white dark:bg-white/5 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center mb-6">
                                        <FileText className="w-6 h-6 text-gray-200 dark:text-gray-700" />
                                    </div>
                                    <h3 className="text-lg font-black text-black/20 dark:text-white/20">Empty Result</h3>
                                    <p className="text-xs font-bold text-black/10 dark:text-white/10 max-w-[200px] mt-2 uppercase tracking-tighter">Your AI generated summary will appear here</p>
                                </div>
                            ) : loading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 transition-colors">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-[2rem] bg-black dark:bg-white flex items-center justify-center shadow-2xl animate-bounce">
                                            <Sparkles className="w-8 h-8 text-white dark:text-black" />
                                        </div>
                                        <div className="absolute -inset-4 border-2 border-black/5 dark:border-white/5 border-dashed rounded-[2.5rem] animate-spin-slow" />
                                    </div>
                                    <h3 className="text-lg font-black text-black dark:text-white mt-8">Analyzing Context...</h3>
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-600 mt-2 uppercase tracking-widest animate-pulse">Walia is reading your file</p>
                                </div>
                            ) : (
                                <div className="h-full p-8 overflow-y-auto custom-scrollbar animate-in slide-in-from-right-4 transition-colors">
                                    <div className="prose prose-zinc dark:prose-invert max-w-none">
                                        <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                                            {summary}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile reset/save buttons */}
                        <div className="sm:hidden grid grid-cols-2 gap-4 mt-6">
                            <button onClick={handleReset} className="py-4 border border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-500 font-bold rounded-[1.5rem] text-xs uppercase tracking-widest transition-colors">
                                Reset
                            </button>
                            <button
                                disabled={!summary}
                                className="py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-[1.5rem] text-xs uppercase tracking-widest disabled:opacity-20 shadow-lg shadow-black/10 dark:shadow-white/5 transition-all"
                            >
                                Save Note
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
