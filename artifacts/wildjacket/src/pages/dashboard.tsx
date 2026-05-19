import { useAuth } from "@/context/AuthContext";
import { useBookings } from "@/hooks/useBookings";
import { PageShell } from "@/components/layout/PageShell";
import { type Booking } from "@/lib/bookings";
import toast from "react-hot-toast";

function statusBadge(status: Booking["status"]) {
  if (status === "confirmed") {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
        Confirmed
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">
      Cancelled
    </span>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { bookings, loading, error, cancel } = useBookings();

  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const past = bookings.filter((b) => b.status === "cancelled");

  async function handleCancel(id: string, title: string) {
    if (!confirm(`Cancel your booking for ${title}?`)) return;
    try {
      await cancel(id);
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
          <h2 className="text-xl font-semibold text-white mb-6">
            My Bookings
            {confirmed.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                {confirmed.length} active
              </span>
            )}
          </h2>

          {loading && (
            <p className="text-slate-400 text-sm">Loading bookings…</p>
          )}

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
              {error.includes("does not exist") ? (
                <>
                  Bookings table not set up yet.{" "}
                  <a
                    href="#setup"
                    className="underline hover:text-red-300"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("db-setup")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    See setup instructions below.
                  </a>
                </>
              ) : (
                error
              )}
            </div>
          )}

          {!loading && !error && bookings.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              <p className="text-4xl mb-3">🌿</p>
              <p className="font-medium text-slate-300">No bookings yet</p>
              <p className="text-sm mt-1">
                Head over to{" "}
                <a href="/bookings" className="text-[#2aa170] hover:underline">
                  Experiences
                </a>{" "}
                to book your first adventure.
              </p>
            </div>
          )}

          {!loading && bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 px-5 py-4"
                >
                  <span className="text-3xl">{b.experience_emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="font-semibold text-white text-sm">
                        {b.experience_title}
                      </p>
                      {statusBadge(b.status)}
                    </div>
                    <p className="text-slate-400 text-xs">
                      {new Date(b.travel_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      · {b.guests} guest{b.guests !== 1 ? "s" : ""} ·{" "}
                      <span className="text-[#2aa170]">
                        ${b.total_price.toLocaleString()}
                      </span>
                    </p>
                  </div>
                  {b.status === "confirmed" && (
                    <button
                      onClick={() => handleCancel(b.id, b.experience_title)}
                      className="text-xs text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-lg px-3 py-1.5 transition-colors shrink-0"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          id="db-setup"
          className="rounded-[2rem] border border-white/10 bg-slate-900/75 p-8 shadow-soft backdrop-blur-xl"
        >
          <h2 className="text-xl font-semibold text-white mb-2">
            Database Setup
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            Run this SQL once in your{" "}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="text-[#2aa170] hover:underline"
            >
              Supabase SQL Editor
            </a>{" "}
            to enable booking persistence:
          </p>
          <pre className="bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto whitespace-pre">
{`create table if not exists bookings (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  experience_id   integer not null,
  experience_title text not null,
  experience_emoji text not null,
  guests       integer not null default 1,
  travel_date  date not null,
  total_price  integer not null,
  status       text not null default 'confirmed'
               check (status in ('confirmed','cancelled')),
  created_at   timestamptz not null default now()
);

alter table bookings enable row level security;

create policy "Users manage own bookings"
  on bookings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);`}
          </pre>
        </div>
      </div>
    </PageShell>
  );
}
