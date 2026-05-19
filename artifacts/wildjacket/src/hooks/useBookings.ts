import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchBookings,
  createBooking,
  cancelBooking,
  updateBooking,
  type Booking,
  type Experience,
} from "@/lib/bookings";
import { notifyBooking } from "@/lib/api";

export function useBookings() {
  const { user, session } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBookings(user.id);
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const book = useCallback(
    async (exp: Experience, guests: number, travelDate: string) => {
      if (!user) throw new Error("Must be signed in to book");
      const newBooking = await createBooking(user.id, exp, guests, travelDate);
      setBookings((prev) => [newBooking, ...prev]);
      notifyBooking({
        bookingRef: newBooking.booking_ref,
        guestName: session?.user?.user_metadata?.full_name ?? "Guest",
        guestEmail: user.email ?? "",
        experienceTitle: exp.title,
        experienceEmoji: exp.emoji,
        guests,
        travelDate,
        totalPrice: newBooking.total_price,
        action: "created",
      });
      return newBooking;
    },
    [user, session],
  );

  const edit = useCallback(
    async (bookingId: string, updates: { guests?: number; travel_date?: string }) => {
      const updated = await updateBooking(bookingId, updates);
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
      notifyBooking({
        bookingRef: updated.booking_ref,
        guestName: session?.user?.user_metadata?.full_name ?? "Guest",
        guestEmail: user?.email ?? "",
        experienceTitle: updated.experience_title,
        experienceEmoji: updated.experience_emoji,
        guests: updated.guests,
        travelDate: updated.travel_date,
        totalPrice: updated.total_price,
        additionalRequirements: updated.additional_requirements,
        action: "updated",
      });
      return updated;
    },
    [user, session],
  );

  const addRequirements = useCallback(
    async (bookingId: string, requirements: string) => {
      const updated = await updateBooking(bookingId, { additional_requirements: requirements });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
      notifyBooking({
        bookingRef: updated.booking_ref,
        guestName: session?.user?.user_metadata?.full_name ?? "Guest",
        guestEmail: user?.email ?? "",
        experienceTitle: updated.experience_title,
        experienceEmoji: updated.experience_emoji,
        guests: updated.guests,
        travelDate: updated.travel_date,
        totalPrice: updated.total_price,
        additionalRequirements: requirements,
        action: "updated",
      });
    },
    [user, session],
  );

  const cancel = useCallback(
    async (bookingId: string) => {
      await cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" as const } : b)),
      );
      const b = bookings.find((x) => x.id === bookingId);
      if (b) {
        notifyBooking({
          bookingRef: b.booking_ref,
          guestName: session?.user?.user_metadata?.full_name ?? "Guest",
          guestEmail: user?.email ?? "",
          experienceTitle: b.experience_title,
          experienceEmoji: b.experience_emoji,
          guests: b.guests,
          travelDate: b.travel_date,
          totalPrice: b.total_price,
          action: "cancelled",
        });
      }
    },
    [user, session, bookings],
  );

  return { bookings, loading, error, book, edit, addRequirements, cancel, reload: load };
}
