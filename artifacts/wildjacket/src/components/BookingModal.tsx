import { useState } from "react";
import { type Experience } from "@/lib/bookings";

interface Props {
  experience: Experience;
  onConfirm: (guests: number, travelDate: string) => Promise<void>;
  onClose: () => void;
}

export function BookingModal({ experience, onConfirm, onClose }: Props) {
  const today = new Date();
  today.setDate(today.getDate() + 14);
  const minDate = today.toISOString().split("T")[0];

  const [guests, setGuests] = useState(1);
  const [travelDate, setTravelDate] = useState(minDate);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = experience.priceNum * guests;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onConfirm(guests, travelDate);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-[#1a2235] text-white shadow-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-[#176446] to-[#0f3f2e] flex items-center gap-4 px-6">
          <span className="text-4xl">{experience.emoji}</span>
          <div>
            <p className="text-xs text-green-300 uppercase tracking-wider font-medium">
              {experience.location} · {experience.duration}
            </p>
            <h2 className="text-xl font-bold">{experience.title}</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Travel date
            </label>
            <input
              type="date"
              min={minDate}
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              required
              className="w-full rounded-xl bg-[#0f1623] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2aa170]"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Number of guests
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg transition-colors"
              >
                −
              </button>
              <span className="text-2xl font-semibold w-8 text-center">
                {guests}
              </span>
              <button
                type="button"
                onClick={() => setGuests((g) => Math.min(12, g + 1))}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg transition-colors"
              >
                +
              </button>
              <span className="text-slate-400 text-sm ml-1">
                (max 12 per booking)
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex justify-between items-center">
            <span className="text-slate-400 text-sm">Estimated total</span>
            <span className="text-[#2aa170] text-xl font-bold">
              ${total.toLocaleString()}
            </span>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-white/20 text-slate-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 rounded-xl bg-[#2aa170] hover:bg-[#176446] text-white font-semibold transition-colors disabled:opacity-60"
            >
              {submitting ? "Confirming…" : "Confirm booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
