'use client';

import { cn } from '@/lib/utils';
import { ArrowRight, ChevronRight, FileText, HelpCircle, Layers, PenTool, Sparkles } from 'lucide-react';
import Link from 'next/link';

const TOOLS = [
    { title: 'Summarize', desc: 'Condense any text to key points', icon: FileText, route: '/dashboard/tools/summarize', emoji: '📄', id: 'summarize' },
    { title: 'Quiz', desc: 'Generate & take practice tests', icon: HelpCircle, route: '/dashboard/tools/quiz', emoji: '🧠', id: 'quiz' },
    { title: 'Flashcards', desc: 'Flip-card studying system', icon: Layers, route: '/dashboard/tools/flashcard', emoji: '🃏', id: 'flashcard' },
    { title: 'Notes', desc: 'Write & organize your ideas', icon: PenTool, route: '/dashboard/tools/notes', emoji: '📝', id: 'notes' },
];

export default function ToolsPage() {
    // Mock counts since web doesn't have studyHistory ported yet
    const counts = { quiz: 12, notes: 34, flashcard: 156, summarize: 8 };

    // Mock recent history
    const recentActivity = [
        { title: 'Cell Biology Notes', tool: 'notes', date: 'Today' },
        { title: 'Calculus Ch 4 Summary', tool: 'summarize', date: 'Yesterday' },
        { title: 'Physics Midterm Prep', tool: 'quiz', date: 'Oct 12' },
    ];

    const getToolIcon = (toolId: string) => {
        const found = TOOLS.find(t => t.id === toolId);
        return found ? { Icon: found.icon } : { Icon: PenTool };
    };

    return (
        <div className="animate-fade-in flex flex-col h-full bg-white dark:bg-[#0A0A18] pb-20 md:pb-10 transition-colors">
            {/* Header Area */}
            <div className="p-8 md:p-12 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800 -mx-4 -mt-4 md:-mx-6 md:-mt-6 lg:-mx-10 lg:-mt-10 mb-8 relative overflow-hidden transition-colors">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 invert dark:opacity-5" />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A18] to-transparent opacity-80" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tight mb-2">Study Tools</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Four powerful AI tools to supercharge your learning journey</p>
                    </div>
                    <Link href="/dashboard/ai" className="inline-flex items-center justify-center gap-2 bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-200 text-white dark:text-black px-6 py-3 rounded-full transition-all group w-fit shadow-lg shadow-black/10">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                        <span className="text-sm font-bold">Ask Walia AI</span>
                    </Link>
                </div>
            </div>

            <div className="px-4 md:px-0">
                {/* Tools Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {TOOLS.map((tool) => (
                        <Link
                            href={tool.route}
                            key={tool.id}
                            className={cn(
                                "group relative overflow-hidden flex flex-col justify-between p-7 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 shadow-sm transition-all hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 active:scale-95 h-[220px]",
                            )}
                        >
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/10 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-white/20 transition-all duration-300">
                                    {tool.emoji}
                                </div>
                                <h3 className="text-lg font-black text-black dark:text-white leading-tight mb-2">{tool.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium line-clamp-2">{tool.desc}</p>
                            </div>

                            <div className="relative z-10 flex items-center justify-between mt-4">
                                <span className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black group-hover:border-black dark:group-hover:border-white transition-colors">
                                    Launch
                                </span>
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-100 dark:border-gray-800 flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black group-hover:border-black dark:group-hover:border-white transition-all">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Recent Activity</h2>
                            <button className="text-xs font-bold text-black dark:text-white hover:underline underline-offset-4">View All</button>
                        </div>
                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-[2rem] shadow-sm overflow-hidden p-3">
                            <div className="space-y-1">
                                {recentActivity.map((item, i) => {
                                    const { Icon } = getToolIcon(item.tool);
                                    return (
                                        <div key={i} className="group flex items-center p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all cursor-pointer">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500 group-hover:bg-white dark:group-hover:bg-zinc-800 group-hover:text-black dark:group-hover:text-white group-hover:border group-hover:border-gray-200 dark:group-hover:border-gray-700 transition-all">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-black dark:text-white truncate">{item.title}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">{item.tool} • {item.date}</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-700 group-hover:translate-x-1 group-hover:text-black dark:group-hover:text-white transition-all" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Stats & Quick Actions */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">Your Impact</h2>
                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm text-center">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { val: counts.quiz, label: 'Quizzes' },
                                    { val: counts.notes, label: 'Notes' },
                                    { val: counts.flashcard, label: 'Cards' },
                                    { val: counts.summarize, label: 'Summaries' }
                                ].map(stat => (
                                    <div key={stat.label} className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                                        <p className="text-2xl font-black text-black dark:text-white mb-1">{stat.val}</p>
                                        <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-6">You're in the top <span className="text-black dark:text-white font-black bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">5%</span> of learners this week!</p>
                                <button className="w-full py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest shadow-lg shadow-black/10 hover:scale-[1.02] hover:bg-zinc-800 dark:hover:bg-gray-200 active:scale-95 transition-all">
                                    View Detailed Stats
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
