import { useState, useEffect, useCallback, useRef } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { fetchAllBookings, type Booking } from "@/lib/bookings";

export type RealtimeEvent = {
  id: string;
  type: "INSERT" | "UPDATE" | "DELETE";
  booking: Booking;
  seenAt: number;
};

export function useRealtimeBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [recentEvents, setRecentEvents] = useState<RealtimeEvent[]>([]);
  const initialLoad = useRef(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchAllBookings();
      setBookings(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialLoad.current) {
      initialLoad.current = true;
      load();
    }

    const channel = supabaseBrowser
      .channel("admin-bookings-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        (payload) => {
          const eventType = payload.eventType as "INSERT" | "UPDATE" | "DELETE";
          const raw = (payload.new ?? payload.old) as Booking;

          const event: RealtimeEvent = {
            id: `${eventType}-${raw.id}-${Date.now()}`,
            type: eventType,
            booking: raw,
            seenAt: Date.now(),
          };

          setRecentEvents((prev) => [event, ...prev].slice(0, 20));

          setBookings((prev) => {
            if (eventType === "INSERT") {
              if (prev.some((b) => b.id === raw.id)) return prev;
              return [raw, ...prev];
            }
            if (eventType === "UPDATE") {
              return prev.map((b) => (b.id === raw.id ? raw : b));
            }
            if (eventType === "DELETE") {
              return prev.filter((b) => b.id !== raw.id);
            }
            return prev;
          });
        },
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [load]);

  const dismissEvent = useCallback((id: string) => {
    setRecentEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateLocal = useCallback((updated: Booking) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }, []);

  return {
    bookings,
    setBookings,
    loading,
    error,
    connected,
    recentEvents,
    dismissEvent,
    updateLocal,
    reload: load,
  };
}
