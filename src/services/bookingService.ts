import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/types/supabase';

export type BookingRow = Database['public']['Tables']['bookings']['Row'];
export type AvailabilityRow = Database['public']['Tables']['availability']['Row'];

export async function getBookingsForUser(userId: string) {
  return supabase
    .from<BookingRow>('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('booked_for_date', { ascending: true });
}

export async function getAvailability(packageId: number, availableDate: string) {
  return supabase
    .from<AvailabilityRow>('availability')
    .select('*')
    .eq('package_id', packageId)
    .eq('available_date', availableDate)
    .maybeSingle();
}

export async function createBooking(params: {
  booking_reference: string;
  user_id: string;
  package_id: number;
  availability_id: number;
  guest_count: number;
  total_amount: number;
  advance_amount: number;
  payment_status: string;
  booking_status: string;
  special_requests?: string | null;
  booked_for_date: string;
}) {
  if (params.guest_count <= 0) {
    throw new Error('guest_count must be greater than zero');
  }

  return supabase.from<BookingRow>('bookings').insert([params]);
}

export async function createAvailability(params: {
  package_id: number;
  available_date: string;
  total_slots: number;
  booked_slots?: number;
}) {
  return supabase
    .from<AvailabilityRow>('availability')
    .insert([{ ...params, booked_slots: params.booked_slots ?? 0 }]);
}
