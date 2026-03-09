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
        <div className="min-h-full bg-white animate-in fade-in pb-20 selection:bg-black selection:text-white">
            {/* Header */}
            <header className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/tools" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-black flex items-center gap-2">
                            Summarizer
                            <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest">AI tool</span>
                        </h1>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                    <button onClick={handleReset} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-black transition-colors flex items-center gap-2">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                    </button>
                    <button
                        disabled={!summary}
                        className="px-6 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-black/10 disabled:opacity-20 flex items-center gap-2"
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
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Source Text</h2>
                            <div className="flex gap-2">
                                <span className="text-[10px] font-bold text-gray-400">{input.length} characters</span>
                            </div>
                        </div>

                        <div className="relative group">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Paste your essay, article, or notes here..."
                                className="w-full h-[400px] p-6 rounded-[2.5rem] bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white outline-none text-gray-700 font-medium leading-relaxed resize-none transition-all placeholder:text-gray-300 custom-scrollbar"
                            />
                        </div>

                        {/* Options */}
                        <div className="bg-gray-50 border border-gray-200 rounded-[2rem] p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Summary Type</label>
                                    <div className="flex p-1 bg-white border border-gray-100 rounded-2xl">
                                        <button
                                            onClick={() => setOptions({ ...options, type: 'bullets' })}
                                            className={cn(
                                                "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                                                options.type === 'bullets' ? "bg-black text-white shadow-md" : "text-gray-400 hover:text-black"
                                            )}
                                        >
                                            Bullets
                                        </button>
                                        <button
                                            onClick={() => setOptions({ ...options, type: 'paragraph' })}
                                            className={cn(
                                                "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                                                options.type === 'paragraph' ? "bg-black text-white shadow-md" : "text-gray-400 hover:text-black"
                                            )}
                                        >
                                            Paragraph
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Length</label>
                                    <div className="flex p-1 bg-white border border-gray-100 rounded-2xl">
                                        {['short', 'medium', 'long'].map((l) => (
                                            <button
                                                key={l}
                                                onClick={() => setOptions({ ...options, length: l })}
                                                className={cn(
                                                    "flex-1 py-2 text-[10px] font-bold rounded-xl transition-all capitalize",
                                                    options.length === l ? "bg-black text-white shadow-md" : "text-gray-400 hover:text-black"
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
                                className="w-full flex items-center justify-center gap-3 py-4 bg-black text-white rounded-[1.5rem] font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 disabled:opacity-20 active:scale-95 group"
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
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">AI Result</h2>
                            {summary && (
                                <button
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-black flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            )}
                        </div>

                        <div className={cn(
                            "w-full h-[530px] rounded-[3rem] border-2 transition-all overflow-hidden relative",
                            summary ? "bg-white border-black/5 shadow-2xl shadow-black/5" : "bg-gray-50 border-dashed border-gray-200"
                        )}>
                            {!summary && !loading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                                    <div className="w-16 h-16 rounded-[2rem] bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                                        <FileText className="w-6 h-6 text-gray-200" />
                                    </div>
                                    <h3 className="text-lg font-black text-black/20">Empty Result</h3>
                                    <p className="text-xs font-bold text-black/10 max-w-[200px] mt-2 uppercase tracking-tighter">Your AI generated summary will appear here</p>
                                </div>
                            ) : loading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 bg-white/50 backdrop-blur-sm z-10">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-[2rem] bg-black flex items-center justify-center shadow-2xl animate-bounce">
                                            <Sparkles className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="absolute -inset-4 border-2 border-black/5 border-dashed rounded-[2.5rem] animate-spin-slow" />
                                    </div>
                                    <h3 className="text-lg font-black text-black mt-8">Analyzing Context...</h3>
                                    <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest animate-pulse">Walia is reading your file</p>
                                </div>
                            ) : (
                                <div className="h-full p-8 overflow-y-auto custom-scrollbar animate-in slide-in-from-right-4">
                                    <div className="prose prose-zinc max-w-none">
                                        <div className="whitespace-pre-wrap text-gray-700 font-medium leading-relaxed">
                                            {summary}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile reset/save buttons */}
                        <div className="sm:hidden grid grid-cols-2 gap-4 mt-6">
                            <button onClick={handleReset} className="py-4 border border-gray-200 text-gray-400 font-bold rounded-[1.5rem] text-xs uppercase tracking-widest">
                                Reset
                            </button>
                            <button
                                disabled={!summary}
                                className="py-4 bg-black text-white font-bold rounded-[1.5rem] text-xs uppercase tracking-widest disabled:opacity-20 shadow-lg shadow-black/10"
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
