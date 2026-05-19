import { supabaseBrowser } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

export type CampPackageRow = Database['public']['Tables']['camp_packages']['Row'];
export type AvailabilityRow = Database['public']['Tables']['availability']['Row'];

/**
 * Fetches all active camp packages.
 * Public client query.
 */
export async function getActivePackages(): Promise<CampPackageRow[]> {
  const { data, error } = await supabaseBrowser
    .from('camp_packages')
    .select('*')
    .eq('is_active', true)
    .order('title', { ascending: true });

  if (error) {
    throw new Error(error.message || 'Unable to fetch packages');
  }

  return data as CampPackageRow[];
}

/**
 * Fetches a single package by slug.
 * Public client query.
 */
export async function getPackageBySlug(slug: string): Promise<CampPackageRow | null> {
  const { data, error } = await supabaseBrowser
    .from('camp_packages')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || 'Package not found');
  }

  return data as CampPackageRow | null;
}

/**
 * Fetches availability records for a package.
 * Public client query.
 */
export async function getPackageAvailability(packageId: number): Promise<AvailabilityRow[]> {
  const { data, error } = await supabaseBrowser
    .from('availability')
    .select('*')
    .eq('package_id', packageId)
    .order('available_date', { ascending: true });

  if (error) {
    throw new Error(error.message || 'Unable to fetch availability');
  }

  return data as AvailabilityRow[];
}

/**
 * Fetches a specific availability record by date.
 * Public client query.
 */
export async function getAvailabilityByDate(
  packageId: number,
  availableDate: string,
): Promise<AvailabilityRow | null> {
  const { data, error } = await supabaseBrowser
    .from('availability')
    .select('*')
    .eq('package_id', packageId)
    .eq('available_date', availableDate)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || 'Availability record not found');
  }

  return data as AvailabilityRow | null;
}
