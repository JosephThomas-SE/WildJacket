import { supabaseAdmin } from '@/lib/supabaseClient';
import type { Database } from '@/types/supabase';

export type PackageRow = Database['public']['Tables']['camp_packages']['Row'];
export type BookingRow = Database['public']['Tables']['bookings']['Row'];
export type AvailabilityRow = Database['public']['Tables']['availability']['Row'];

// Server-only admin operations. Import this module only from server actions or API routes.
export async function createPackage(params: {
  title: string;
  slug: string;
  description: string;
  location: string;
  price_per_person: number;
  max_capacity: number;
  is_active?: boolean;
}) {
  return supabaseAdmin.from<PackageRow>('camp_packages').insert([params]);
}

export async function updatePackage(packageId: number, params: Partial<Omit<PackageRow, 'id'>>) {
  return supabaseAdmin
    .from<PackageRow>('camp_packages')
    .update(params)
    .eq('id', packageId);
}

export async function upsertAvailability(params: {
  package_id: number;
  available_date: string;
  total_slots: number;
  booked_slots?: number;
}) {
  return supabaseAdmin
    .from<AvailabilityRow>('availability')
    .upsert([params], { onConflict: ['package_id', 'available_date'] });
}

export async function updateBookingStatus(bookingId: number, updates: {
  payment_status?: string;
  booking_status?: string;
  advance_amount?: number;
  special_requests?: string | null;
}) {
  return supabaseAdmin
    .from<BookingRow>('bookings')
    .update(updates)
    .eq('id', bookingId);
}
