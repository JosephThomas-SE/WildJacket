import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    redirect('/login');
  }

  return <>{children}</>;
}
