import './globals.css';
import { Inter } from 'next/font/google';
import { siteMetadata } from '@/lib/metadata';
import { MainLayout } from '@/components/layout/MainLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata = siteMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
