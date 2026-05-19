import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { fetchAllBookings, adminUpdateBooking, type Booking } from "@/lib/bookings";
import { getRoleFromSession } from "@/lib/roles";
import { notifyBooking } from "@/lib/api";
import toast from "react-hot-toast";

function StatusBadge({ status }: { status: Booking["status"] }) {
  if (status === "confirmed")
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">Confirmed</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-600/40 text-slate-400 border border-slate-600/30">Cancelled</span>;
}

export default function AdminPage() {
  const { session, user } = useAuth();
  const role = getRoleFromSession(session);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAllBookings()
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter((b) =>
    [b.booking_ref, b.experience_title].some((s) =>
      s.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  async function handleCancel(b: Booking) {
    if (!confirm(`Cancel booking ${b.booking_ref}?`)) return;
    try {
      await adminUpdateBooking(b.id, { status: "cancelled" });
      setBookings((prev) => prev.map((x) => x.id === b.id ? { ...x, status: "cancelled" as const } : x));
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
      await adminUpdateBooking(b.id, { status: "confirmed" });
      setBookings((prev) => prev.map((x) => x.id === b.id ? { ...x, status: "confirmed" as const } : x));
      toast.success("Booking restored");
    } catch { toast.error("Failed to restore"); }
  }

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const revenue = bookings.filter((b) => b.status === "confirmed").reduce((s, b) => s + b.total_price, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Console</h1>
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
              {error.includes("does not exist") ? "Bookings table not set up — see Super Admin Controls → Database Setup." : error}
            </p>
          )}
          {!loading && !error && filtered.length === 0 && (
            <p className="px-5 py-8 text-slate-500 text-sm text-center">No bookings found.</p>
          )}
          {!loading && filtered.length > 0 && (
            <div className="divide-y divide-white/5">
              {filtered.map((b) => (
                <div key={b.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <span className="text-2xl">{b.experience_emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-medium text-white">{b.experience_title}</p>
                      <StatusBadge status={b.status} />
                      <span className="text-xs text-slate-500 font-mono">{b.booking_ref}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {new Date(b.travel_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      {" · "}{b.guests} guest{b.guests !== 1 ? "s" : ""}
                      {" · "}<span className="text-green-400">${b.total_price.toLocaleString()}</span>
                    </p>
                    {b.additional_requirements && (
                      <p className="text-xs text-slate-500 italic mt-0.5">"{b.additional_requirements}"</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link to={`/admin/booking/${b.booking_ref}`} className="text-xs text-sky-400 hover:text-sky-300 border border-sky-500/30 hover:border-sky-400 rounded-lg px-3 py-1.5 transition-colors">
                      View
                    </Link>
                    {b.status === "confirmed" ? (
                      <button onClick={() => handleCancel(b)} className="text-xs text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-lg px-3 py-1.5 transition-colors">
                        Cancel
                      </button>
                    ) : (
                      <button onClick={() => handleRestore(b)} className="text-xs text-slate-400 hover:text-green-400 border border-white/10 hover:border-green-500/30 rounded-lg px-3 py-1.5 transition-colors">
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
