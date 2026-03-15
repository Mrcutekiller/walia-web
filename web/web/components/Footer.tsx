import { Facebook, Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const footerLinks = [
    {
        title: 'Product',
        links: [
            { name: 'Download APK', href: '/download' },
            { name: 'AI Hub', href: '/dashboard/ai' },
            { name: 'Tools', href: '/dashboard/tools' },
            { name: 'Pricing', href: '/pricing' },
        ],
    },
    {
        title: 'Company',
        links: [
            { name: 'About Us', href: '/about' },
            { name: 'Contact', href: '/contact' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { name: 'Privacy Policy', href: '/legal/privacy' },
            { name: 'Terms of Service', href: '/legal/terms' },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="w-full bg-black border-t border-white/5 pt-20 pb-10">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center overflow-hidden">
                                <Image src="/walia-logo.png" alt="Walia" width={40} height={40} unoptimized className="object-contain" />
                            </div>
                            <span className="text-3xl font-black tracking-tighter text-white">Walia</span>
                        </Link>
                        <p className="text-white/40 max-w-sm leading-relaxed text-sm">
                            From the Mountains of Ethiopia. Empowering students with AI-powered study tools,
                            real-time collaboration, and a professional workspace. Climb Higher. Think Smarter.
                        </p>
                        <div className="flex items-center space-x-3">
                            {[Facebook, Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-all"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title} className="space-y-6">
                            <h4 className="text-[10px] font-black text-white/50 uppercase tracking-[0.25em]">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-white/40 hover:text-white transition-colors text-sm font-medium"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/20 text-xs font-medium">
                        © {new Date().getFullYear()} Walia AI. Climb Higher. Think Smarter.
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-white/20 font-medium">
                        <span>Status: Operational</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span>v1.0.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
