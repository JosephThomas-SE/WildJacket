import { PageShell } from '@/components/layout/PageShell';

export default function DashboardPage() {
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-5xl space-y-6 rounded-[2rem] border border-white/10 bg-slate-900/75 p-8 shadow-soft backdrop-blur-xl">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-white">Secure dashboard</h1>
          <p className="text-slate-300">
            This page is protected with server-side auth and middleware route protection. WildJacket users can access data safely.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
