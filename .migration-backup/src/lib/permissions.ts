import type { Role } from '@/lib/roles';
import { normalizeRole } from '@/lib/roles';

export function hasRole(role: unknown, allowedRoles: Role | Role[] | string | string[]): boolean {
  const normalized = normalizeRole(role);
  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return allowed.some((value) => normalizeRole(value) === normalized);
}

export function requireRole(role: unknown, allowedRoles: Role | Role[] | string | string[]): Role {
  const normalized = normalizeRole(role);

  if (!hasRole(normalized, allowedRoles)) {
    throw new Error('Insufficient permissions');
  }

  return normalized;
}

export function canAccessAdmin(role: unknown): boolean {
  return hasRole(role, ['admin', 'super_admin']);
}

export function canAccessSuperAdmin(role: unknown): boolean {
  return hasRole(role, 'super_admin');
}
