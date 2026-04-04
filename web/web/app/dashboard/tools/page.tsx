'use client';

import { 
    FileText, Layout, Languages, 
    Code, Image as ImageIcon, ArrowRight, Zap, GraduationCap, 
    PenTool, Quote, Sparkles,
    CheckCircle2, Search
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

        <div className="flex-1 overflow-y-auto premium-scrollbar min-h-screen bg-[var(--color-surface)]">
            {/* TopNavBar */}
            <header className="sticky top-0 z-40 bg-[var(--color-surface)]/80 backdrop-blur-xl flex justify-between items-center w-full px-8 py-6 font-[family-name:var(--font-manrope)] font-medium">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-[var(--color-on-surface)]">Tools</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block">
                        <div className="flex items-center bg-[var(--color-surface-container)] px-4 py-2 rounded-full w-64 shadow-[0_0_0_1px_rgba(173,179,180,0.15)]">
                            <Search className="text-[var(--color-outline)] w-4 h-4 mr-2 flex-shrink-0" />
                            <input className="bg-transparent border-none focus:ring-0 text-sm w-full font-[family-name:var(--font-inter)] placeholder:text-[var(--color-outline-variant)] text-[var(--color-on-surface)]" placeholder="Search AI tools..." type="text"/>
                        </div>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <div className="max-w-6xl mx-auto px-8 py-8 lg:py-12">
                {/* Hero Section */}
                <section className="mb-12 lg:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest text-[var(--color-primary)] uppercase mb-3 font-bold">Workspace</p>
                        <h2 className="font-[family-name:var(--font-manrope)] text-4xl lg:text-5xl font-medium tracking-tight text-[var(--color-on-surface)] leading-tight max-w-2xl">
                            AI Utilities for the <br/><span className="text-[var(--color-primary-dim)]">Modern Professional.</span>
                        </h2>
                    </div>

                    {/* Token Badge */}
                    <div className="flex flex-col items-end shrink-0">
                        <div className="flex items-center gap-3 px-5 py-4 rounded-xl shadow-[0_0_0_1px_rgba(173,179,180,0.15)] bg-[var(--color-surface-container-lowest)]">
                            <span className="text-2xl drop-shadow-sm leading-none">🪙</span>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-0.5">Tokens</span>
                                <span className={cn("text-lg font-black tracking-wide leading-none", isPro ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface)]")}>
                                    {tokenDisplay}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mb-8 flex gap-3 overflow-x-auto pb-4 premium-scrollbar">
                    <button className="px-5 py-2 rounded-full bg-[var(--color-on-surface)] text-[var(--color-surface)] text-xs font-bold whitespace-nowrap active:scale-95 transition-transform font-[family-name:var(--font-inter)]">All Tools</button>
                    <button className="px-5 py-2 rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] text-xs font-bold hover:bg-[var(--color-surface-container)] transition-colors whitespace-nowrap active:scale-95 font-[family-name:var(--font-inter)]">Productivity</button>
                    <button className="px-5 py-2 rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] text-xs font-bold hover:bg-[var(--color-surface-container)] transition-colors whitespace-nowrap active:scale-95 font-[family-name:var(--font-inter)]">Creative</button>
                    <button className="px-5 py-2 rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] text-xs font-bold hover:bg-[var(--color-surface-container)] transition-colors whitespace-nowrap active:scale-95 font-[family-name:var(--font-inter)]">Development</button>
                </div>

                {/* Tools Grid (Bento Layout Style) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch pt-2">
                    
                    {/* Featured Tool (Large) - Summarizer (Index 0) */}
                    <div className="lg:col-span-8 bg-[var(--color-surface-container-low)] rounded-3xl p-8 lg:p-10 flex flex-col justify-between group transition-all duration-300">
                        <div>
                            <div className="flex justify-between items-start mb-8 lg:mb-12">
                                <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-container-lowest)] flex items-center justify-center shadow-[0_0_0_1px_rgba(173,179,180,0.15)]">
                                    <FileText className="w-8 h-8 text-[var(--color-primary)]" />
                                </div>
                                <span className="bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">Popular</span>
                            </div>
                            <h3 className="font-[family-name:var(--font-manrope)] text-3xl font-bold mb-4 tracking-tight text-[var(--color-on-surface)]">Document Analyzer</h3>
                            <p className="text-[var(--color-on-surface-variant)] leading-relaxed max-w-md font-[family-name:var(--font-inter)] font-medium">
                                Upload complex legal, technical, or research documents. Extract insights, summarize key findings, and ask natural language questions about your local files.
                            </p>
                        </div>
                        <div className="mt-12 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-container)] shadow-[0_0_0_1px_rgba(173,179,180,0.15)] text-[10px] font-bold text-[var(--color-primary)] flex items-center gap-1.5">
                                    <span className="text-sm shadow-sm leading-none drop-shadow-sm">🪙</span> 3
                                </div>
                            </div>
                            <button onClick={(e) => handleToolClick(e, TOOLS[0])} className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-6 py-3 rounded-xl text-sm font-bold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 font-[family-name:var(--font-manrope)]">
                                Launch Tool <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Small Tool 1 - Quiz Maker (Index 1) */}
                    <div className="lg:col-span-4 bg-[var(--color-surface-container-lowest)] rounded-3xl p-8 shadow-[0_0_0_1px_rgba(173,179,180,0.15)] flex flex-col h-full hover:bg-[var(--color-surface-container-low)] transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center mb-6">
                            <GraduationCap className="w-7 h-7 text-[var(--color-primary)]" />
                        </div>
                        <h3 className="font-[family-name:var(--font-manrope)] text-2xl font-bold mb-3 tracking-tight text-[var(--color-on-surface)]">Knowledge Tester</h3>
                        <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed mb-8 flex-1 font-[family-name:var(--font-inter)] font-medium">
                            Generate interactive multi-format testing modules directly from syllabus data or raw meeting notes.
                        </p>
                        <div className="flex items-center gap-3 w-full">
                            <div className="px-3 py-2 rounded-xl bg-[var(--color-surface-container-high)] text-[11px] font-bold text-[var(--color-on-surface)] flex items-center justify-center gap-1.5 shrink-0">
                                🪙 3
                            </div>
                            <button onClick={(e) => handleToolClick(e, TOOLS[1])} className="flex-1 py-3 bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] text-sm font-bold rounded-xl hover:bg-[var(--color-surface-variant)] transition-colors active:scale-95 font-[family-name:var(--font-manrope)]">Launch</button>
                        </div>
                    </div>

                    {/* Small Tool 2 - Flashcards (Index 2) */}
                    <div className="lg:col-span-4 bg-[var(--color-surface-container-lowest)] rounded-3xl p-8 shadow-[0_0_0_1px_rgba(173,179,180,0.15)] flex flex-col hover:bg-[var(--color-surface-container-low)] transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center mb-6">
                            <Layout className="w-7 h-7 text-[var(--color-primary)]" />
                        </div>
                        <h3 className="font-[family-name:var(--font-manrope)] text-2xl font-bold mb-3 tracking-tight text-[var(--color-on-surface)]">Flashcard Engine</h3>
                        <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed mb-8 flex-1 font-[family-name:var(--font-inter)] font-medium">
                            Synthesize vast amounts of information into spaced-repetition optimized study cards in seconds.
                        </p>
                        <div className="flex items-center gap-3 w-full">
                            <div className="px-3 py-2 rounded-xl bg-[var(--color-surface-container-high)] text-[11px] font-bold text-[var(--color-on-surface)] flex items-center justify-center gap-1.5 shrink-0">
                                🪙 3
                            </div>
                            <button onClick={(e) => handleToolClick(e, TOOLS[2])} className="flex-1 py-3 bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] text-sm font-bold rounded-xl hover:bg-[var(--color-surface-variant)] transition-colors active:scale-95 font-[family-name:var(--font-manrope)]">Launch</button>
                        </div>
                    </div>

                    {/* Medium Tool (Stretched) - Code Assistant (Index 4) */}
                    <div className="lg:col-span-8 bg-[var(--color-surface-container-low)] rounded-3xl p-8 lg:p-10 flex flex-col md:flex-row gap-6 md:gap-10 items-center overflow-hidden">
                        <div className="flex-1 w-full relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container-lowest)] flex items-center justify-center mb-6 shadow-[0_0_0_1px_rgba(173,179,180,0.15)]">
                                <Code className="w-7 h-7 text-[var(--color-primary)]" />
                            </div>
                            <h3 className="font-[family-name:var(--font-manrope)] text-3xl font-bold mb-4 tracking-tight text-[var(--color-on-surface)]">Code Reviewer</h3>
                            <p className="text-[var(--color-on-surface-variant)] text-[15px] leading-relaxed mb-8 max-w-sm font-[family-name:var(--font-inter)] font-medium">
                                Get instant, context-aware feedback on your logic. Identifies security vulnerabilities and structural issues.
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-2.5 rounded-xl bg-[var(--color-surface-container)] text-[11px] font-bold text-[var(--color-on-surface)] flex items-center justify-center gap-1.5 border border-[var(--color-outline)]/10">
                                    🪙 2
                                </div>
                                <button onClick={(e) => handleToolClick(e, TOOLS[4])} className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-6 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95 font-[family-name:var(--font-manrope)] shadow-[0_4px_10px_rgba(0,0,0,0.15)] shadow-[var(--color-primary)]/20">Launch Tool</button>
                            </div>
                        </div>
                        <div className="w-full md:w-64 h-56 bg-[var(--color-inverse-surface)] rounded-2xl overflow-hidden p-6 relative flex-shrink-0">
                            {/* Decorative code visual */}
                            <div className="space-y-3 opacity-80">
                                <div className="h-2 w-3/4 bg-blue-400 rounded"></div>
                                <div className="h-2 w-1/2 bg-yellow-400 rounded ml-4"></div>
                                <div className="h-2 w-5/6 bg-green-400 rounded ml-8"></div>
                                <div className="h-2 w-2/3 bg-white/50 rounded ml-8"></div>
                                <div className="h-2 w-1/4 bg-purple-400 rounded ml-4"></div>
                                <div className="h-2 w-3/4 bg-pink-400 rounded"></div>
                                <div className="h-2 w-1/2 bg-white/20 rounded"></div>
                                <div className="h-2 w-2/3 bg-blue-400 rounded ml-4"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[var(--color-inverse-surface)]/80 to-transparent">
                                <div className="bg-[var(--color-surface-container-lowest)] p-3 px-4 rounded-xl shadow-2xl flex items-center gap-2 border border-green-500/20">
                                    <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />
                                    <span className="text-[11px] font-bold font-[family-name:var(--font-inter)] uppercase tracking-widest text-[var(--color-on-surface)]">Optimized</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Scanner (Index 3) */}
                    <div className="lg:col-span-4 bg-[var(--color-surface-container-lowest)] rounded-3xl p-8 shadow-[0_0_0_1px_rgba(173,179,180,0.15)] flex flex-col hover:bg-[var(--color-surface-container-low)] transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center mb-6">
                            <ImageIcon className="w-7 h-7 text-[var(--color-primary)]" />
                        </div>
                        <h3 className="font-[family-name:var(--font-manrope)] text-2xl font-bold mb-3 tracking-tight text-[var(--color-on-surface)]">Data Extraction</h3>
                        <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed mb-8 flex-1 font-[family-name:var(--font-inter)] font-medium">
                            Convert complex diagrams, handwritten notes, and image data into structured machine-readable formats.
                        </p>
                        <div className="flex items-center gap-3 w-full">
                            <div className="px-3 py-2 rounded-xl bg-[var(--color-surface-container-high)] text-[11px] font-bold text-[var(--color-primary)] flex items-center justify-center gap-1.5 shrink-0 border border-[var(--color-tertiary)]/20">
                                🪙 5
                            </div>
                            <button onClick={(e) => handleToolClick(e, TOOLS[3])} className="flex-1 py-3 bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] text-sm font-bold rounded-xl hover:bg-[var(--color-surface-variant)] transition-colors active:scale-95 font-[family-name:var(--font-manrope)]">Launch</button>
                        </div>
                    </div>
                    
                    {/* Translator (Index 5) */}
                    <div className="lg:col-span-4 bg-[var(--color-surface-container-lowest)] rounded-3xl p-8 shadow-[0_0_0_1px_rgba(173,179,180,0.15)] flex flex-col hover:bg-[var(--color-surface-container-low)] transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center mb-6">
                            <Languages className="w-7 h-7 text-[var(--color-primary)]" />
                        </div>
                        <h3 className="font-[family-name:var(--font-manrope)] text-2xl font-bold mb-3 tracking-tight text-[var(--color-on-surface)]">Localization API</h3>
                        <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed mb-8 flex-1 font-[family-name:var(--font-inter)] font-medium">
                            Professional translation preserving deep cultural nuances and strictly maintaining technical academic terminology.
                        </p>
                        <div className="flex items-center gap-3 w-full">
                            <div className="px-3 py-2 rounded-xl bg-[var(--color-surface-container-high)] text-[11px] font-bold text-[var(--color-on-surface)] flex items-center justify-center gap-1.5 shrink-0">
                                🪙 2
                            </div>
                            <button onClick={(e) => handleToolClick(e, TOOLS[5])} className="flex-1 py-3 bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] text-sm font-bold rounded-xl hover:bg-[var(--color-surface-variant)] transition-colors active:scale-95 font-[family-name:var(--font-manrope)]">Launch</button>
                        </div>
                    </div>
                    
                    {/* Grammar Pro (Index 6) */}
                    <div className="lg:col-span-4 bg-[var(--color-surface-container-lowest)] rounded-3xl p-8 shadow-[0_0_0_1px_rgba(173,179,180,0.15)] flex flex-col hover:bg-[var(--color-surface-container-low)] transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center mb-6">
                            <PenTool className="w-7 h-7 text-[var(--color-primary)]" />
                        </div>
                        <h3 className="font-[family-name:var(--font-manrope)] text-2xl font-bold mb-3 tracking-tight text-[var(--color-on-surface)]">Style Editor</h3>
                        <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed mb-8 flex-1 font-[family-name:var(--font-inter)] font-medium">
                            Rewrite content to match specific academic or professional tones. Eliminates passive voice automatically.
                        </p>
                        <div className="flex items-center gap-3 w-full">
                            <div className="px-3 py-2 rounded-xl bg-[var(--color-surface-container-high)] text-[11px] font-bold text-[var(--color-on-surface)] flex items-center justify-center gap-1.5 shrink-0">
                                🪙 2
                            </div>
                            <button onClick={(e) => handleToolClick(e, TOOLS[6])} className="flex-1 py-3 bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] text-sm font-bold rounded-xl hover:bg-[var(--color-surface-variant)] transition-colors active:scale-95 font-[family-name:var(--font-manrope)]">Launch</button>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <footer className="mt-24 pt-12 border-t border-[var(--color-outline)]/10 flex flex-col md:flex-row justify-between items-center gap-8 px-4">
                    <div>
                        <p className="text-[var(--color-on-surface-variant)] text-sm font-[family-name:var(--font-inter)] font-medium">© {new Date().getFullYear()} Walia AI Systems. All rights reserved.</p>
                    </div>
                    <div className="flex flex-wrap gap-8 text-[var(--color-on-surface-variant)] text-xs font-bold uppercase tracking-widest font-[family-name:var(--font-manrope)]">
                        <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Documentation</a>
                        <a href="#" className="hover:text-[var(--color-primary)] transition-colors">API Keys</a>
                        <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Support</a>
                    </div>
                </footer>
            </div>
        </div>
}
