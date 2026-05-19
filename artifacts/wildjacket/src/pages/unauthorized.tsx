import { Link } from "wouter";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-soft backdrop-blur-xl">
        <h1 className="text-3xl font-semibold text-white">Unauthorized</h1>
        <p className="mt-4 text-slate-300">You do not have permission to view this page.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/login" className="rounded-2xl bg-sky-500 px-4 py-3 text-slate-950 transition hover:bg-sky-400">
            Login
          </Link>
          <Link href="/" className="rounded-2xl border border-white/10 px-4 py-3 text-slate-200 transition hover:border-slate-300/30">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
