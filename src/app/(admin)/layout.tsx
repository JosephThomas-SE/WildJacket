import type { ReactNode } from 'react';
import { requireRole } from '@/lib/supabase/server';
import { ADMIN_ROLES } from '@/lib/roles';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRole(ADMIN_ROLES);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
