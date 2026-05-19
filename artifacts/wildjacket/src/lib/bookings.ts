import { supabaseBrowser } from "@/lib/supabase/client";

export interface Experience {
  id: number;
  emoji: string;
  title: string;
  description: string;
  price: string;
  priceNum: number;
  duration: string;
  location: string;
}

export interface Booking {
  id: string;
  user_id: string;
  booking_ref: string;
  experience_id: number;
  experience_title: string;
  experience_emoji: string;
  guests: number;
  travel_date: string;
  total_price: number;
  status: "confirmed" | "cancelled";
  additional_requirements: string | null;
  updated_at: string;
  created_at: string;
}

export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    emoji: "🦁",
    title: "Serengeti Safari",
    description:
      "Witness the great migration and track the Big Five across Tanzania's iconic plains with expert naturalist guides.",
    price: "From $3,200 / person",
    priceNum: 3200,
    duration: "7 days",
    location: "Tanzania",
  },
  {
    id: 2,
    emoji: "🐋",
    title: "Baja Whale Watching",
    description:
      "Kayak alongside grey whales in their natural calving lagoons off the coast of Baja California Sur.",
    price: "From $1,800 / person",
    priceNum: 1800,
    duration: "4 days",
    location: "Mexico",
  },
  {
    id: 3,
    emoji: "🦜",
    title: "Amazon Rainforest Trek",
    description:
      "Explore canopy trails, spot rare macaws, and sleep in a sustainable lodge deep in the Peruvian Amazon.",
    price: "From $2,400 / person",
    priceNum: 2400,
    duration: "5 days",
    location: "Peru",
  },
  {
    id: 4,
    emoji: "🐧",
    title: "Antarctic Expedition",
    description:
      "Journey to the edge of the world and walk among penguin colonies on one of Earth's last wild frontiers.",
    price: "From $8,500 / person",
    priceNum: 8500,
    duration: "12 days",
    location: "Antarctica",
  },
];

function generateBookingRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "WJ-";
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

/** Days remaining until travel date (negative = past) */
export function daysUntilTravel(travelDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const travel = new Date(travelDate);
  travel.setHours(0, 0, 0, 0);
  return Math.round((travel.getTime() - now.getTime()) / 86_400_000);
}

/** Guest can edit date/guests if > 2 days before arrival */
export function canEditBooking(b: Booking): boolean {
  return b.status === "confirmed" && daysUntilTravel(b.travel_date) > 2;
}

/** Guest can cancel or add requirements if > 1 day before arrival */
export function canCancelOrAddRequirements(b: Booking): boolean {
  return b.status === "confirmed" && daysUntilTravel(b.travel_date) > 1;
}

export async function fetchBookings(userId: string): Promise<Booking[]> {
  const { data, error } = await supabaseBrowser
    .from("bookings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Booking[];
}

export async function fetchAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabaseBrowser
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Booking[];
}

export async function fetchBookingByRef(ref: string): Promise<Booking | null> {
  const { data, error } = await supabaseBrowser
    .from("bookings")
    .select("*")
    .eq("booking_ref", ref)
    .single();
  if (error) return null;
  return data as Booking;
}

export async function createBooking(
  userId: string,
  exp: Experience,
  guests: number,
  travelDate: string,
): Promise<Booking> {
  const total = exp.priceNum * guests;
  const booking_ref = generateBookingRef();
  const { data, error } = await supabaseBrowser
    .from("bookings")
    .insert({
      user_id: userId,
      booking_ref,
      experience_id: exp.id,
      experience_title: exp.title,
      experience_emoji: exp.emoji,
      guests,
      travel_date: travelDate,
      total_price: total,
      status: "confirmed",
      additional_requirements: null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Booking;
}

export async function updateBooking(
  bookingId: string,
  updates: { guests?: number; travel_date?: string; additional_requirements?: string },
): Promise<Booking> {
  const { data, error } = await supabaseBrowser
    .from("bookings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", bookingId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Booking;
}

export async function cancelBooking(bookingId: string): Promise<void> {
  const { error } = await supabaseBrowser
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);
}

export async function adminUpdateBooking(
  bookingId: string,
  updates: { guests?: number; travel_date?: string; additional_requirements?: string; status?: "confirmed" | "cancelled" },
): Promise<Booking> {
  const { data, error } = await supabaseBrowser
    .from("bookings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", bookingId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Booking;
}

// ---- Profiles / user management ----

export interface Profile {
  user_id: string;
  full_name: string | null;
  email: string;
  role: "guest" | "admin" | "super_admin";
  is_blocked: boolean;
  blocked_reason: string | null;
}

export async function fetchAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabaseBrowser
    .from("profiles")
    .select("*")
    .order("email");
  if (error) throw new Error(error.message);
  return (data ?? []) as Profile[];
}

export async function setUserBlocked(
  userId: string,
  blocked: boolean,
  reason?: string,
): Promise<void> {
  const { error } = await supabaseBrowser
    .from("profiles")
    .update({ is_blocked: blocked, blocked_reason: blocked ? (reason ?? null) : null })
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}
