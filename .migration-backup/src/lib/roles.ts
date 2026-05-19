import type { Session } from '@supabase/supabase-js';

export const ROLES = ['guest', 'admin', 'super_admin'] as const;
export type Role = (typeof ROLES)[number];

export const GUEST_ROLES = ['guest'] as const;
export const ADMIN_ROLES = ['admin', 'super_admin'] as const;
export const SUPER_ADMIN_ROLES = ['super_admin'] as const;

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && ROLES.includes(value as Role);
}

export function normalizeRole(value: unknown): Role {
  return isRole(value) ? value : 'guest';
}

export function getRoleFromSession(session: Session | null | undefined): Role {
  const rawRole = session?.user?.app_metadata?.role ?? session?.user?.user_metadata?.role;
  return normalizeRole(rawRole);
}
