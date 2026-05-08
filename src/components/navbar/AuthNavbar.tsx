'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../ui/Button';

export function AuthNavbar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 glass border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-luxury text-xl font-bold tracking-tight hover:text-forest-600 transition-colors duration-200">
          WildJacket
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link href="/dashboard" className="rounded-full px-4 py-2 text-forest-700 dark:text-forest-300 hover:bg-forest-100 dark:hover:bg-forest-900/30 transition-colors duration-200">
            Dashboard
          </Link>
          <Link href="/bookings" className="rounded-full px-4 py-2 text-forest-700 dark:text-forest-300 hover:bg-forest-100 dark:hover:bg-forest-900/30 transition-colors duration-200">
            Bookings
          </Link>
          {loading ? (
            <span className="inline-flex items-center rounded-full px-4 py-2 text-earth-600 dark:text-earth-400">Loading...</span>
          ) : user ? (
            <>
              <span className="hidden sm:inline-flex text-earth-700 dark:text-earth-300">{user.email}</span>
              <Button
                variant="glass"
                size="sm"
                onClick={async () => {
                  await signOut();
                  router.push('/login');
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 text-forest-700 dark:text-forest-300 hover:bg-forest-100 dark:hover:bg-forest-900/30 transition-colors duration-200">
                Login
              </Link>
              <Button variant="primary" size="sm" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
