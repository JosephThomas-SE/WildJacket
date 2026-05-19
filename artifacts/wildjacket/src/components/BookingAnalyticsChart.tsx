import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Booking } from "@/lib/bookings";

type Period = "weekly" | "monthly";
type Metric = "revenue" | "bookings";

interface DataPoint {
  label: string;
  revenue: number;
  confirmed: number;
  cancelled: number;
}

function buildPeriodKey(date: Date, period: Period): string {
  if (period === "monthly") {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  }
  // ISO week: find Monday of that week
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildChartData(bookings: Booking[], period: Period): DataPoint[] {
  const map = new Map<string, DataPoint>();

  for (const b of bookings) {
    const date = new Date(b.created_at);
    const key = buildPeriodKey(date, period);
    const existing = map.get(key) ?? { label: key, revenue: 0, confirmed: 0, cancelled: 0 };

    if (b.status === "confirmed") {
      existing.revenue += b.total_price;
      existing.confirmed += 1;
    } else {
      existing.cancelled += 1;
    }

    map.set(key, existing);
  }

  // Sort chronologically by parsing the label back — easier to sort by original date
  const sorted: { key: string; date: Date; point: DataPoint }[] = [];
  for (const b of bookings) {
    const date = new Date(b.created_at);
    const key = buildPeriodKey(date, period);
    if (!sorted.some((s) => s.key === key)) {
      sorted.push({ key, date, point: map.get(key)! });
    }
  }
  sorted.sort((a, b) => a.date.getTime() - b.date.getTime());

  return sorted.map((s) => s.point);
}

const CustomTooltip = ({
  active,
  payload,
  label,
  metric,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  metric: Metric;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 shadow-xl text-sm">
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2" style={{ color: p.color }}>
          <span className="h-2 w-2 rounded-full inline-block" style={{ background: p.color }} />
          {p.name}:{" "}
          <span className="font-semibold text-white">
            {metric === "revenue" ? `$${p.value.toLocaleString()}` : p.value}
          </span>
        </p>
      ))}
    </div>
  );
};

export default function BookingAnalyticsChart({ bookings }: { bookings: Booking[] }) {
  const [period, setPeriod] = useState<Period>("monthly");
  const [metric, setMetric] = useState<Metric>("revenue");

  const data = useMemo(() => buildChartData(bookings, period), [bookings, period]);

  const isEmpty = data.length === 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {metric === "revenue" ? "Revenue from confirmed bookings" : "Booking volume by status"} · {period}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Metric toggle */}
          <div className="flex rounded-lg overflow-hidden border border-white/10 text-xs">
            {(["revenue", "bookings"] as Metric[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1.5 capitalize transition-colors ${
                  metric === m
                    ? "bg-sky-600 text-white font-medium"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          {/* Period toggle */}
          <div className="flex rounded-lg overflow-hidden border border-white/10 text-xs">
            {(["weekly", "monthly"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 capitalize transition-colors ${
                  period === p
                    ? "bg-slate-700 text-white font-medium"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      {isEmpty ? (
        <div className="flex items-center justify-center h-48 text-slate-600 text-sm">
          No booking data yet
        </div>
      ) : metric === "revenue" ? (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={44}
            />
            <Tooltip content={<CustomTooltip metric={metric} />} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#revenueGrad)"
              dot={{ r: 3, fill: "#22c55e", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={32}
            />
            <Tooltip content={<CustomTooltip metric={metric} />} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "#94a3b8", paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="confirmed" name="Confirmed" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cancelled" name="Cancelled" fill="#475569" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
