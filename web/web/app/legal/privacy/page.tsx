'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function PrivacyPage() {
    const sections = [
        {
            title: '1. Information We Collect',
            content: 'We collect information you provide directly to us when you create an account, use our AI tools, or communicate with us. This may include your name, email address, password, and any data you input into our AI modules (such as study notes or chat history).',
        },
        {
            title: '2. How We Use Your Information',
            content: 'We use the information we collect to provide, maintain, and improve our services, including to personalize your experience with our AI models and to send you technical notices, updates, and support messages.',
        },
        {
            title: '3. Data Storage and Security',
            content: 'We use industry-standard security measures to protect your data. Your information is stored securely using Firebase and encrypted during transit. However, no method of transmission over the internet is 100% secure.',
        },
        {
            title: '4. Sharing of Information',
            content: 'We do not sell your personal data. We may share information with third-party service providers (like Firebase or OpenAI) only as necessary to provide our services to you.',
        },
        {
            title: '5. Your Choices',
            content: 'You can access, update, or delete your account information at any time through the app settings. You can also request a copy of the data we have stored about you.',
        },
    ];

    return (
        <>
            <Navbar />
            <main className="pt-32 pb-20 bg-[#0A0A18] min-h-screen font-medium">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h1 className="text-5xl font-black text-white mb-6">Privacy Policy</h1>
                    <p className="text-white/40 mb-12 italic">Last Updated: March 4, 2026</p>

                    <div className="space-y-12">
                        {sections.map((section, i) => (
                            <section key={i} className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                                <p className="text-white/60 leading-relaxed text-lg">
                                    {section.content}
                                </p>
                            </section>
                        ))}
                    </div>

                    <div className="mt-20 p-10 rounded-3xl bg-white/5 border border-white/10 text-white/50 text-sm leading-relaxed">
                        By using Walia, you agree to the collection and use of information in accordance with this policy.
                        If you have any questions about this Privacy Policy, please contact us at support@waliaai.com.
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
