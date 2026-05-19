import { useState, useEffect, useCallback } from "react";
import { fetchAllReviews, deleteReview, type AdminReview } from "@/lib/reviews";
import toast from "react-hot-toast";

const EXPERIENCE_FILTERS = [
  { id: 0, label: "All" },
  { id: 1, label: "Serengeti Safari" },
  { id: 2, label: "Baja Whale Watching" },
  { id: 3, label: "Amazon Trek" },
  { id: 4, label: "Antarctic Expedition" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((v) => (
        <span key={v} className={`text-sm ${v <= rating ? "text-amber-400" : "text-slate-700"}`}>★</span>
      ))}
    </span>
  );
}

function RatingSummary({ reviews }: { reviews: AdminReview[] }) {
  if (!reviews.length) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="flex items-center gap-6 px-5 py-4 bg-white/[0.02] border-b border-white/5">
      <div className="text-center shrink-0">
        <p className="text-3xl font-bold text-white">{avg.toFixed(1)}</p>
        <Stars rating={Math.round(avg)} />
        <p className="text-xs text-slate-500 mt-0.5">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="flex-1 space-y-1 min-w-0">
        {dist.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-3">{star}</span>
            <span className="text-amber-400 text-xs">★</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-400/70 transition-all"
                style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }}
              />
            </div>
            <span className="text-xs text-slate-600 w-4 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminReviewsPanel() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterExp, setFilterExp] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchAllReviews();
      setReviews(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = filterExp === 0 ? reviews : reviews.filter((r) => r.experience_id === filterExp);

  async function handleDelete(r: AdminReview) {
    if (!confirm(`Delete this review for "${r.experience_title}"? This cannot be undone.`)) return;
    setDeletingId(r.id);
    try {
      await deleteReview(r.id);
      setReviews((prev) => prev.filter((x) => x.id !== r.id));
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Guest Reviews</h2>
          <p className="text-slate-500 text-xs mt-0.5">Moderate reviews across all experiences</p>
        </div>
        {/* Experience filter tabs */}
        <div className="flex gap-1 flex-wrap">
          {EXPERIENCE_FILTERS.map((f) => {
            const count = f.id === 0 ? reviews.length : reviews.filter((r) => r.experience_id === f.id).length;
            return (
              <button
                key={f.id}
                onClick={() => setFilterExp(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterExp === f.id
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "text-slate-400 hover:text-white border border-transparent hover:border-white/10"
                }`}
              >
                {f.label} {count > 0 && <span className="opacity-60">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating summary bar */}
      {!loading && !error && <RatingSummary reviews={visible} />}

      {/* States */}
      {loading && <p className="px-5 py-8 text-slate-400 text-sm">Loading reviews…</p>}
      {error && (
        <p className="px-5 py-4 text-red-400 text-sm bg-red-500/10">
          {error.includes("does not exist")
            ? "Reviews table not set up yet — see Super Admin Controls → Database Setup."
            : error}
        </p>
      )}
      {!loading && !error && visible.length === 0 && (
        <p className="px-5 py-8 text-slate-600 text-sm text-center">
          {reviews.length === 0 ? "No reviews yet." : "No reviews for this experience."}
        </p>
      )}

      {/* Review list */}
      {!loading && visible.length > 0 && (
        <div className="divide-y divide-white/5">
          {visible.map((r) => (
            <div key={r.id} className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group">
              <span className="text-2xl mt-0.5 shrink-0">{r.experience_emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-sm font-medium text-white">{r.experience_title}</p>
                  <Stars rating={r.rating} />
                  <span className="text-xs text-slate-500 font-mono">{r.booking_ref}</span>
                </div>
                {r.comment ? (
                  <p className="text-sm text-slate-300 italic mt-1">"{r.comment}"</p>
                ) : (
                  <p className="text-xs text-slate-600 italic mt-1">No comment left</p>
                )}
                <p className="text-xs text-slate-600 mt-1">
                  {new Date(r.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => handleDelete(r)}
                disabled={deletingId === r.id}
                className="opacity-0 group-hover:opacity-100 text-xs text-slate-500 hover:text-red-400 border border-transparent hover:border-red-500/30 rounded-lg px-2.5 py-1.5 transition-all shrink-0 disabled:opacity-40"
              >
                {deletingId === r.id ? "…" : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
