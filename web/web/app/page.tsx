'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { db } from '@/lib/firebase';
import { collection, doc, increment, onSnapshot, orderBy, query, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import {
  ArrowRight, Brain, Calendar, ChevronRight, Download,
  MessageSquare, Sparkles, Star, Users, Wrench, Zap
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface Review {
  id: string;
  userName: string;
  userPhotoURL?: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const features = [
  { icon: Sparkles, label: 'Walia AI', desc: 'Chat with GPT-4, Gemini & DeepSeek for instant help.' },
  { icon: MessageSquare, label: 'Smart Messages', desc: 'Connect with groups, share files, voice notes & media.' },
  { icon: Wrench, label: '12+ Tools', desc: 'Summarize, quiz, flashcards, transcription & code assist.' },
  { icon: Calendar, label: 'Calendar', desc: 'AI-powered schedules with smart reminders.' },
  { icon: Users, label: 'Community', desc: 'Share AI sessions & notes with the global network.' },
  { icon: Brain, label: 'Smart Notes', desc: 'AI-powered note taking, summaries & flashcard generation.' },
];

const MOCKUP_SCREENS = [
  { label: 'AI Chat', icon: Sparkles, color: '#fff', preview: 'Ask Walia AI anything — get instant, accurate answers powered by GPT-4 & Gemini.' },
  { label: 'Messages', icon: MessageSquare, color: '#fff', preview: 'Connect with friends, share media and collaborate in real time.' },
  { label: 'Notes', icon: Brain, color: '#fff', preview: 'Create smart notes with AI summaries, flashcards and quizzes.' },
  { label: 'Calendar', icon: Calendar, color: '#fff', preview: 'Plan your week with AI-generated study schedules and reminders.' },
];

const tickerItems = [
  'Walia AI','·','Climb Higher','·','Think Smarter','·','Next-Gen','·',
  'GPT-4','·','Study Tools','·','Community','·','Calendar','·',
  'Walia AI','·','Climb Higher','·','Think Smarter','·','Next-Gen','·',
  'GPT-4','·','Study Tools','·','Community','·','Calendar','·',
];

export default function Home() {
  useScrollReveal();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeScreen, setActiveScreen] = useState(0);
  const mockupRef = useRef<HTMLDivElement>(null);
  const [globalStats, setGlobalStats] = useState({ students: 0, messages: 0, downloads: 0 });

  // Live reviews
  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review))));
  }, []);

  // Global stats
  useEffect(() => {
    const ref = doc(db, 'stats', 'global');
    setDoc(ref, { students: 0, messages: 0, downloads: 0 }, { merge: true }).catch(() => {});
    return onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setGlobalStats({ students: d.students || 0, messages: d.messages || 0, downloads: d.downloads || 0 });
      }
    });
  }, []);

  // Scroll-based mockup switcher
  useEffect(() => {
    const el = mockupRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let i = 0;
        const interval = setInterval(() => {
          i = (i + 1) % MOCKUP_SCREENS.length;
          setActiveScreen(i);
          if (i === MOCKUP_SCREENS.length - 1) clearInterval(interval);
        }, 1800);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleDownload = async () => {
    try { await updateDoc(doc(db, 'stats', 'global'), { downloads: increment(1) }); } catch {}
  };

  const LiveCounter = ({ target, label, icon: Icon, suffix = '' }: { target: number; label: string; icon: React.ElementType; suffix?: string }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
      if (display === target) return;
      const steps = 30; const step = (target - display) / steps; let cur = display;
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { setDisplay(target); clearInterval(t); }
        else setDisplay(Math.floor(cur));
      }, 1000 / steps);
      return () => clearInterval(t);
    }, [target]);
    return (
      <div className="flex flex-col items-start bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-white/10 rounded-xl border border-white/5"><Icon className="w-5 h-5 text-white" /></div>
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
        </div>
        <p className="text-4xl font-black text-white tracking-tight">{display.toLocaleString()}{suffix}</p>
        <p className="text-xs text-white/60 font-bold uppercase tracking-widest mt-2">{label}</p>
      </div>
    );
  };

  const screen = MOCKUP_SCREENS[activeScreen];
  const ScreenIcon = screen.icon;

  return (
    <>
      <Navbar />
      <main className="w-full overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">

        {/* ━━━━ HERO — FULLSCREEN VIDEO ━━━━ */}
        <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" src="/hero-video.mp4" />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.15)_0%,transparent_50%)]" />

          <div className="absolute bottom-0 left-0 right-0 z-10 container mx-auto px-10 md:px-16 pb-16 md:pb-24">
            <div className="max-w-3xl animate-fade-in-up">
            <div className="max-w-3xl animate-fade-in-up pt-12">
              <div className="flex items-center gap-8 mb-8">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-[40px] bg-white border-2 border-white/30 flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.3)] p-3 shrink-0 hover:scale-105 transition-transform duration-500">
                  <img src="/logo.png" alt="Walia Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] animate-fade-in-up delay-100 uppercase mb-4">
                    Climb<br />Higher.
                  </h1>
                  <p className="text-xl md:text-2xl font-semibold text-white/60 mb-8 max-w-lg animate-fade-in-up delay-200 leading-relaxed">
                    The ultimate AI ecosystem for students. Smart tools, real-time collaboration, and a community built for your success.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-5 animate-fade-in-up delay-400">
                <Link href="/signup" className="group inline-flex items-center justify-center px-10 py-5 font-black text-black bg-white rounded-3xl hover:bg-white/95 shadow-2xl hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(255,255,255,0.4)] transition-all duration-300">
                  Get Started Free <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
                <a href="/app-release.apk" download="Walia-Release.apk" onClick={handleDownload}
                  className="group inline-flex items-center justify-center px-10 py-5 font-bold text-white bg-white/10 border-2 border-white/30 rounded-3xl hover:bg-white/20 hover:-translate-y-1 hover:border-white/50 transition-all duration-300 backdrop-blur-md">
                  <Download className="w-5 h-5 mr-3" /> Download APK
                </a>
              </div>
            </div>

            {/* Floating stats */}
            <div className="absolute bottom-12 right-12 hidden lg:flex gap-6 z-20">
              <LiveCounter target={globalStats.students} label="Users" icon={Users} suffix="+" />
              <LiveCounter target={globalStats.downloads} label="Downloads" icon={Download} suffix="+" />
              <LiveCounter target={globalStats.messages} label="AI Messages" icon={MessageSquare} suffix="+" />
            </div>
          </div>
        </section>

        {/* ━━━━ TICKER ━━━━ */}
        <div className="relative w-full overflow-hidden bg-black py-6 border-y border-white/5">
          <div className="flex animate-ticker whitespace-nowrap">
            {tickerItems.concat(tickerItems).map((item, i) => (
              <span key={i} className={`text-[10px] font-black uppercase tracking-[0.4em] mx-8 ${item === '·' ? 'text-white/20' : 'text-white/60'}`}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ━━━━ FEATURES ━━━━ */}
        <section className="py-32 bg-[var(--background)] transition-colors duration-500">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-24 gap-8">
              <div className="space-y-5 reveal">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/5 border border-black/10 text-[10px] font-black uppercase text-black tracking-widest">
                  <Zap className="w-3 h-3 mr-2" /> Ecosystem
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-black tracking-tight leading-[0.95]">Powerful<br />by design.</h2>
              </div>
              <p className="text-lg text-gray-500 max-w-md font-medium leading-relaxed reveal-right">
                Integrated tools that work together to give you the ultimate advantage.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
              {features.map((F, i) => (
                <div key={i} className="reveal group block p-10 rounded-[2.5rem] bg-[var(--background)] border border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
                  <div className="w-16 h-16 rounded-3xl bg-black flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3">
                    <F.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-4">{F.label}</h3>
                  <p className="text-base text-gray-500 leading-relaxed font-medium">{F.desc}</p>
                  <div className="mt-8 flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                    Learn More <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━━ INTERACTIVE PHONE MOCKUP ━━━━ */}
        <section className="py-32 bg-gray-50 dark:bg-black/40 overflow-hidden transition-colors duration-500" ref={mockupRef}>
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16 reveal">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase text-white/50 tracking-widest mb-4">
                <Sparkles className="w-3 h-3 mr-2" /> Live Preview
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">See it in action.</h2>
            </div>
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Phone mockup */}
              <div className="flex justify-center reveal-left">
                <div className="relative w-[280px]">
                  {/* Phone frame */}
                  <div className="relative bg-zinc-900 rounded-[44px] border-4 border-white/10 shadow-2xl overflow-hidden" style={{ aspectRatio: '9/19' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-b-2xl z-10" />
                    {/* Screen content */}
                    <div className="absolute inset-0 flex flex-col bg-black p-6 pt-10 transition-all duration-700">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
                          <ScreenIcon className="w-4 h-4 text-black" />
                        </div>
                        <span className="text-white font-bold text-sm">{screen.label}</span>
                      </div>
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                          <p className="text-white/60 text-xs leading-relaxed">{screen.preview}</p>
                        </div>
                        {activeScreen === 0 && (
                          <>
                            <div className="bg-white rounded-2xl p-3 self-end max-w-[80%]">
                              <p className="text-black text-xs">What is quantum computing?</p>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-3 self-start max-w-[90%]">
                              <p className="text-white/80 text-xs">Quantum computing uses quantum bits (qubits) that can exist in multiple states simultaneously...</p>
                            </div>
                          </>
                        )}
                        {activeScreen === 1 && (
                          <>
                            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/10">
                              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">A</div>
                              <div><p className="text-white text-xs font-bold">Alex M.</p><p className="text-white/40 text-[10px]">Hey, saw your note 👋</p></div>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/10">
                              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">S</div>
                              <div><p className="text-white text-xs font-bold">Study Group</p><p className="text-white/40 text-[10px]">5 new messages</p></div>
                            </div>
                          </>
                        )}
                        {activeScreen === 2 && (
                          <>
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                              <p className="text-white text-xs font-bold mb-1">Physics Notes</p>
                              <p className="text-white/40 text-[10px]">Newton's 3 Laws of Motion...</p>
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1 py-2 rounded-xl bg-white text-black text-[10px] font-bold text-center">Summarize</div>
                              <div className="flex-1 py-2 rounded-xl bg-white/10 text-white text-[10px] font-bold text-center border border-white/10">Quiz Me</div>
                            </div>
                          </>
                        )}
                        {activeScreen === 3 && (
                          <>
                            <div className="grid grid-cols-7 gap-1">
                              {['M','T','W','T','F','S','S'].map((d, i) => (
                                <div key={i} className="text-center text-white/30 text-[9px] font-bold">{d}</div>
                              ))}
                              {Array.from({length:28},(_,i)=>i+1).map((d) => (
                                <div key={d} className={`text-center text-[10px] rounded-lg py-1 ${d===15?'bg-white text-black font-bold':'text-white/50'}`}>{d}</div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Screen selector */}
              <div className="space-y-4 reveal-right">
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-8">
                  One app.<br /><span className="text-white/30">Every tool.</span>
                </h3>
                {MOCKUP_SCREENS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <button key={i} onClick={() => setActiveScreen(i)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left ${activeScreen === i ? 'bg-white border-white text-black' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeScreen === i ? 'bg-black' : 'bg-white/10'}`}>
                        <Icon className={`w-5 h-5 ${activeScreen === i ? 'text-white' : 'text-white/60'}`} />
                      </div>
                      <span className="font-bold text-sm">{s.label}</span>
                      {activeScreen === i && <div className="ml-auto w-2 h-2 rounded-full bg-black animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ━━━━ CTA ━━━━ */}
        <section className="py-40 bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1)_0%,transparent_70%)]" />
          <div className="container mx-auto px-6 md:px-12 text-center reveal-scale relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mb-8">Ready to evolve?</p>
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-[0.9] mb-8 uppercase">
              Join the<br />Walia Herd.
            </h2>
            <p className="text-xl text-white/40 max-w-lg mx-auto mb-12 font-medium">Be part of the next generation of intelligent students.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/signup" className="px-12 py-6 rounded-3xl bg-white text-black font-black text-lg hover:bg-white/95 transition-all shadow-2xl hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(255,255,255,0.3)]">
                Get Started Free
              </Link>
              <a href="/app-release.apk" download onClick={handleDownload} className="px-12 py-6 rounded-3xl bg-white/10 border-2 border-white/20 text-white font-bold text-lg hover:bg-white/20 hover:border-white/40 transition-all flex items-center">
                <Download className="w-5 h-5 mr-3" /> Download APK
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

function CountUp({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (val === target) return;
    const steps = 40; const step = (target - val) / steps; let cur = val;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(cur));
    }, 30);
    return () => clearInterval(t);
  }, [target]);
  return <p className="text-5xl font-black tracking-tight">{val.toLocaleString()}+</p>;
}
