import { Link } from "wouter";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-soft backdrop-blur-xl">
        <h1 className="text-3xl font-semibold text-white">404 — Page not found</h1>
        <p className="mt-4 text-slate-300">The page you are looking for doesn't exist.</p>
        <div className="mt-6">
          <Link href="/" className="rounded-2xl bg-sky-500 px-4 py-3 text-slate-950 transition hover:bg-sky-400">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
