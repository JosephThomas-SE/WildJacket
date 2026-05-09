'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error }: ErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="rounded-[1.5rem] border border-red-500/10 bg-slate-900/90 p-8 text-center shadow-soft backdrop-blur-xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-rose-400">Something went wrong</p>
        <p className="mt-4 text-lg font-semibold text-white">{error?.message ?? 'Unexpected error encountered.'}</p>
      </div>
    </div>
  );
}
