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
  experience_id: number;
  experience_title: string;
  experience_emoji: string;
  guests: number;
  travel_date: string;
  total_price: number;
  status: "confirmed" | "cancelled";
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

export async function fetchBookings(userId: string): Promise<Booking[]> {
  const { data, error } = await supabaseBrowser
    .from("bookings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Booking[];
}

export async function createBooking(
  userId: string,
  exp: Experience,
  guests: number,
  travelDate: string,
): Promise<Booking> {
  const total = exp.priceNum * guests;
  const { data, error } = await supabaseBrowser
    .from("bookings")
    .insert({
      user_id: userId,
      experience_id: exp.id,
      experience_title: exp.title,
      experience_emoji: exp.emoji,
      guests,
      travel_date: travelDate,
      total_price: total,
      status: "confirmed",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Booking;
}

export async function cancelBooking(bookingId: string): Promise<void> {
  const { error } = await supabaseBrowser
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (error) throw new Error(error.message);
}
