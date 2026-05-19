export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 min-h-screen bg-slate-950 text-slate-100">
      <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-soft backdrop-blur-xl">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-white">Admin Dashboard</h1>
          <p className="text-slate-300">Super admin and admin users can safely manage platform settings here.</p>
        </div>
      </div>
    </div>
  );
}
