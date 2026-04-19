'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { db } from '@/lib/firebase';
import { formatTimeAgo } from '@/lib/utils';
import { collection, onSnapshot, orderBy, query, Timestamp, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { ArrowRight, Brain, Calendar, ChevronRight, Download, MessageSquare, Sparkles, Star, Users, Wrench, Zap, Camera, FileText } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// ─── Types ───
interface Review {
  id: string;
  userName: string;
  userPhotoURL?: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

// ─── Scroll reveal hook ───
function useScrollReveal() {
  useEffect(() => {
    let ticking = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once visible to save CPU
                observer.unobserve(entry.target);
              }
            });
            ticking = false;
          });
          ticking = true;
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    // Select elements
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

const features = [
  { icon: Sparkles, label: 'Walia AI', slug: 'ai', desc: 'Chat with GPT-4, Gemini 2.0 & DeepSeek for instant help.' },
  { icon: MessageSquare, label: 'Smart Messages', slug: 'messages', desc: 'Connect with groups, share files, voice notes & media.' },
  { icon: Wrench, label: '12+ Tools', slug: 'tools', desc: 'Summarize, quiz, flashcards, transcription & code assist.' },
  { icon: Calendar, label: 'Calendar', slug: 'calendar', desc: 'AI-powered study schedules with smart reminders.' },
  { icon: Users, label: 'Community', slug: 'community', desc: 'Share AI sessions & notes with the global network.' },
  { icon: Brain, label: 'Smart Notes', slug: 'tools', desc: 'AI-powered note taking, summaries & flashcard generation.' },
];

const tickerItems = [
  'Walia AI', '·', 'Climb Higher', '·', 'Think Smarter', '·', 'Ethiopia', '·',
  'GPT-4', '·', 'Study Tools', '·', 'Community', '·', 'Calendar', '·',
  'Walia AI', '·', 'Climb Higher', '·', 'Think Smarter', '·', 'Ethiopia', '·',
  'GPT-4', '·', 'Study Tools', '·', 'Community', '·', 'Calendar', '·',
];

export default function Home() {
  useScrollReveal();
  const [reviews, setReviews] = useState<Review[]>([]);

  // ─── Live Firestore reviews ───
  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review)));
    });
    return () => unsub();
  }, []);

  // ─── Real-Time Global Stats ───
  const [globalStats, setGlobalStats] = useState({
    students: 0,
    messages: 0,
    downloads: 0,
  });

  useEffect(() => {
    const statsRef = doc(db, 'stats', 'global');
    // Ensure the document exists so it can be incremented
    setDoc(statsRef, {
      students: globalStats.students,
      messages: globalStats.messages,
      downloads: globalStats.downloads
    }, { merge: true }).catch(console.error);

    const unsub = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGlobalStats(prev => ({
          students: data.students || prev.students,
          messages: data.messages || prev.messages,
          downloads: data.downloads || prev.downloads,
        }));
      }
    });

    return () => unsub();
  }, []);

  const handleDownload = async () => {
    try {
      const statsRef = doc(db, 'stats', 'global');
      await updateDoc(statsRef, { downloads: increment(1) });
    } catch (error) {
      console.error("Failed to update download stat", error);
    }
  };

  const LiveCounter = ({ target, label, icon: Icon, prefix = '', suffix = '' }: any) => {
    const [display, setDisplay] = useState(0);
    
    useEffect(() => {
      let start = display;
      if (start === target) return;
      const duration = 1000;
      const steps = 30;
      const step = (target - start) / steps;
      let current = start;
      const timer = setInterval(() => {
        current += step;
        if ((step > 0 && current >= target) || (step < 0 && current <= target)) {
          setDisplay(target);
          clearInterval(timer);
        } else {
          setDisplay(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }, [target]);

    return (
      <div className="flex flex-col relative items-start bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
           <div className="p-2.5 bg-white/10 rounded-xl shadow-inner border border-white/5">
             <Icon className="w-5 h-5 text-white drop-shadow-md" />
           </div>
           <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
        </div>
        <p className="text-4xl font-black text-white tracking-tight">{prefix}{display.toLocaleString()}{suffix}</p>
        <p className="text-xs text-white/60 font-bold uppercase tracking-widest mt-2">{label}</p>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="w-full overflow-hidden bg-white">

        {/* ━━━━━━━━━━ HERO — FULL SCREEN VIDEO BACKGROUND ━━━━━━━━━━ */}
        <section className="relative w-full h-screen min-h-[600px] overflow-hidden">

          {/* ── Full-screen Background Video ── */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="/3d-logo.mp4"
          />

          {/* ── Dark overlay so text is readable ── */}
          <div className="absolute inset-0 bg-black/55" />

          {/* ── Subtle vignette for depth ── */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

          {/* ── Navbar lives on top of the hero ── */}

          {/* ── Content: bottom-left anchored (like the sketch) ── */}
          <div className="absolute bottom-0 left-0 right-0 z-10 container mx-auto px-10 md:px-16 pb-16 md:pb-20">
            <div className="max-w-2xl">

              {/* Badge */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 md:backdrop-blur-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-3 animate-pulse" />
                <span className="text-xs font-bold text-white/80 tracking-wide">v1.0 — Now on Android</span>
              </div>

              {/* Origin line */}
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/50 mb-4">
                From the Mountains of Ethiopia
              </p>

              {/* Big title */}
              <div className="flex items-center gap-6 mb-6">
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] bg-white border border-white/20 flex flex-col items-center justify-center shadow-2xl p-2 shrink-0 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                     <img src="/walia-logo.png" alt="Walia Logo" className="w-[80%] h-[80%] object-contain group-hover:scale-110 transition-transform duration-500 relative z-10" />
                 </div>
                 <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.85]">
                   Walia
                 </h1>
              </div>

              {/* Tagline */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[2px] w-8 bg-white/40 rounded-full" />
                <p className="text-lg md:text-xl font-semibold text-white/80 tracking-wide">
                  Climb Higher. Think Smarter.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-white rounded-2xl hover:bg-white/90 shadow-2xl hover:-translate-y-1 transition-all duration-300 text-base"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="/app-release.apk"
                  download="Walia-Release.apk"
                  onClick={handleDownload}
                  className="group inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-white/10 border border-white/25 rounded-2xl hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 text-base backdrop-blur-sm"
                >
                  <Download className="w-5 h-5 mr-3" />
                  Download APK
                </a>
              </div>
            </div>

            {/* Stats: floating gracefully */}
            <div className="absolute bottom-10 right-10 hidden lg:flex gap-5 z-20">
              <LiveCounter target={globalStats.students} label="Students" icon={Users} suffix="+" />
              <LiveCounter target={globalStats.messages} label="AI Messages" icon={MessageSquare} suffix="+" />
              <LiveCounter target={globalStats.downloads} label="Downloads" icon={Download} suffix="+" />
              
              <div className="flex flex-col relative items-start bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                   <div className="p-2.5 bg-white/10 rounded-xl shadow-inner border border-white/5">
                     <Zap className="w-5 h-5 text-white drop-shadow-md" />
                   </div>
                   <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
                </div>
                <p className="text-4xl font-black text-white tracking-tight">99.9%</p>
                <p className="text-xs text-white/60 font-bold uppercase tracking-widest mt-2">Uptime</p>
              </div>
            </div>
          </div>
        </section>


        {/* ━━━━━━━━━━ TICKER MARQUEE ━━━━━━━━━━ */}
        <div className="w-full overflow-hidden bg-black py-5">
          <div className="flex whitespace-nowrap animate-ticker">
            {tickerItems.map((item, i) => (
              <span key={i} className="text-sm font-black uppercase tracking-[0.25em] text-white/70 px-6">
                {item}
              </span>
            ))}
          </div>
        </div>


        {/* ━━━━━━━━━━ FEATURES SECTION ━━━━━━━━━━ */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
              <div className="space-y-4 reveal">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/5 border border-black/10 text-[10px] font-black uppercase text-black tracking-widest">
                  <Zap className="w-3 h-3 mr-2" /> Features
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-black tracking-tight leading-tight">
                  Everything<br />you need.
                </h2>
              </div>
              <p className="text-base text-gray-500 max-w-sm font-medium leading-relaxed reveal-right">
                From AI chat to community tools, Walia gives you the unfair advantage in your academic journey.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
              {features.map((F, i) => (
                <Link
                  key={i}
                  href={`/features/${F.slug}`}
                  className="group reveal block p-8 rounded-3xl bg-gray-50 border border-gray-200 hover:border-black/25 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden no-underline"
                >
                  <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                    <F.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{F.label}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{F.desc}</p>
                  <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                    Learn More <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>


        {/* ━━━━━━━━━━ AI PREVIEW SECTION ━━━━━━━━━━ */}
        <section className="py-32 bg-black overflow-hidden">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Chat mockup */}
              <div className="reveal-left">
                <div className="p-1 rounded-[32px] bg-white/10">
                  <div className="rounded-[28px] bg-zinc-900 border border-white/10 p-8 space-y-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <Brain className="w-4 h-4 text-white/60" />
                      </div>
                      <div className="flex-1 p-4 rounded-2xl rounded-tl-none bg-zinc-800 border border-white/10">
                        <p className="text-sm text-white/80 font-medium leading-relaxed">
                          What is the difference between Classical and Quantum Physics?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 flex-row-reverse space-x-reverse">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-black" />
                      </div>
                      <div className="flex-1 p-4 rounded-2xl rounded-tr-none bg-white">
                        <p className="text-sm text-black font-medium leading-relaxed">
                          Classical physics describes everyday phenomena (Newtonian mechanics), while quantum physics governs the subatomic world where particles exhibit wave-particle duality...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                      <div className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 border border-white/10 text-xs text-white/30">
                        Ask Walia AI anything...
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-black" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Copy */}
              <div className="space-y-8 reveal-right">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Study with the smartest AI
                  <span className="text-white/30"> in your pocket.</span>
                </h2>
                <p className="text-base text-white/50 font-medium leading-relaxed">
                  Powered by GPT-4, Gemini 2.0, and DeepSeek — get detailed explanations, generate flashcards, and summarize textbooks instantly.
                </p>
                <div className="space-y-4">
                  {['Instant answers from multiple AI models', 'Voice-to-text study notes', 'Photo scan for charts & equations'].map((feat, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-green-400" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-white/70">{feat}</span>
                    </div>
                  ))}
                </div>
                <Link href="/signup" className="inline-flex items-center px-8 py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all hover:-translate-y-1">
                  Try Walia AI Free <ArrowRight className="w-5 h-5 ml-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* ━━━━━━━━━━ TOKEN SYSTEM EXPLORER ━━━━━━━━━━ */}
        <section className="py-32 bg-gray-50 border-y border-gray-200">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16 space-y-4 reveal">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/5 border border-black/10 text-[10px] font-black uppercase text-black tracking-widest">
                <Zap className="w-3 h-3 mr-2" /> Token Economy
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight">
                How tokens work.
              </h2>
              <p className="text-base text-gray-500 max-w-md mx-auto font-medium">
                Free users get <strong className="text-black">100 tokens</strong> daily. Upgrade to Pro for unlimited access.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto stagger">
              {[
                { label: 'AI Chat', cost: 1, desc: 'Per message sent', icon: MessageSquare },
                { label: 'Summarizer', cost: 3, desc: 'Per document/text', icon: FileText },
                { label: 'Image Scanner', cost: 5, desc: 'Per photo analyzed', icon: Camera },
                { label: 'Pro Tools', cost: 2, desc: 'Code, Quiz, Grammar', icon: Wrench },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mb-6">
                    <item.icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-black">{item.label}</h3>
                  <p className="text-sm text-gray-500 font-medium mb-4">{item.desc}</p>
                  <div className="inline-flex items-center px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-black tracking-wider text-black border border-gray-200">
                    🪙 {item.cost} Token{item.cost > 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto mt-12 bg-black text-white p-8 rounded-3xl flex items-center justify-between reveal overflow-hidden relative shadow-2xl">
              <Sparkles className="absolute -right-8 -top-8 w-48 h-48 opacity-10 blur-3xl animate-pulse" />
              <div className="relative z-10 space-y-2">
                <h4 className="text-2xl font-black">Unlimited Learning.</h4>
                <p className="text-white/60 text-sm font-medium">Get Walia Pro and never worry about tokens again.</p>
              </div>
              <Link href="/signup" className="relative z-10 px-6 py-3 bg-white text-black font-bold rounded-xl text-sm hover:bg-white/90 transition-colors shrink-0">
                Upgrade Now
              </Link>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━ LIVE REVIEWS SECTION ━━━━━━━━━━ */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16 space-y-4 reveal">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/5 border border-black/10 text-[10px] font-black uppercase text-black tracking-widest">
                ⭐ Student Reviews
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight">
                Trusted worldwide.
              </h2>
              <p className="text-base text-gray-500 max-w-md mx-auto font-medium">
                Real reviews from Walia users — login to add yours.
              </p>
            </div>

            {reviews.length === 0 ? (
              /* No reviews yet placeholder */
              <div className="text-center py-20 reveal">
                <div className="text-5xl mb-4">💬</div>
                <p className="text-gray-400 font-medium">No reviews yet. Login and be the first!</p>
                <Link href="/login?redirect=review" className="mt-6 inline-flex items-center px-6 py-3 rounded-xl bg-black text-white font-bold hover:-translate-y-1 transition-all">
                  Log in to Review
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="reveal p-8 rounded-3xl bg-gray-50 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                  >
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-[#FFD700] text-[#FFD700]' : 'text-black/10 dark:text-white/10'}`} />
                      ))}
                      <span className="text-xs text-gray-400 ml-2 font-medium">{review.rating}.0</span>
                    </div>
                    {/* Text */}
                    <p className="text-sm text-gray-600 leading-relaxed font-medium mb-6">"{review.comment}"</p>
                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-9 h-9 rounded-full bg-black overflow-hidden flex items-center justify-center shrink-0">
                        {review.userPhotoURL ? (
                          <img src={review.userPhotoURL} alt={review.userName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white text-sm font-black">{review.userName.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-black">{review.userName}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{formatTimeAgo(review.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA to leave a review */}
            <div className="text-center mt-12 reveal">
              <Link
                href="/login?redirect=review"
                className="inline-flex items-center px-8 py-4 rounded-2xl bg-black text-white font-bold hover:bg-zinc-800 transition-all hover:-translate-y-1 shadow-lg"
              >
                <Star className="w-5 h-5 mr-3" />
                Leave Your Review
              </Link>
            </div>
          </div>
        </section>


        {/* ━━━━━━━━━━ CTA SECTION ━━━━━━━━━━ */}
        <section className="py-32 bg-gray-50">
          <div className="container mx-auto px-6 md:px-12">
            <div className="relative max-w-5xl mx-auto p-16 md:p-24 rounded-[48px] bg-black overflow-hidden text-center shadow-2xl shadow-black/15 reveal-scale">
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
              <div className="relative z-10 space-y-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">From the Mountains of Ethiopia</p>
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
                  Climb Higher.<br />Think Smarter.
                </h2>
                <p className="text-lg text-white/50 max-w-lg mx-auto font-medium">
                  Join thousands of students already using Walia to ace their exams.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href="/signup" className="px-10 py-5 rounded-2xl bg-white text-black font-black text-lg hover:bg-white/90 transition-all shadow-xl hover:-translate-y-1">
                    Start Free Today
                  </Link>
                  <a href="/app-release.apk" download="Walia-Release.apk" onClick={handleDownload} className="px-10 py-5 rounded-2xl bg-white/10 border border-white/15 text-white font-bold text-lg hover:bg-white/20 transition-all flex items-center">
                    <Download className="w-5 h-5 mr-3" /> Download APK
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
