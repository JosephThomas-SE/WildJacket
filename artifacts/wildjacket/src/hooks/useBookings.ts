import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchBookings,
  createBooking,
  cancelBooking,
  type Booking,
  type Experience,
} from "@/lib/bookings";

export function useBookings() {
  const { user } = useAuth();
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

  useEffect(() => {
    load();
  }, [load]);

  const book = useCallback(
    async (exp: Experience, guests: number, travelDate: string) => {
      if (!user) throw new Error("Must be signed in to book");
      const newBooking = await createBooking(user.id, exp, guests, travelDate);
      setBookings((prev) => [newBooking, ...prev]);
      return newBooking;
    },
    [user],
  );

  const cancel = useCallback(async (bookingId: string) => {
    await cancelBooking(bookingId);
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" as const } : b,
      ),
    );
  }, []);

  return { bookings, loading, error, book, cancel, reload: load };
}
