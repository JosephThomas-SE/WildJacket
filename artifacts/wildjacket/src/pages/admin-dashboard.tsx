import { useState, useEffect } from "react";
import { fetchAllProfiles, setUserBlocked, type Profile } from "@/lib/bookings";
import toast from "react-hot-toast";

const DB_SQL = `-- Run once in Supabase SQL Editor (supabase.com/dashboard → SQL Editor)

-- 1. bookings table (add new columns if upgrading from old schema)
create table if not exists bookings (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  booking_ref            text not null unique,
  experience_id          integer not null,
  experience_title       text not null,
  experience_emoji       text not null,
  guests                 integer not null default 1,
  travel_date            date not null,
  total_price            integer not null,
  status                 text not null default 'confirmed'
                         check (status in ('confirmed','cancelled')),
  additional_requirements text,
  updated_at             timestamptz,
  created_at             timestamptz not null default now()
);

alter table bookings enable row level security;

-- Guests can manage their own bookings
create policy "Users manage own bookings"
  on bookings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admins and super_admins can view and update all bookings
create policy "Admins view all bookings"
  on bookings for select
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','super_admin'));

create policy "Admins update all bookings"
  on bookings for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','super_admin'));

-- 2. profiles table
create table if not exists profiles (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  full_name      text,
  email          text not null,
  role           text not null default 'guest'
                 check (role in ('guest','admin','super_admin')),
  is_blocked     boolean not null default false,
  blocked_reason text,
  created_at     timestamptz not null default now()
);

alter table profiles enable row level security;

-- Super admins can manage all profiles
create policy "Super admins manage profiles"
  on profiles for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin');

-- Users can read their own profile
create policy "Users read own profile"
  on profiles for select
  using (auth.uid() = user_id);

-- 3. reviews table
create table if not exists reviews (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  booking_id     uuid not null references bookings(id) on delete cascade,
  experience_id  integer not null,
  rating         integer not null check (rating between 1 and 5),
  comment        text,
  created_at     timestamptz not null default now(),
  constraint reviews_booking_id_key unique (booking_id)
);

alter table reviews enable row level security;

-- Anyone can read reviews (shown on experience cards)
create policy "Anyone can read reviews"
  on reviews for select
  using (true);

-- Authenticated users can insert their own reviews
create policy "Users insert own reviews"
  on reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own reviews
create policy "Users update own reviews"
  on reviews for update
  to authenticated
  using (auth.uid() = user_id);

-- Admins can read and delete all reviews
create policy "Admins read all reviews"
  on reviews for select
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','super_admin'));

create policy "Admins delete reviews"
  on reviews for delete
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','super_admin'));

-- 4. Set a user's role (run per user, replace the placeholders)
-- update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' where email = 'admin@example.com';
-- update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"super_admin"}' where email = 'superadmin@example.com';`;

export default function AdminDashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blockReason, setBlockReason] = useState<Record<string, string>>({});
  const [showSql, setShowSql] = useState(false);

  useEffect(() => {
    fetchAllProfiles()
      .then(setProfiles)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleBlock(p: Profile) {
    const reason = blockReason[p.user_id] ?? "";
    if (!confirm(`Block ${p.email}?${reason ? ` Reason: ${reason}` : ""}`)) return;
    try {
      await setUserBlocked(p.user_id, true, reason);
      setProfiles((prev) => prev.map((x) => x.user_id === p.user_id ? { ...x, is_blocked: true, blocked_reason: reason } : x));
      toast.success(`${p.email} blocked`);
    } catch { toast.error("Failed to block user"); }
  }

  async function handleUnblock(p: Profile) {
    if (!confirm(`Unblock ${p.email}?`)) return;
    try {
      await setUserBlocked(p.user_id, false);
      setProfiles((prev) => prev.map((x) => x.user_id === p.user_id ? { ...x, is_blocked: false, blocked_reason: null } : x));
      toast.success(`${p.email} unblocked`);
    } catch { toast.error("Failed to unblock user"); }
  }

  const roleBadge = (role: Profile["role"]) => {
    const map = { guest: "text-slate-400 border-slate-600/40 bg-slate-600/20", admin: "text-sky-400 border-sky-500/30 bg-sky-500/10", super_admin: "text-purple-400 border-purple-500/30 bg-purple-500/10" };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${map[role]}`}>{role}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Super Admin Controls</h1>
          <p className="text-slate-400 text-sm mt-0.5">Full platform management — only accessible to super_admin</p>
        </div>

        {/* User management */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h2 className="text-lg font-semibold">User Management</h2>
            <p className="text-slate-400 text-sm mt-0.5">Block or unblock users. Blocked users cannot book experiences.</p>
          </div>

          {loading && <p className="px-5 py-8 text-slate-400 text-sm">Loading users…</p>}
          {error && (
            <p className="px-5 py-4 text-amber-400 text-sm bg-amber-500/10">
              {error.includes("does not exist")
                ? "Profiles table not set up yet — see Database Setup below."
                : error}
            </p>
          )}
          {!loading && !error && profiles.length === 0 && (
            <p className="px-5 py-8 text-slate-500 text-sm text-center">No user profiles found. Profiles are created when users sign up.</p>
          )}
          {!loading && profiles.length > 0 && (
            <div className="divide-y divide-white/5">
              {profiles.map((p) => (
                <div key={p.user_id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-medium text-white truncate">{p.email}</p>
                      {roleBadge(p.role)}
                      {p.is_blocked && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">Blocked</span>
                      )}
                    </div>
                    {p.is_blocked && p.blocked_reason && (
                      <p className="text-xs text-slate-500 italic">Reason: {p.blocked_reason}</p>
                    )}
                  </div>

                  {!p.is_blocked ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        value={blockReason[p.user_id] ?? ""}
                        onChange={(e) => setBlockReason((r) => ({ ...r, [p.user_id]: e.target.value }))}
                        placeholder="Reason (optional)"
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-red-500 w-40"
                      />
                      <button onClick={() => handleBlock(p)} className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400 rounded-lg px-3 py-1.5 transition-colors">
                        Block
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => handleUnblock(p)} className="text-xs text-green-400 hover:text-green-300 border border-green-500/30 hover:border-green-400 rounded-lg px-3 py-1.5 transition-colors">
                      Unblock
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Database Setup */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden">
          <button
            onClick={() => setShowSql((v) => !v)}
            className="w-full p-5 border-b border-white/10 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
          >
            <div className="text-left">
              <h2 className="text-lg font-semibold">Database Setup</h2>
              <p className="text-slate-400 text-sm mt-0.5">SQL to create all required tables and policies in Supabase</p>
            </div>
            <span className="text-slate-400 text-xl">{showSql ? "−" : "+"}</span>
          </button>
          {showSql && (
            <div className="p-5">
              <p className="text-slate-400 text-sm mb-3">
                Run this once in your{" "}
                <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                  Supabase SQL Editor
                </a>
                . Includes booking ref, additional requirements, profiles table, and RLS policies for all three roles.
              </p>
              <pre className="bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
                {DB_SQL}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
