'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

export type CampPackageRow = Database['public']['Tables']['camp_packages']['Row'];
export type BookingRow = Database['public']['Tables']['bookings']['Row'];
export type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
export type AvailabilityRow = Database['public']['Tables']['availability']['Row'];

function getServerSupabase() {
  return createSupabaseServerClient();
}

/**
 * Fetches all user bookings.
 * Uses RLS for user isolation.
 */
export async function getUserBookings(userId: string): Promise<BookingRow[]> {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('booked_for_date', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Unable to fetch bookings');
  }

  return data as BookingRow[];
}

/**
 * Fetches booking details by ID.
 */
export async function getBookingById(bookingId: number): Promise<BookingRow | null> {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || 'Unable to fetch booking');
  }

  return data as BookingRow | null;
}

/**
 * Checks availability for a specific date.
 * Returns available slots after accounting for existing bookings.
 */
export async function checkDateAvailability(
  packageId: number,
  availableDate: string,
): Promise<{ available_slots: number; booked_slots: number } | null> {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('package_id', packageId)
    .eq('available_date', availableDate)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || 'Unable to check availability');
  }

  if (!data) {
    return null;
  }

  return {
    available_slots: data.total_slots - data.booked_slots,
    booked_slots: data.booked_slots,
  };
}

/**
 * Validates booking parameters before creation.
 * Returns validation result with any errors.
 */
export async function validateBooking(
  packageId: number,
  availableDate: string,
  guestCount: number,
): Promise<{ valid: boolean; error?: string }> {
  if (guestCount < 1) {
    return { valid: false, error: 'Guest count must be at least 1' };
  }

  // Check package exists and is active
  const supabase = getServerSupabase();
  const { data: pkg, error: pkgError } = await supabase
    .from('camp_packages')
    .select('id, max_capacity')
    .eq('id', packageId)
    .eq('is_active', true)
    .maybeSingle();

  if (pkgError || !pkg) {
    return { valid: false, error: 'Package not found or inactive' };
  }

  if (guestCount > pkg.max_capacity) {
    return {
      valid: false,
      error: `Guest count exceeds package capacity of ${pkg.max_capacity}`,
    };
  }

  // Check availability
  const availability = await checkDateAvailability(packageId, availableDate);
  if (!availability) {
    return { valid: false, error: 'No availability record for this date' };
  }

  if (guestCount > availability.available_slots) {
    return {
      valid: false,
      error: `Only ${availability.available_slots} slots available for this date`,
    };
  }

  return { valid: true };
}
