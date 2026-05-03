'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { AlertCircle, CheckCircle2, Mail, MessageSquare, Send, User } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading'); setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-4 block">Get In Touch</span>
            <h1 className="text-6xl md:text-8xl font-black text-black tracking-tight mb-6">Contact Us</h1>
            <p className="text-gray-500 text-lg max-w-md mx-auto">Have a question, idea, or just want to say hi? We'd love to hear from you.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Info */}
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-black text-white relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-4">Let's talk.</h2>
                  <p className="text-white/50 text-sm leading-relaxed mb-8">We're always here to help. Whether it's a bug, feedback, or a partnership — reach out.</p>
                  <div className="space-y-4">
                    {[
                      { icon: Mail, label: 'Email', value: 'support@walia.ai' },
                      { icon: MessageSquare, label: 'Telegram', value: '@Mrcute_killer' },
                    ].map((c, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <c.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{c.label}</p>
                          <p className="text-sm font-bold text-white mt-0.5">{c.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                <h3 className="text-xl font-black mb-3">Response Time</h3>
                <p className="text-gray-500 text-sm leading-relaxed">We typically respond within <strong className="text-black">24 hours</strong>. For urgent issues, join our Telegram community for faster support.</p>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 md:p-10 rounded-3xl border border-gray-100 bg-white shadow-xl shadow-black/5">
              {status === 'success' ? (
                <div className="flex flex-col items-center text-center py-12 gap-4">
                  <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black">Message sent!</h3>
                  <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setStatus('idle')} className="mt-4 px-6 py-3 rounded-2xl bg-black text-white font-bold text-sm hover:bg-zinc-800 transition-all">
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Send a message</h2>
                    <p className="text-gray-400 text-sm">All fields are required.</p>
                  </div>

                  {status === 'error' && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                    </div>
                  )}

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                      <input
                        type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5 outline-none text-sm font-medium text-black placeholder:text-gray-300 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                      <input
                        type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5 outline-none text-sm font-medium text-black placeholder:text-gray-300 transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Message</label>
                    <textarea
                      required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us what's on your mind..."
                      className="w-full px-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5 outline-none text-sm font-medium text-black placeholder:text-gray-300 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit" disabled={status === 'loading'}
                    className="w-full py-4 rounded-2xl bg-black text-white font-black text-sm flex items-center justify-center gap-3 hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-black/10"
                  >
                    {status === 'loading'
                      ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
