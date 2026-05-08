import type { ReactNode } from 'react';
import { cn } from '@/utils/clsx';

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <section className={cn('relative flex w-full flex-1 flex-col', className)}>
      {children}
    </section>
  );
}
