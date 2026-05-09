<import { supabaseAdmin } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

export type PackageRow = Database['public']['Tables']['packages']['Row'];
export type BookingRow = Database['public']['Tables']['bookings']['Row'];
export type BookingInsert = Database['public']['Tables']['bookings']['Insert'];

export type BookingWithPackage = BookingRow & {
  packages?: Pick<PackageRow, 'id' | 'name' | 'slug'> | null;
};

export async function getPackages() {
  const { data, error } = await supabaseAdmin
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Unable to fetch packages');
  }

  return data as PackageRow[];
}

export async function getPackageBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('packages')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .single();

  if (error) {
    throw new Error(error.message || 'Unable to fetch package');
  }

  return data as PackageRow;
}

export async function getBookingAvailability(packageId: string, startDate: string, endDate: string) {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('guest_count')
    .eq('package_id', packageId)
    .in('status', ['pending', 'confirmed'])
    .not('end_date', 'lt', startDate)
    .not('start_date', 'gt', endDate);

  if (error) {
    throw new Error(error.message || 'Unable to fetch availability');
  }

  const reservedGuests = data?.reduce((sum, booking) => sum + (booking.guest_count ?? 0), 0) ?? 0;

  return {
    reservedGuests,
  };
}

export async function createBooking({
  packageId,
  userId,
  guestCount,
  startDate,
  endDate,
}: {
  packageId: string;
  userId: string;
  guestCount: number;
  startDate: string;
  endDate: string;
}) {
  const packageDetail = await getPackageBySlug(packageId);
  if (!packageDetail) {
    throw new Error('Package not found');
  }

  if (guestCount < 1) {
    throw new Error('Guest count must be at least 1');
  }

  if (guestCount > packageDetail.max_guests) {
    throw new Error(`Maximum guests for this package is ${packageDetail.max_guests}`);
  }

  const availability = await getBookingAvailability(packageDetail.id, startDate, endDate);
  const existingGuests = availability.reservedGuests;
  const availableSpots = packageDetail.max_guests - existingGuests;

  if (guestCount > availableSpots) {
    throw new Error('Requested guest count exceeds available capacity for selected dates');
  }

  const totalPrice = packageDetail.price_per_guest * guestCount;

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .insert({
      package_id: packageDetail.id,
      user_id: userId,
      guest_count: guestCount,
      start_date: startDate,
      end_date: endDate,
      total_price: totalPrice,
      status: 'pending',
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Unable to create booking');
  }

  return data as BookingRow;
}

export async function getBookingsByUser(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*, packages(id, name, slug)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Unable to fetch bookings');
  }

  return data as BookingWithPackage[];
}

export async function getBookingsForPackage(packageId: string) {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('package_id', packageId)
    .in('status', ['pending', 'confirmed'])
    .order('start_date', { ascending: true });

  if (error) {
    throw new Error(error.message || 'Unable to fetch package bookings');
  }

  return data as BookingRow[];
}
}
