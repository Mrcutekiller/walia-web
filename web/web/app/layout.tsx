import { AuthProvider } from '@/context/AuthContext';
import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'Walia - Your AI Study Companion',
  description: 'Download Walia, the ultimate AI companion app with advanced study tools, 1-on-1 AI chat, and a community of learners.',
};

import GoogleTranslate from '@/components/GoogleTranslate';
import ReviewPopup from '@/components/ReviewPopup';
import { NotificationProvider } from '@/context/NotificationContext';
import { ThemeProvider } from '@/context/ThemeContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${manrope.variable} font-sans antialiased transition-colors duration-300 bg-[var(--background)] text-[var(--foreground)] min-h-screen`}>
        <AuthProvider>
          <NotificationProvider>
            <ThemeProvider>
              {children}
              <ReviewPopup />
              <GoogleTranslate />
            </ThemeProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
