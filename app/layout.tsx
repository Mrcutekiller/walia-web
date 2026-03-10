import { AuthProvider } from '@/context/AuthContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en">
      <body className={`${inter.className} bg-white dark:bg-[#0A0A18] text-black dark:text-white antialiased transition-colors duration-300`}>
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
