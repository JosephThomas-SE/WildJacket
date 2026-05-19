import { useState } from "react";
import { type Booking } from "@/lib/bookings";

interface EditProps {
  booking: Booking;
  onSave: (updates: { guests?: number; travel_date?: string }) => Promise<void>;
  onClose: () => void;
}

export function EditBookingModal({ booking, onSave, onClose }: EditProps) {
  const today = new Date();
  today.setDate(today.getDate() + 3);
  const minDate = today.toISOString().split("T")[0];

  const [guests, setGuests] = useState(booking.guests);
  const [travelDate, setTravelDate] = useState(booking.travel_date);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave({ guests, travel_date: travelDate });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-[#1a2235] text-white shadow-2xl overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-[#176446] to-[#0f3f2e] flex items-center px-6 gap-3">
          <span className="text-2xl">{booking.experience_emoji}</span>
          <h2 className="text-lg font-bold">Edit booking</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <p className="text-xs text-amber-400 bg-amber-400/10 rounded-xl px-3 py-2">
            Changes can be made up to 2 days before your arrival.
          </p>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Travel date</label>
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
            <label className="block text-sm text-slate-400 mb-2">Guests</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-lg">−</button>
              <span className="text-2xl font-semibold w-8 text-center">{guests}</span>
              <button type="button" onClick={() => setGuests((g) => Math.min(12, g + 1))} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-lg">+</button>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-2">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-white/20 text-slate-300 hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-3 rounded-xl bg-[#2aa170] hover:bg-[#176446] text-white font-semibold transition-colors disabled:opacity-60">
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface RequirementsProps {
  booking: Booking;
  onSave: (requirements: string) => Promise<void>;
  onClose: () => void;
}

export function RequirementsModal({ booking, onSave, onClose }: RequirementsProps) {
  const [text, setText] = useState(booking.additional_requirements ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(text);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-[#1a2235] text-white shadow-2xl overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-[#176446] to-[#0f3f2e] flex items-center px-6 gap-3">
          <span className="text-2xl">{booking.experience_emoji}</span>
          <h2 className="text-lg font-bold">Additional requirements</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-400">
            Let us know about dietary needs, accessibility requirements, or any special requests.
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="e.g. vegetarian meals, wheelchair access, celebrating an anniversary…"
            className="w-full rounded-xl bg-[#0f1623] border border-white/10 px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2aa170] resize-none"
          />
          {error && <p className="text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-2">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-white/20 text-slate-300 hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-3 rounded-xl bg-[#2aa170] hover:bg-[#176446] text-white font-semibold transition-colors disabled:opacity-60">
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
