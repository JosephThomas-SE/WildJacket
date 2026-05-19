import type { Metadata } from 'next';

export const siteMetadata: Metadata = {
  title: 'WildJacket',
  description: 'A production-ready Next.js app foundation with TypeScript, Tailwind, and Supabase.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'WildJacket',
    description: 'A production-ready Next.js app foundation with TypeScript, Tailwind, and Supabase.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};
