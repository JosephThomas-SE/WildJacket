'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

export type CampPackageRow = Database['public']['Tables']['camp_packages']['Row'];
export type BookingRow = Database['public']['Tables']['bookings']['Row'];
export type AvailabilityRow = Database['public']['Tables']['availability']['Row'];
export type BookingInsert = Database['public']['Tables']['bookings']['Insert'];

/**
 * SERVER-ONLY admin operations.
 * Import this module only from server actions or API routes.
 * Enforced by 'use server' directive and supabaseAdmin RLS bypass.
 */

/**
 * Creates a new camp package.
 * Admin-only operation.
 */
export async function createPackage(
  params: CampPackageRow['Insert'],
): Promise<CampPackageRow> {
  const { data, error } = await supabaseAdmin
    .from('camp_packages')
    .insert([params])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to create package');
  }

  return data as CampPackageRow;
}

/**
 * Updates an existing camp package.
 * Admin-only operation.
 */
export async function updatePackage(
  packageId: number,
  params: CampPackageRow['Update'],
): Promise<CampPackageRow> {
  const { data, error } = await supabaseAdmin
    .from('camp_packages')
    .update(params)
    .eq('id', packageId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to update package');
  }

  return data as CampPackageRow;
}

/**
 * Upserts availability record for a package date.
 * Admin-only operation.
 */
export async function upsertAvailability(
  params: AvailabilityRow['Insert'],
): Promise<AvailabilityRow> {
  const { data, error } = await supabaseAdmin
    .from('availability')
    .upsert([params], { onConflict: ['package_id', 'available_date'] })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to upsert availability');
  }

  return data as AvailabilityRow;
}

/**
 * Creates a booking with proper defaults.
 * Admin-only operation. Client should use public booking flow with RLS.
 */
export async function createBooking(
  params: Omit<BookingInsert, 'booking_reference' | 'advance_amount' | 'payment_status' | 'booking_status'>,
): Promise<BookingRow> {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .insert([
      {
        ...params,
        booking_reference: `BK-${Date.now()}`,
        advance_amount: 0,
        payment_status: 'pending',
        booking_status: 'pending',
      },
    ])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to create booking');
  }

  return data as BookingRow;
}

/**
 * Updates booking payment and status fields.
 * Admin-only operation.
 */
export async function updateBookingStatus(
  bookingId: number,
  updates: Pick<BookingRow, 'payment_status' | 'booking_status' | 'advance_amount' | 'special_requests'>,
): Promise<BookingRow> {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to update booking');
  }

  return data as BookingRow;
}

/**
 * Increments booked_slots in availability after successful booking.
 * Admin-only operation (should be called from booking completion workflow).
 */
export async function incrementBookedSlots(
  packageId: number,
  availableDate: string,
  increment: number,
): Promise<AvailabilityRow> {
  const { data: current, error: fetchError } = await supabaseAdmin
    .from('availability')
    .select('booked_slots')
    .eq('package_id', packageId)
    .eq('available_date', availableDate)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message || 'Failed to fetch availability');
  }

  if (!current) {
    throw new Error('Availability record not found');
  }

  const { data, error } = await supabaseAdmin
    .from('availability')
    .update({ booked_slots: current.booked_slots + increment })
    .eq('package_id', packageId)
    .eq('available_date', availableDate)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to update booked slots');
  }

  return data as AvailabilityRow;
}
