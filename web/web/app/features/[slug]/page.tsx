import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Brain, MessageSquare, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

const featureData: Record<string, {
    title: string;
    subtitle: string;
    description: string;
    icon: any;
    points: string[];
    color: string;
}> = {
    ai: {
        title: 'Walia AI',
        subtitle: 'Your 24/7 AI Study Assistant',
        description: 'Access the world\'s most advanced AI models — GPT-4, Gemini 2.0 Flash, and DeepSeek — all in one place. Get instant, detailed answers to any academic question, generate study materials, and supercharge your learning.',
        icon: Sparkles,
        color: 'bg-black',
        points: [
            'Multi-model AI: GPT-4, Gemini 2.0, DeepSeek',
            'Subject-specific tutoring (Math, Science, Law, Medicine)',
            'Generate flashcards, summaries, and quizzes from any topic',
            'Code assistance for programming students',
            'Voice-to-text queries for hands-free study',
            'Save and revisit all AI conversations',
        ],
    },
    messages: {
        title: 'Smart Messages',
        subtitle: 'Stay Connected with Your Study Network',
        description: 'Chat with classmates, study groups, and tutors via real-time messaging. Share AI-generated content, upload files, record voice notes, and collaborate without ever leaving Walia.',
        icon: MessageSquare,
        color: 'bg-black',
        points: [
            'Real-time 1-to-1 and group chats',
            'Share AI sessions, summaries, and notes directly in chat',
            'Voice messages and file attachments',
            'End-to-end encrypted conversations',
            'Create study group channels',
            'Integrated notification system',
        ],
    },
    tools: {
        title: '12+ Study Tools',
        subtitle: 'A Complete Academic Toolkit',
        description: 'Walia comes with over 12 specialized AI-powered tools designed for every type of student. From text summarization to image scanning and code debugging — your entire academic workflow in one app.',
        icon: Zap,
        color: 'bg-black',
        points: [
            'Text Summarizer — reduce long documents to key points',
            'Flashcard Generator — create study cards from your notes',
            'Quiz Maker — generate MCQ and short-answer tests',
            'Image Scanner — scan textbook pages and equations',
            'Code Assistant — debug and explain code in any language',
            'Translation Tool — study in 50+ languages',
            'Grammar Checker — improve your academic writing',
            'Citation Generator — format references automatically',
        ],
    },
    calendar: {
        title: 'Smart Calendar',
        subtitle: 'AI-Powered Study Planning',
        description: 'Let Walia\'s AI build your optimal study schedule. Input your goals, exams, and available hours — and get a personalized, adaptive timetable that evolves as you make progress.',
        icon: Brain,
        color: 'bg-black',
        points: [
            'AI-generated study schedules based on your goals',
            'Exam countdown timers and reminders',
            'Adaptive rescheduling when you miss a session',
            'Integration with your subject list and tools',
            'Daily, weekly, and monthly views',
            'Sync study sessions with AI chat topics',
        ],
    },
    community: {
        title: 'Community',
        subtitle: 'Learn Together, Grow Together',
        description: 'Join thousands of students on the Walia Community feed. Share your AI study sessions, post notes, ask questions, and collaborate with peers from around the world.',
        icon: Brain,
        color: 'bg-black',
        points: [
            'Public and private study forums',
            'Share AI chat sessions and summaries',
            'Post quizzes and notes for others to use',
            'Real-time discussions on academic topics',
            'Follow top students and educators',
            'Earn badges for helping the community',
        ],
    },
    market: {
        title: 'Market AI',
        subtitle: 'Real-Time Trading Intelligence',
        description: 'Upload screenshots of charts and market data — Walia\'s Market AI analyzes them and provides real-time entry points, take-profit levels, stop-loss recommendations, and market insights powered by cutting-edge AI.',
        icon: Zap,
        color: 'bg-black',
        points: [
            'Upload chart images for instant AI analysis',
            'Get TP1, TP2, TP3, and SL levels automatically',
            'Spot trend direction and momentum signals',
            'Futures and spot market support',
            'Multi-timeframe analysis (M15, H1, H4, D1)',
            'Risk management recommendations',
            'Daily market snapshot and news digest',
        ],
    },
};

const featureOrder = ['ai', 'messages', 'tools', 'calendar', 'community'];

export function generateStaticParams() {
    return featureOrder.map((slug) => ({ slug }));
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const feature = featureData[slug];

    if (!feature) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-white pt-32 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-black text-black mb-4">Feature Not Found</h1>
                        <Link href="/" className="text-gray-500 hover:text-black underline">← Back to Home</Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const Icon = feature.icon;
    const currentIdx = featureOrder.indexOf(slug);
    const prevSlug = currentIdx > 0 ? featureOrder[currentIdx - 1] : null;
    const nextSlug = currentIdx < featureOrder.length - 1 ? featureOrder[currentIdx + 1] : null;

    return (
        <>
            <Navbar />
            <main className="bg-white min-h-screen pt-32 pb-20">
                <div className="container mx-auto px-6 md:px-12">

                    {/* Back */}
                    <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-black transition-colors mb-12 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    {/* Hero */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                        <div className="space-y-8">
                            <div className={`w-20 h-20 ${feature.color} rounded-[28px] flex items-center justify-center shadow-2xl shadow-black/20`}>
                                <Icon className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-3">Walia Feature</p>
                                <h1 className="text-5xl md:text-7xl font-black text-black tracking-tight leading-tight mb-6">{feature.title}</h1>
                                <p className="text-xl text-gray-500 font-medium leading-relaxed">{feature.subtitle}</p>
                            </div>
                        </div>

                        {/* Visual */}
                        <div className="p-10 rounded-[40px] bg-black text-center relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white blur-3xl" />
                            </div>
                            <Icon className="w-32 h-32 text-white/20 mx-auto group-hover:scale-110 transition-transform duration-500" />
                            <p className="text-white/60 font-black text-2xl mt-6">{feature.title}</p>
                            <p className="text-white/30 text-sm mt-2">{feature.subtitle}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="max-w-3xl mb-16">
                        <p className="text-xl text-gray-600 leading-relaxed font-medium">{feature.description}</p>
                    </div>

                    {/* Points */}
                    <div className="mb-24">
                        <h2 className="text-3xl font-black text-black mb-10">What's included</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {feature.points.map((point, i) => (
                                <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:border-black/20 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-gray-700 font-medium leading-relaxed">{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="p-16 rounded-[48px] bg-black text-center relative overflow-hidden">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                        <div className="relative z-10 space-y-6">
                            <h2 className="text-4xl md:text-5xl font-black text-white">Try {feature.title} Today</h2>
                            <p className="text-white/50 max-w-md mx-auto">Join thousands of students already using Walia to study smarter.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/signup" className="px-10 py-4 rounded-2xl bg-white text-black font-black text-lg hover:bg-white/90 transition-all hover:-translate-y-1">
                                    Get Started Free
                                </Link>
                                <Link href="/download" className="px-10 py-4 rounded-2xl bg-white/10 border border-white/15 text-white font-bold text-lg hover:bg-white/20 transition-all">
                                    Download APK
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Prev / Next */}
                    <div className="flex justify-between mt-12">
                        {prevSlug ? (
                            <Link href={`/features/${prevSlug}`} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                {featureData[prevSlug].title}
                            </Link>
                        ) : <div />}
                        {nextSlug && (
                            <Link href={`/features/${nextSlug}`} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors group">
                                {featureData[nextSlug].title}
                                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
