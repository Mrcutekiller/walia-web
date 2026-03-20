'use client';

import { 
    FileText, Layout, Languages, 
    Code, Image as ImageIcon, ArrowRight, Zap, GraduationCap, 
    PenTool, Quote, Sparkles,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTokens } from '@/context/TokenContext';
import { useRouter } from 'next/navigation';

interface Tool {
    id: 'summarizer'|'quiz_maker'|'flashcards'|'image_scanner'|'code_assistant'|'translator'|'grammar_pro'|'citations';
    title: string;
    desc: string;
    icon: any;
    color: string;
    href: string;
}

const TOOLS: Tool[] = [
    {
        id: 'summarizer',
        title: 'Summarizer',
        desc: 'Condense long articles and textbooks.',
        icon: FileText,
        color: 'bg-blue-500/10 text-blue-500',
        href: '/dashboard/ai?mode=summarizer'
    },
    {
        id: 'quiz_maker',
        title: 'Quiz Maker',
        desc: 'Generate MCQs and tests from notes.',
        icon: GraduationCap,
        color: 'bg-emerald-500/10 text-emerald-500',
        href: '/dashboard/ai?mode=quiz'
    },
    {
        id: 'flashcards',
        title: 'Flashcards',
        desc: 'AI-generated study card sets.',
        icon: Layout,
        color: 'bg-amber-500/10 text-amber-500',
        href: '/dashboard/ai?mode=flashcards'
    },
    {
        id: 'image_scanner',
        title: 'Image Scanner',
        desc: 'Extract text and equations from photos.',
        icon: ImageIcon,
        color: 'bg-purple-500/10 text-purple-500',
        href: '/dashboard/ai?mode=scanner'
    },
    {
        id: 'code_assistant',
        title: 'Code Assistant',
        desc: 'Debug and explain coding logic.',
        icon: Code,
        color: 'bg-indigo-500/10 text-indigo-500',
        href: '/dashboard/ai?mode=code'
    },
    {
        id: 'translator',
        title: 'Translator',
        desc: 'Academic translation in 50+ languages.',
        icon: Languages,
        color: 'bg-rose-500/10 text-rose-500',
        href: '/dashboard/ai?mode=translate'
    },
    {
        id: 'grammar_pro',
        title: 'Grammar Pro',
        desc: 'Refine your academic writing.',
        icon: PenTool,
        color: 'bg-cyan-500/10 text-cyan-500',
        href: '/dashboard/ai?mode=grammar'
    },
    {
        id: 'citations',
        title: 'Citations',
        desc: 'Generate APA/MLA references.',
        icon: Quote,
        color: 'bg-orange-500/10 text-orange-500',
        href: '/dashboard/ai?mode=cite'
    }
];

export default function ToolsPage() {
    const { tokenDisplay, consumeTokens, isPro } = useTokens();
    const router = useRouter();

    const handleToolClick = (e: React.MouseEvent, tool: Tool) => {
        e.preventDefault();
        if (consumeTokens(tool.id)) {
            router.push(tool.href);
        } else {
            alert('🪙 Out of tokens! Upgrade to Pro for unlimited usage.');
        }
    };

    return (
        <div className="min-h-full bg-white dark:bg-[#0A101D] p-6 lg:p-10 space-y-12">
            
            {/* Header section w/ Token badge */}
            <div className="max-w-4xl flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pt-4">
                <div>
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase text-black dark:text-white tracking-widest mb-4">
                        <Zap className="w-3 h-3 mr-2" /> Academic Toolkit
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-black dark:text-white tracking-tight leading-tight">
                        Smart Tools for<br />Modern Students.
                    </h1>
                </div>
                {/* Token Badge */}
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#162032] border border-gray-100 dark:border-white/10">
                    <span className="text-xl">🪙</span>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Daily Tokens</p>
                        <span className={cn("text-lg font-black tracking-wide", isPro ? "text-walia-primary" : "text-black dark:text-white")}>
                            {tokenDisplay}
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-lg leading-relaxed pb-4">
                Access our full suite of AI-powered study aids. Each tool consumes a specific number of tokens.
            </p>

            {/* Tools Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TOOLS.map((tool, i) => {
                    const Icon = tool.icon;
                    return (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <button 
                                onClick={(e) => handleToolClick(e, tool as Tool)}
                                className="group w-full text-left block h-full p-8 rounded-[32px] bg-[#FAFAFA] dark:bg-[#162032] border border-gray-100 dark:border-white/5 hover:border-black/10 dark:hover:border-white/20 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden"
                            >
                                <div className={cn("inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-6 transition-transform group-hover:scale-110", tool.color)}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-black text-black dark:text-white mb-3">{tool.title}</h3>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed">{tool.desc}</p>
                                
                                <div className="mt-8 flex items-center justify-between">
                                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                                        Open Tool <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <div className="px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 text-[10px] font-bold text-gray-500">
                                        🪙 {(tool.id === 'summarizer' || tool.id === 'quiz_maker' || tool.id === 'flashcards') ? '3' : tool.id === 'image_scanner' ? '5' : '2'}
                                    </div>
                                </div>
                                
                                {/* Subtle background glow */}
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-current opacity-[0.02] blur-2xl group-hover:opacity-[0.05] transition-opacity" />
                            </button>
                        </motion.div>
                    );
                })}
            </section>

            {/* Action Card */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="relative p-10 lg:p-16 rounded-[48px] bg-black text-white overflow-hidden group shadow-2xl shadow-black/20">
                    <Sparkles className="absolute -right-8 -top-8 w-64 h-64 opacity-10 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                                Want a specialized tool for your curriculum?
                            </h2>
                            <p className="text-white/50 font-medium max-w-md">
                                Suggest a new study tool and if our team builds it, you get 1 year of Walia Pro for free.
                            </p>
                            <button className="px-8 py-4 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                                Submit Idea
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-white/20" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
