import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { adminUpdateBooking, type Booking } from "@/lib/bookings";
import { getRoleFromSession } from "@/lib/roles";
import { notifyBooking } from "@/lib/api";
import { useRealtimeBookings, type RealtimeEvent } from "@/hooks/useRealtimeBookings";
import BookingAnalyticsChart from "@/components/BookingAnalyticsChart";
import toast from "react-hot-toast";

function StatusBadge({ status }: { status: Booking["status"] }) {
  if (status === "confirmed")
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">Confirmed</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-600/40 text-slate-400 border border-slate-600/30">Cancelled</span>;
}

function LiveDot({ connected }: { connected: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium">
      <span className="relative flex h-2 w-2">
        {connected ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </>
        ) : (
          <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-600" />
        )}
      </span>
      <span className={connected ? "text-green-400" : "text-slate-500"}>
        {connected ? "Live" : "Connecting…"}
      </span>
    </span>
  );
}

function EventBanner({ event, onDismiss }: { event: RealtimeEvent; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 8000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const label =
    event.type === "INSERT" ? "New booking" :
    event.type === "UPDATE" ? "Booking updated" :
    "Booking removed";

  const color =
    event.type === "INSERT" ? "border-green-500/40 bg-green-500/10 text-green-300" :
    event.type === "UPDATE" ? "border-sky-500/40 bg-sky-500/10 text-sky-300" :
    "border-red-500/40 bg-red-500/10 text-red-300";

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm animate-in slide-in-from-top-2 fade-in duration-300 ${color}`}
    >
      <span className="text-lg">{event.booking.experience_emoji}</span>
      <div className="flex-1 min-w-0">
        <span className="font-semibold">{label}:</span>{" "}
        {event.booking.experience_title}{" "}
        <span className="font-mono text-xs opacity-70">{event.booking.booking_ref}</span>
      </div>
      <button onClick={onDismiss} className="opacity-50 hover:opacity-100 transition-opacity text-lg leading-none">×</button>
    </div>
  );
}

export default function AdminPage() {
  const { session, user } = useAuth();
  const role = getRoleFromSession(session);
  const {
    bookings,
    loading,
    error,
    connected,
    recentEvents,
    dismissEvent,
    updateLocal,
  } = useRealtimeBookings();

  const [search, setSearch] = useState("");

  const filtered = bookings.filter((b) =>
    [b.booking_ref, b.experience_title].some((s) =>
      s.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  async function handleCancel(b: Booking) {
    if (!confirm(`Cancel booking ${b.booking_ref}?`)) return;
    try {
      const updated = await adminUpdateBooking(b.id, { status: "cancelled" });
      updateLocal(updated);
      notifyBooking({
        bookingRef: b.booking_ref,
        guestName: "Guest",
        guestEmail: "",
        experienceTitle: b.experience_title,
        experienceEmoji: b.experience_emoji,
        guests: b.guests,
        travelDate: b.travel_date,
        totalPrice: b.total_price,
        action: "cancelled",
      });
      toast.success("Booking cancelled");
    } catch { toast.error("Failed to cancel"); }
  }

  async function handleRestore(b: Booking) {
    try {
      const updated = await adminUpdateBooking(b.id, { status: "confirmed" });
      updateLocal(updated);
      toast.success("Booking restored");
    } catch { toast.error("Failed to restore"); }
  }

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const revenue = bookings.filter((b) => b.status === "confirmed").reduce((s, b) => s + b.total_price, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">Admin Console</h1>
              <LiveDot connected={connected} />
            </div>
            <p className="text-slate-400 text-sm mt-0.5">
              {user?.email} · <span className="text-sky-400">{role}</span>
            </p>
          </div>
          {role === "super_admin" && (
            <Link to="/admin/dashboard" className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors">
              Super Admin Controls →
            </Link>
          )}
        </div>

        {/* Real-time event banners */}
        {recentEvents.length > 0 && (
          <div className="space-y-2">
            {recentEvents.map((ev) => (
              <EventBanner key={ev.id} event={ev} onDismiss={() => dismissEvent(ev.id)} />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total bookings", value: bookings.length },
            { label: "Active", value: confirmed },
            { label: "Revenue", value: `$${revenue.toLocaleString()}` },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Analytics chart */}
        {!loading && !error && <BookingAnalyticsChart bookings={bookings} />}

        {/* Bookings table */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden">
          <div className="p-5 border-b border-white/10 flex items-center gap-4">
            <h2 className="text-lg font-semibold flex-1">All Bookings</h2>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ref or experience…"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 w-60"
            />
          </div>

          {loading && <p className="px-5 py-8 text-slate-400 text-sm">Loading…</p>}
          {error && (
            <p className="px-5 py-4 text-red-400 text-sm bg-red-500/10">
              {error.includes("does not exist")
                ? "Bookings table not set up — see Super Admin Controls → Database Setup."
                : error}
            </p>
          )}
          {!loading && !error && filtered.length === 0 && (
            <p className="px-5 py-8 text-slate-500 text-sm text-center">No bookings found.</p>
          )}
          {!loading && filtered.length > 0 && (
            <div className="divide-y divide-white/5">
              {filtered.map((b) => {
                const isNew = recentEvents.some(
                  (e) => e.type === "INSERT" && e.booking.id === b.id && Date.now() - e.seenAt < 10000,
                );
                return (
                  <div
                    key={b.id}
                    className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                      isNew ? "bg-green-500/5 border-l-2 border-green-500" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <span className="text-2xl">{b.experience_emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-sm font-medium text-white">{b.experience_title}</p>
                        <StatusBadge status={b.status} />
                        {isNew && (
                          <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400 uppercase tracking-wide">
                            New
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-mono">{b.booking_ref}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {new Date(b.travel_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        {" · "}{b.guests} guest{b.guests !== 1 ? "s" : ""}
                        {" · "}<span className="text-green-400">${b.total_price.toLocaleString()}</span>
                      </p>
                      {b.additional_requirements && (
                        <p className="text-xs text-slate-500 italic mt-0.5">"{b.additional_requirements}"</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={`/admin/booking/${b.booking_ref}`}
                        className="text-xs text-sky-400 hover:text-sky-300 border border-sky-500/30 hover:border-sky-400 rounded-lg px-3 py-1.5 transition-colors"
                      >
                        View
                      </Link>
                      {b.status === "confirmed" ? (
                        <button
                          onClick={() => handleCancel(b)}
                          className="text-xs text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-lg px-3 py-1.5 transition-colors"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(b)}
                          className="text-xs text-slate-400 hover:text-green-400 border border-white/10 hover:border-green-500/30 rounded-lg px-3 py-1.5 transition-colors"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
