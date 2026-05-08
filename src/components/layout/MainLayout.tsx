import type { ReactNode } from 'react';
import { cn } from '@/utils/clsx';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <main className={cn('min-h-screen bg-slate-950 text-slate-100', className)}>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-slate-900 to-transparent opacity-80" />
        {children}
      </div>
    </main>
  );
}
