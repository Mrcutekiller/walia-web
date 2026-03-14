import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Shield, Target, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const values = [
    { icon: Target, title: 'Our Vision', desc: 'To become the global standard for AI-assisted learning and professional research.' },
    { icon: Zap, title: 'High Performance', desc: "Every tool in Walia is optimized for speed and accuracy, powered by the world's best LLMs." },
    { icon: Users, title: 'Community Driven', desc: 'We build features based on what students actually need, through direct feedback and collaboration.' },
    { icon: Shield, title: 'Privacy First', desc: 'Your data is yours. We use encryption and follow strict safe AI practices to protect your work.' },
];

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main className="pt-32 pb-20 bg-white min-h-screen">
                <div className="container mx-auto px-6 md:px-12">

                    {/* Header */}
                    <div className="max-w-3xl mb-24">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4">From the Mountains of Ethiopia</p>
                        <h1 className="text-6xl md:text-8xl font-black text-black tracking-tight mb-8 leading-tight">
                            Our Mission
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed max-w-2xl">
                            Walia was born from a simple idea: that students deserve a powerful, AI-driven operating system
                            for their academic life. We combine cutting-edge technology with human-centric design to create
                            the ultimate productivity experience.
                        </p>
                    </div>

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
                        {values.map((item, i) => (
                            <div key={i} className="group p-10 rounded-3xl bg-gray-50 border border-gray-200 hover:border-black/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                                <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                                    <item.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-black mb-4">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Founders Section */}
                    <div className="mt-28 mb-24">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4">
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-3">The Builders</p>
                                <h2 className="text-5xl md:text-6xl font-black text-black tracking-tight">Meet the<br />Founders</h2>
                            </div>
                            <p className="text-gray-400 text-sm max-w-xs leading-relaxed font-medium">
                                Two CS students from Ethiopia on a mission to give every student access to world-class AI tools.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    name: 'Biruk Fikru',
                                    nickname: 'mrcute',
                                    role: 'Founder & Developer',
                                    quote: '"Every Ethiopian student deserves the best tools in the world."',
                                    photo: '/biruk-founder.png',
                                    photoBg: 'bg-gradient-to-br from-green-900 to-black',
                                    photoFit: 'object-cover',
                                    bio: 'Computer Science student and the visionary behind Walia. Built the entire platform from scratch, driven by the belief that technology can level the playing field for students everywhere.',
                                    tags: ['Developer', 'CS Student', 'Ethiopia'],
                                },
                                {
                                    name: 'Brekat Ahmed',
                                    nickname: 'beki waker',
                                    role: 'CEO & Product Lead',
                                    quote: '"Our goal is simple: make Walia the #1 study companion in Africa."',
                                    photo: '/walia-logo.png',
                                    photoBg: 'bg-gradient-to-br from-zinc-900 to-black',
                                    photoFit: 'object-contain p-6',
                                    bio: 'Computer Science student leading Walia\'s product strategy, growth, and direction. Passionate about making education more accessible and intelligent through AI.',
                                    tags: ['CEO', 'CS Student', 'Vision'],
                                },
                            ].map((person, i) => (
                                <div key={i} className="group rounded-[32px] bg-gray-50 border border-gray-200 overflow-hidden hover:border-black/20 hover:shadow-2xl transition-all duration-700">
                                    {/* Photo banner */}
                                    <div className={`relative h-52 ${person.photoBg} overflow-hidden`}>
                                        <Image
                                            src={person.photo}
                                            alt={person.name}
                                            fill
                                            className={`transition-transform duration-700 group-hover:scale-105 ${person.photoFit}`}
                                        />
                                        {/* Gradient overlay at bottom */}
                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                                        {/* Role badge overlay */}
                                        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                                            <div>
                                                <span className="block text-white/50 text-[10px] font-black uppercase tracking-[0.3em] mb-0.5">{person.role}</span>
                                                <h3 className="text-2xl font-black text-white tracking-tight">{person.name}</h3>
                                            </div>
                                            <span className="px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-white/70 text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
                                                @{person.nickname}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-7">
                                        {/* Quote */}
                                        <p className="text-sm italic text-gray-500 border-l-2 border-black/20 pl-4 mb-5 leading-relaxed">{person.quote}</p>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-5">{person.bio}</p>
                                        {/* Tags */}
                                        <div className="flex gap-2 flex-wrap">
                                            {person.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Story Section */}
                    <div className="rounded-[48px] bg-black p-12 md:p-20 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                                Built for the next generation of thinkers.
                            </h2>
                            <p className="text-white/50 text-lg leading-relaxed mb-10">
                                Whether you're a high-school student preparing for exams or a researcher documenting your
                                findings, Walia provides the tools you need to excel. Our team is committed to continuous
                                innovation, ensuring you always have the smartest assistant by your side.
                            </p>
                            <Link href="/signup" className="inline-flex items-center px-10 py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all hover:-translate-y-1 shadow-lg">
                                Join the Movement
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
