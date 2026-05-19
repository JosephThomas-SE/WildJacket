import { useState } from "react";
import type { Booking } from "@/lib/bookings";

interface Props {
  booking: Booking;
  existingRating?: number;
  existingComment?: string;
  onSave: (rating: number, comment: string) => Promise<void>;
  onClose: () => void;
}

function StarButton({
  value,
  hovered,
  selected,
  onHover,
  onClick,
}: {
  value: number;
  hovered: number;
  selected: number;
  onHover: (v: number) => void;
  onClick: (v: number) => void;
}) {
  const filled = value <= (hovered || selected);
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(value)}
      onMouseLeave={() => onHover(0)}
      onClick={() => onClick(value)}
      className="text-4xl transition-transform hover:scale-110 focus:outline-none"
      aria-label={`${value} star${value !== 1 ? "s" : ""}`}
    >
      <span className={filled ? "text-amber-400" : "text-slate-600"}>★</span>
    </button>
  );
}

const LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Excellent",
};

export function ReviewModal({ booking, existingRating, existingComment, onSave, onClose }: Props) {
  const [rating, setRating] = useState(existingRating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(existingComment ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setError("Please select a star rating."); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave(rating, comment);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save review");
    } finally {
      setSaving(false);
    }
  }

  const displayStar = hovered || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-white">Rate your experience</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              {booking.experience_emoji} {booking.experience_title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Stars */}
          <div className="text-center space-y-2">
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((v) => (
                <StarButton
                  key={v}
                  value={v}
                  hovered={hovered}
                  selected={rating}
                  onHover={setHovered}
                  onClick={setRating}
                />
              ))}
            </div>
            <p className={`text-sm font-medium transition-colors ${displayStar ? "text-amber-400" : "text-slate-600"}`}>
              {displayStar ? LABELS[displayStar] : "Tap a star to rate"}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Comment <span className="text-slate-600 font-normal">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Tell others about your experience…"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
            <p className="text-right text-xs text-slate-600 mt-0.5">{comment.length}/500</p>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:border-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !rating}
              className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 px-4 py-2.5 text-sm font-semibold text-black transition-colors"
            >
              {saving ? "Saving…" : existingRating ? "Update review" : "Submit review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
