import type { ReactNode } from 'react';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 px-6 py-10 shadow-soft backdrop-blur-xl sm:px-10">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="text-sm leading-6 text-slate-400">{subtitle}</p>
      </div>
      <div className="mt-10">{children}</div>
    </div>
  );
}
