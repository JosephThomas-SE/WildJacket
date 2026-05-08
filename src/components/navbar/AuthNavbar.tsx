'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function AuthNavbar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-semibold tracking-tight text-white">
          WildJacket
        </Link>

        <nav className="flex items-center gap-3 text-sm text-slate-300">
          <Link href="/dashboard" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-slate-300/30 hover:text-white">
            Dashboard
          </Link>
          {loading ? (
            <span className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-slate-400">Loading...</span>
          ) : user ? (
            <>
              <span className="hidden sm:inline-flex text-slate-200">{user.email}</span>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  router.push('/login');
                }}
                className="rounded-full bg-slate-800 px-4 py-2 text-slate-100 transition hover:bg-slate-700"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-slate-300/30 hover:text-white">
                Login
              </Link>
              <Link href="/signup" className="rounded-full bg-sky-500 px-4 py-2 text-slate-950 transition hover:bg-sky-400">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
