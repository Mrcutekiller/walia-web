'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import {
  BarChart2, Bot, Code2, ExternalLink, Globe, Instagram,
  Send, Shield, TrendingUp, Users, Zap
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale')
      .forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function CountUp({ target, suffix = '' }: { target: number | string; suffix?: string }) {
  const [val, setVal] = useState(0);
  const isNum = typeof target === 'number';
  useEffect(() => {
    if (!isNum) return;
    const t = target as number;
    const steps = 40; let cur = 0; const step = t / steps;
    const timer = setInterval(() => {
      cur += step;
      if (cur >= t) { setVal(t); clearInterval(timer); }
      else setVal(Math.floor(cur));
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{isNum ? val.toLocaleString() : target}{suffix}</span>;
}

const skills = [
  { icon: TrendingUp, label: 'Trading', desc: 'XAUUSD · Forex · Technical Analysis', level: 90 },
  { icon: Bot, label: 'AI Development', desc: 'GPT-4 · Gemini · LLM Integration', level: 92 },
  { icon: Code2, label: 'Web & App Dev', desc: 'React · Next.js · React Native', level: 88 },
  { icon: BarChart2, label: 'Data & Strategy', desc: 'Market research · Product strategy', level: 85 },
];

const stats = [
  { label: 'Active Users', value: 50000, suffix: '+', icon: Users },
  { label: 'Countries', value: '45', suffix: '+', icon: Globe },
  { label: 'Uptime', value: '99.9', suffix: '%', icon: Shield },
  { label: 'AI Chats/day', value: 10000, suffix: '+', icon: Zap },
];

export default function AboutPage() {
  useReveal();
  const [inView, setInView] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-white text-black overflow-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.04)_0%,_transparent_70%)]" />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 80px,rgba(255,255,255,0.3) 80px,rgba(255,255,255,0.3) 81px),repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(255,255,255,0.3) 80px,rgba(255,255,255,0.3) 81px)' }} />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" /> About Walia
          </div>
          <h1 className="text-[clamp(3rem,9vw,8rem)] font-black leading-[0.88] tracking-tight text-white mb-8 animate-fade-in-up delay-100">
            Built by<br />
            <span className="text-white/20">one person.</span>
          </h1>
          <p className="text-white/40 text-lg font-medium max-w-xl mx-auto animate-fade-in-up delay-200">
            Walia is an AI platform built by a trader, developer, and visionary from Ethiopia — designed to give everyone the tools they need to succeed.
          </p>
          <div className="mt-12 w-px h-20 bg-gradient-to-b from-white/20 to-transparent mx-auto animate-fade-in-up delay-300" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-24 bg-black border-t border-white/5" ref={statsRef}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="reveal p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1">
              <s.icon className="w-6 h-6 text-white/30 mb-4" />
              <p className="text-4xl font-black text-white tracking-tight">
                {inView ? <CountUp target={typeof s.value === 'number' ? s.value : 0} suffix={s.suffix} /> : `0${s.suffix}`}
              </p>
              <p className="text-xs text-white/30 font-bold uppercase tracking-widest mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOUNDER ── */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20 reveal">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30">The Founder</span>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mt-4">Meet Mrcute</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Photo */}
            <div className="reveal-left flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-[40px] overflow-hidden border border-black/10 shadow-2xl">
                  <Image src="/biruk-founder.png" alt="Mrcute — Founder of Walia" width={320} height={320} className="object-cover w-full h-full" unoptimized />
                </div>
                <div className="absolute -bottom-5 -right-5 bg-black text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                  Founder & CEO
                </div>
                <div className="absolute -top-5 -left-5 bg-white border border-black/10 px-4 py-2 rounded-2xl text-xs font-black shadow-lg flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5" /> XAUUSD Trader
                </div>
              </div>
            </div>
            {/* Bio */}
            <div className="reveal-right space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30">Visionary</span>
                <h3 className="text-4xl font-black mt-2">Mrcute</h3>
              </div>
              <p className="text-gray-500 leading-relaxed text-base">
                A self-taught trader and developer from Ethiopia. Mrcute specializes in XAUUSD gold trading and built Walia from scratch — combining his passion for AI, financial markets, and technology to create a platform that empowers everyone.
              </p>
              <p className="text-gray-500 leading-relaxed text-base">
                From trading charts to writing code, Mrcute believes that knowledge — whether in markets or AI — should be accessible to everyone, everywhere.
              </p>
              {/* Skills */}
              <div className="space-y-4 pt-4">
                {skills.map((sk, i) => (
                  <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-black/20 hover:bg-gray-50 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shrink-0">
                      <sk.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm text-black">{sk.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{sk.desc}</p>
                    </div>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
                      <div className="h-full bg-black rounded-full transition-all duration-1000" style={{ width: `${sk.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Social */}
              <div className="flex gap-4 pt-4">
                <a href="https://t.me/Mrcute_killer" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-all hover:-translate-y-0.5">
                  <Send className="w-4 h-4" /> Telegram
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 text-black text-sm font-bold hover:bg-gray-200 transition-all hover:-translate-y-0.5">
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-32 bg-black">
        <div className="max-w-6xl mx-auto px-6 text-center reveal-scale">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Our Mission</span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight mt-6 mb-8 leading-tight">
            Climb Higher.<br /><span className="text-white/20">Think Smarter.</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            Walia exists to make AI tools, smart learning, and community — available to everyone, not just the privileged few. Built in Addis Ababa. Scaling globally.
          </p>
          <div className="mt-12 flex justify-center gap-8">
            <a href="https://t.me/Mrcute_killer" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold">
              <ExternalLink className="w-4 h-4" /> Telegram Community
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
