'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function TermsPage() {
    const sections = [
        {
            title: '1. Acceptance of Terms',
            content: 'By accessing or using the Walia Web and Mobile app, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
        },
        {
            title: '2. Description of Service',
            content: 'Walia provides AI-powered study tools, chat interfaces, and community features. We reserve the right to modify or discontinue any part of the service at any time.',
        },
        {
            title: '3. User Accounts',
            content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.',
        },
        {
            title: '4. Pro Subscription',
            content: 'Our Pro and Lifetime plans provide additional features as described on our Pricing page. Subscriptions are billed in advance and are non-refundable except as required by law.',
        },
        {
            title: '5. Acceptable Use',
            content: 'You agree not to use Walia for any unlawful purpose or to upload content that is harmful, offensive, or violates the rights of others. We reserve the right to terminate accounts that violate these guidelines.',
        },
        {
            title: '6. Limitation of Liability',
            content: 'Walia is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service or any AI-generated content.',
        },
    ];

    return (
        <>
            <Navbar />
            <main className="pt-32 pb-20 bg-[#0A0A18] min-h-screen font-medium">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h1 className="text-5xl font-black text-white mb-6">Terms of Service</h1>
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
                        Walia reserves the right to update these terms at any time. Continued use of the service
                        after such changes constitutes your acceptance of the new terms.
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
