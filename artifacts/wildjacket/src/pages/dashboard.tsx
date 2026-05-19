import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useBookings } from "@/hooks/useBookings";
import { PageShell } from "@/components/layout/PageShell";
import { EditBookingModal, RequirementsModal } from "@/components/EditBookingModal";
import {
  type Booking,
  canEditBooking,
  canCancelOrAddRequirements,
  daysUntilTravel,
} from "@/lib/bookings";
import toast from "react-hot-toast";

function StatusBadge({ status }: { status: Booking["status"] }) {
  if (status === "confirmed")
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">Confirmed</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">Cancelled</span>;
}

function TimeWarning({ booking }: { booking: Booking }) {
  if (booking.status !== "confirmed") return null;
  const days = daysUntilTravel(booking.travel_date);
  if (days > 2) return null;
  if (days > 1) return <p className="text-xs text-amber-400 mt-1">⚠ Changes locked — less than 2 days to arrival. You can still cancel or add requirements.</p>;
  if (days > 0) return <p className="text-xs text-red-400 mt-1">⚠ All changes locked — less than 1 day to arrival.</p>;
  return null;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { bookings, loading, error, edit, addRequirements, cancel } = useBookings();
  const [editTarget, setEditTarget] = useState<Booking | null>(null);
  const [reqTarget, setReqTarget] = useState<Booking | null>(null);

  async function handleCancel(b: Booking) {
    if (!confirm(`Cancel your booking for ${b.experience_title}?`)) return;
    try {
      await cancel(b.id);
      toast.success("Booking cancelled");
    } catch {
      toast.error("Failed to cancel — please try again");
    }
  }

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/75 p-8 shadow-soft backdrop-blur-xl">
          <h1 className="text-3xl font-semibold text-white mb-1">My Dashboard</h1>
          <p className="text-slate-400 text-sm">{user?.email}</p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-900/75 p-8 shadow-soft backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            My Bookings
            {bookings.filter((b) => b.status === "confirmed").length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                {bookings.filter((b) => b.status === "confirmed").length} active
              </span>
            )}
          </h2>

          {loading && <p className="text-slate-400 text-sm">Loading bookings…</p>}

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
              {error.includes("does not exist") ? (
                <>Bookings table not set up yet — see <a href="/admin/dashboard" className="underline">setup instructions</a>.</>
              ) : error}
            </div>
          )}

          {!loading && !error && bookings.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              <p className="text-4xl mb-3">🌿</p>
              <p className="font-medium text-slate-300">No bookings yet</p>
              <p className="text-sm mt-1">Head over to <a href="/bookings" className="text-[#2aa170] hover:underline">Experiences</a> to book your first adventure.</p>
            </div>
          )}

          {!loading && bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="rounded-xl bg-white/5 border border-white/10 px-5 py-4">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl mt-0.5">{b.experience_emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="font-semibold text-white text-sm">{b.experience_title}</p>
                        <StatusBadge status={b.status} />
                      </div>
                      <p className="text-slate-400 text-xs">
                        {new Date(b.travel_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        {" · "}{b.guests} guest{b.guests !== 1 ? "s" : ""}
                        {" · "}<span className="text-[#2aa170]">${b.total_price.toLocaleString()}</span>
                        {" · "}<span className="text-slate-500">Ref: {b.booking_ref}</span>
                      </p>
                      {b.additional_requirements && (
                        <p className="text-slate-500 text-xs mt-1 italic">"{b.additional_requirements}"</p>
                      )}
                      <TimeWarning booking={b} />
                    </div>
                  </div>

                  {b.status === "confirmed" && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-11">
                      {canEditBooking(b) && (
                        <button
                          onClick={() => setEditTarget(b)}
                          className="text-xs text-slate-300 hover:text-white border border-white/10 hover:border-white/30 rounded-lg px-3 py-1.5 transition-colors"
                        >
                          Edit date / guests
                        </button>
                      )}
                      {canCancelOrAddRequirements(b) && (
                        <button
                          onClick={() => setReqTarget(b)}
                          className="text-xs text-slate-300 hover:text-white border border-white/10 hover:border-white/30 rounded-lg px-3 py-1.5 transition-colors"
                        >
                          {b.additional_requirements ? "Update requirements" : "Add requirements"}
                        </button>
                      )}
                      {canCancelOrAddRequirements(b) && (
                        <button
                          onClick={() => handleCancel(b)}
                          className="text-xs text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-lg px-3 py-1.5 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editTarget && (
        <EditBookingModal
          booking={editTarget}
          onSave={(updates) => edit(editTarget.id, updates)}
          onClose={() => setEditTarget(null)}
        />
      )}
      {reqTarget && (
        <RequirementsModal
          booking={reqTarget}
          onSave={(req) => addRequirements(reqTarget.id, req)}
          onClose={() => setReqTarget(null)}
        />
      )}
    </PageShell>
  );
}
