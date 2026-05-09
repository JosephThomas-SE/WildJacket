import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/types/supabase';

export type PackageRow = Database['public']['Tables']['camp_packages']['Row'];
export type AvailabilityRow = Database['public']['Tables']['availability']['Row'];

export async function getActivePackages() {
  return supabase
    .from<PackageRow>('camp_packages')
    .select('*')
    .eq('is_active', true)
    .order('title', { ascending: true });
}

export async function getPackageBySlug(slug: string) {
  return supabase
    .from<PackageRow>('camp_packages')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
}

export async function getPackageAvailability(packageId: number) {
  return supabase
    .from<AvailabilityRow>('availability')
    .select('*')
    .eq('package_id', packageId)
    .order('available_date', { ascending: true });
}

export async function getAvailabilityByDate(packageId: number, availableDate: string) {
  return supabase
    .from<AvailabilityRow>('availability')
    .select('*')
    .eq('package_id', packageId)
    .eq('available_date', availableDate)
    .maybeSingle();
}
