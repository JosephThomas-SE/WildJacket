import { supabaseBrowser } from "@/lib/supabase/client";

export interface Review {
  id: string;
  user_id: string;
  booking_id: string;
  experience_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ExperienceRating {
  experience_id: number;
  avg: number;
  count: number;
}

export async function fetchUserReviews(userId: string): Promise<Review[]> {
  const { data, error } = await supabaseBrowser
    .from("reviews")
    .select("*")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return (data ?? []) as Review[];
}

export async function fetchRatingsForExperiences(): Promise<ExperienceRating[]> {
  const { data, error } = await supabaseBrowser
    .from("reviews")
    .select("experience_id, rating");
  if (error) throw new Error(error.message);

  const map = new Map<number, { sum: number; count: number }>();
  for (const row of data ?? []) {
    const prev = map.get(row.experience_id) ?? { sum: 0, count: 0 };
    map.set(row.experience_id, { sum: prev.sum + row.rating, count: prev.count + 1 });
  }

  return Array.from(map.entries()).map(([experience_id, { sum, count }]) => ({
    experience_id,
    avg: Math.round((sum / count) * 10) / 10,
    count,
  }));
}

export interface AdminReview {
  id: string;
  user_id: string;
  booking_id: string;
  experience_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  booking_ref: string;
  experience_title: string;
  experience_emoji: string;
}

export async function fetchAllReviews(): Promise<AdminReview[]> {
  const { data, error } = await supabaseBrowser
    .from("reviews")
    .select("*, bookings(booking_ref, experience_title, experience_emoji)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as (Review & { bookings: { booking_ref: string; experience_title: string; experience_emoji: string } })[]).map(
    (r) => ({
      ...r,
      booking_ref: r.bookings?.booking_ref ?? "—",
      experience_title: r.bookings?.experience_title ?? "—",
      experience_emoji: r.bookings?.experience_emoji ?? "🌿",
    }),
  );
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabaseBrowser.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function submitReview(
  userId: string,
  bookingId: string,
  experienceId: number,
  rating: number,
  comment: string,
): Promise<Review> {
  const { data, error } = await supabaseBrowser
    .from("reviews")
    .upsert(
      {
        user_id: userId,
        booking_id: bookingId,
        experience_id: experienceId,
        rating,
        comment: comment.trim() || null,
      },
      { onConflict: "booking_id" },
    )
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Review;
}
