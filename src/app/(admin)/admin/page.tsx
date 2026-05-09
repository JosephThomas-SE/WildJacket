import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-soft backdrop-blur-xl">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-white">Admin Console</h1>
        <p className="text-slate-300">This area is restricted to admin and super_admin users only.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/dashboard" className="rounded-2xl bg-sky-500 px-4 py-2 text-slate-950 transition hover:bg-sky-400">
            Manage dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
