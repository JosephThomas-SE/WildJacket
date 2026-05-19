import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { fetchBookingByRef, adminUpdateBooking, type Booking } from "@/lib/bookings";
import { getRoleFromSession } from "@/lib/roles";
import { notifyBooking } from "@/lib/api";
import toast from "react-hot-toast";

function StatusBadge({ status }: { status: Booking["status"] }) {
  if (status === "confirmed")
    return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-green-400 border border-green-500/30">Confirmed</span>;
  return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-slate-600/40 text-slate-400 border border-slate-600/30">Cancelled</span>;
}

export default function BookingDetailPage() {
  const [, params] = useRoute("/admin/booking/:ref");
  const ref = params?.ref ?? "";
  const { session } = useAuth();
  const role = getRoleFromSession(session);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editGuests, setEditGuests] = useState(1);
  const [editDate, setEditDate] = useState("");
  const [editReq, setEditReq] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ref) return;
    fetchBookingByRef(ref)
      .then((b) => {
        setBooking(b);
        if (b) { setEditGuests(b.guests); setEditDate(b.travel_date); setEditReq(b.additional_requirements ?? ""); }
      })
      .finally(() => setLoading(false));
  }, [ref]);

  async function handleSave() {
    if (!booking) return;
    setSaving(true);
    try {
      const updated = await adminUpdateBooking(booking.id, {
        guests: editGuests,
        travel_date: editDate,
        additional_requirements: editReq || null,
      });
      setBooking(updated);
      notifyBooking({
        bookingRef: updated.booking_ref,
        guestName: "Guest",
        guestEmail: "",
        experienceTitle: updated.experience_title,
        experienceEmoji: updated.experience_emoji,
        guests: updated.guests,
        travelDate: updated.travel_date,
        totalPrice: updated.total_price,
        additionalRequirements: updated.additional_requirements,
        action: "updated",
      });
      setEditing(false);
      toast.success("Booking updated");
    } catch { toast.error("Update failed"); }
    finally { setSaving(false); }
  }

  async function handleStatusToggle() {
    if (!booking) return;
    const next = booking.status === "confirmed" ? "cancelled" : "confirmed";
    if (!confirm(`${next === "cancelled" ? "Cancel" : "Restore"} this booking?`)) return;
    try {
      const updated = await adminUpdateBooking(booking.id, { status: next });
      setBooking(updated);
      notifyBooking({
        bookingRef: updated.booking_ref,
        guestName: "Guest",
        guestEmail: "",
        experienceTitle: updated.experience_title,
        experienceEmoji: updated.experience_emoji,
        guests: updated.guests,
        travelDate: updated.travel_date,
        totalPrice: updated.total_price,
        action: next === "cancelled" ? "cancelled" : "updated",
      });
      toast.success(`Booking ${next}`);
    } catch { toast.error("Failed to update status"); }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading…</div>
  );

  if (!booking) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
      <p className="text-5xl">🔍</p>
      <p className="text-lg font-medium text-white">Booking not found</p>
      <p className="text-sm">No booking with ref <code className="text-sky-400">{ref}</code></p>
      <Link to="/admin" className="text-sky-400 hover:underline text-sm">← Back to Admin</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link to="/admin" className="text-sm text-slate-400 hover:text-white transition-colors">← All bookings</Link>
          <span className="text-xs text-slate-500 font-mono">{booking.booking_ref}</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden">
          <div className="h-28 bg-gradient-to-br from-[#176446] to-[#0f3f2e] flex items-center gap-5 px-8">
            <span className="text-5xl">{booking.experience_emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{booking.experience_title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={booking.status} />
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {!editing ? (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: "Booking ref", value: booking.booking_ref },
                    { label: "Travel date", value: new Date(booking.travel_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
                    { label: "Guests", value: String(booking.guests) },
                    { label: "Total price", value: `$${booking.total_price.toLocaleString()}` },
                    { label: "Created", value: new Date(booking.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                    { label: "Last updated", value: new Date(booking.updated_at ?? booking.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                  ].map((row) => (
                    <div key={row.label} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                      <p className="text-xs text-slate-500 mb-0.5">{row.label}</p>
                      <p className="font-medium text-white">{row.value}</p>
                    </div>
                  ))}
                </div>

                {booking.additional_requirements && (
                  <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-xs text-slate-500 mb-1">Additional requirements</p>
                    <p className="text-sm text-slate-200">{booking.additional_requirements}</p>
                  </div>
                )}

                {role === "super_admin" && (
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setEditing(true)} className="flex-1 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors">
                      Edit booking
                    </button>
                    <button onClick={handleStatusToggle} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${booking.status === "confirmed" ? "border border-red-500/40 text-red-400 hover:bg-red-500/10" : "border border-green-500/40 text-green-400 hover:bg-green-500/10"}`}>
                      {booking.status === "confirmed" ? "Cancel booking" : "Restore booking"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-xl px-3 py-2">
                  Super admin edit — no time restrictions apply.
                </p>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Travel date</label>
                  <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                    className="w-full rounded-xl bg-[#0f1623] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Guests</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setEditGuests((g) => Math.max(1, g - 1))} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-lg">−</button>
                    <span className="text-2xl font-semibold w-8 text-center">{editGuests}</span>
                    <button type="button" onClick={() => setEditGuests((g) => Math.min(20, g + 1))} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-lg">+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Additional requirements</label>
                  <textarea value={editReq} onChange={(e) => setEditReq(e.target.value)} rows={3}
                    placeholder="Special notes or guest requests…"
                    className="w-full rounded-xl bg-[#0f1623] border border-white/10 px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEditing(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/20 text-slate-300 hover:bg-white/5 transition-colors text-sm">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors disabled:opacity-60">
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
