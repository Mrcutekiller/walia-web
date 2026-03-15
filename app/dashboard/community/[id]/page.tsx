'use client';

import { ArrowLeft, CheckCircle2, MessageSquare, MoreHorizontal, PartyPopper, Share2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ExpandedPostPage() {
    return (
        <div className="min-h-screen bg-[#0A101D] text-white p-4 md:p-8 animate-in fade-in duration-500">

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Content Area */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* Back Navigation */}
                    <div className="flex items-center gap-4 mb-2">
                        <Link href="/dashboard/community" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold tracking-tight">Post</h1>
                    </div>

                    {/* The Expanded Post Card */}
                    <article className="w-full bg-[#162032] rounded-[2rem] p-6 md:p-8 shadow-2xl border border-white/5 relative overflow-hidden">

                        {/* Glow effect matching the design */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[100px] pointer-events-none rounded-full" />

                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center overflow-hidden border-2 border-white pointer-events-none select-none shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Alex" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#162032] flex items-center justify-center">
                                        <CheckCircle2 className="w-3 h-3 text-[162032]" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white leading-tight">Alex Carter</h2>
                                    <p className="text-sm font-medium text-white/50">2 hours ago</p>
                                </div>
                            </div>
                            <button className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-white/50 transition-colors">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Post Text */}
                        <p className="text-base md:text-lg text-white/90 leading-relaxed mb-6 font-medium relative z-10">
                            Finally wrapped up the front-end architecture for the new client dashboard! I utilized the new Walia AI tools to generate the unit tests in half the time. Huge shoutout to the community here for the styling tips! 🚀
                        </p>

                        {/* Project Completed Embedded Card */}
                        <div className="w-full rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 p-6 mb-8 flex items-center gap-5 relative z-10 transition-transform hover:scale-[1.01] cursor-pointer">
                            <div className="w-14 h-14 rounded-2xl bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-8 h-8 text-[#162032] fill-current" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight">Project Completed!</h3>
                                <p className="text-sm text-green-400 font-medium mt-1">Milestone unlocked & verified</p>
                            </div>
                        </div>

                        {/* Interaction Bar */}
                        <div className="flex flex-wrap border-t border-white/5 pt-6 gap-3 relative z-10">
                            <button className="flex-1 min-w-[120px] h-12 rounded-xl bg-white/5 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30 border border-transparent transition-all flex items-center justify-center gap-2 font-bold text-sm text-white/70">
                                <PartyPopper className="w-4 h-4" />
                                Celebrate
                            </button>
                            <button className="flex-1 min-w-[120px] h-12 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 font-bold text-sm text-white/70">
                                <MessageSquare className="w-4 h-4" />
                                12 Comments
                            </button>
                            <button className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center shrink-0 text-white/70">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>

                    </article>

                    {/* Comments Section Outline */}
                    <div className="w-full bg-[#162032] rounded-[2rem] p-6 md:p-8 shadow-2xl border border-white/5 mb-10">
                        <h3 className="text-lg font-bold mb-6">Comments</h3>
                        <div className="flex gap-4 mb-8">
                            <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                            <div className="flex-1">
                                <input type="text" placeholder="Write a supportive comment..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/50 transition-colors" />
                            </div>
                        </div>
                        {/* Example Comment */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500 shrink-0" />
                            <div>
                                <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 inline-block">
                                    <h4 className="text-sm font-bold mb-1">Sarah Jenkins</h4>
                                    <p className="text-sm text-white/70">Amazing work Alex! The new tools are super handy.</p>
                                </div>
                                <p className="text-xs text-white/30 mt-2 font-medium px-2">1 hour ago</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Sidebar: Trending */}
                <aside className="lg:col-span-4 hidden lg:flex flex-col gap-6">
                    <div className="w-full bg-[#162032] rounded-[2rem] p-6 shadow-2xl border border-white/5 sticky top-8">

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-bold">Trending Here</h3>
                        </div>

                        <ul className="space-y-5">
                            {[
                                { tag: '#AIUpdates', posts: '2.4k posts', color: 'bg-blue-500' },
                                { tag: '#StudyHacks', posts: '1.8k posts', color: 'bg-purple-500' },
                                { tag: '#FinalsPrep', posts: '950 posts', color: 'bg-orange-500' },
                                { tag: '#WaliaPro', posts: '420 posts', color: 'bg-green-500' }
                            ].map((item, i) => (
                                <li key={i} className="flex flex-col group cursor-pointer">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">{item.tag}</span>
                                    </div>
                                    <span className="text-xs font-medium text-white/40">{item.posts}</span>
                                </li>
                            ))}
                        </ul>

                    </div>
                </aside>

            </div>
        </div>
    );
}
