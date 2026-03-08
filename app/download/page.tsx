import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { CheckCircle, Download, QrCode, Smartphone } from 'lucide-react';

export default function DownloadPage() {
    return (
        <>
            <Navbar />
            <main className="bg-white min-h-screen pt-32 pb-24">
                <div className="container mx-auto px-6 md:px-12">

                    {/* Hero */}
                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-400 mb-5">Available Now</p>
                        <h1 className="text-6xl md:text-8xl font-black text-black tracking-tight mb-6">Get Walia</h1>
                        <p className="text-xl text-gray-500 leading-relaxed">
                            Download the official Walia app and carry your AI study workspace everywhere.
                        </p>
                    </div>

                    {/* Main Download Card */}
                    <div className="max-w-5xl mx-auto mb-16">
                        <div className="relative rounded-[48px] bg-black overflow-hidden p-10 md:p-16">
                            {/* Background decoration */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/3 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                {/* Left: info */}
                                <div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 mb-8">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-white/60 text-xs font-black uppercase tracking-widest">v1.0.0 · Stable Release</span>
                                    </div>
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/10">
                                        <Smartphone className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Android APK</h2>
                                    <p className="text-white/40 text-base mb-8 leading-relaxed">The full Walia experience — all AI features, study tools, and community in one app.</p>

                                    <ul className="space-y-3 mb-10">
                                        {[
                                            'Works on Android 8.0 and above',
                                            'All premium AI features included',
                                            'Full offline note access',
                                            'Free to download',
                                        ].map(f => (
                                            <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                                                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <a
                                        href="/app-release.apk"
                                        download="Walia.apk"
                                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-black text-lg hover:bg-white/90 transition-all hover:-translate-y-1 shadow-2xl shadow-white/10 group"
                                    >
                                        <Download className="w-6 h-6 group-hover:animate-bounce" />
                                        Download (.APK)
                                    </a>
                                </div>

                                {/* Right: QR code placeholder */}
                                <div className="flex flex-col items-center gap-6">
                                    <div className="w-48 h-48 rounded-3xl bg-white/10 border-2 border-white/15 flex flex-col items-center justify-center gap-3">
                                        <QrCode className="w-20 h-20 text-white/30" />
                                        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">QR Coming Soon</p>
                                    </div>
                                    <p className="text-white/30 text-xs text-center">
                                        Scan with your phone camera<br />to download instantly
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Other Platforms */}
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
                        <div className="p-8 rounded-3xl border-2 bg-gray-50 border-gray-200 opacity-60">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-gray-100">
                                <Smartphone className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-black mb-2 text-gray-400">iOS / App Store</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">iPhone and iPad support coming to the App Store.</p>
                            <span className="inline-block px-3 py-1.5 rounded-xl bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">Coming Soon</span>
                        </div>
                        <div className="p-8 rounded-3xl border-2 bg-gray-50 border-gray-200 opacity-60">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-gray-100">
                                <Smartphone className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-black mb-2 text-gray-400">Google Play Store</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">Official Play Store listing coming soon. Use the APK above for now.</p>
                            <span className="inline-block px-3 py-1.5 rounded-xl bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">Coming Soon</span>
                        </div>
                    </div>

                    {/* Install Guide */}
                    <div className="max-w-5xl mx-auto">
                        <h3 className="text-3xl font-black text-black mb-10">How to install the APK</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                            {[
                                { n: '01', title: 'Tap Download', desc: 'Click the Download (.APK) button above.' },
                                { n: '02', title: 'Open the File', desc: 'Tap the downloaded file in your notification bar or Downloads folder.' },
                                { n: '03', title: 'Allow Install', desc: 'If prompted, enable "Install from this source" in Settings.' },
                                { n: '04', title: 'Start Learning', desc: 'Tap Install — welcome to Walia! 🎉' },
                            ].map(step => (
                                <div key={step.n} className="p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:border-black/20 hover:shadow-lg transition-all">
                                    <span className="text-4xl font-black text-black/10 mb-3 block">{step.n}</span>
                                    <h4 className="text-base font-black text-black mb-2">{step.title}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
