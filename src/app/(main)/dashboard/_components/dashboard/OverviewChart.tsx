"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { ordersData } from "@/app/(main)/dashboard/_components/dashboard/data/orders";
import type { Period } from "@/app/(main)/dashboard/_components/shared/period";

// Use the latest order date as "now"
const NOW = new Date(Math.max(...ordersData.map((o) => o.createdAt.getTime())));

function buildChartData(period: Period, customStart?: Date, customEnd?: Date): { label: string; revenue: number }[] {
  const end = customEnd ?? NOW;

  if (period === "TODAY") {
    const dayStart = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate());
    const totalMs = NOW.getTime() - dayStart.getTime() || 864e5;
    return Array.from({ length: 6 }, (_, i) => {
      const bStart = new Date(dayStart.getTime() + i * (totalMs / 6));
      const bEnd = new Date(dayStart.getTime() + (i + 1) * (totalMs / 6));
      const rev = ordersData
        .filter((o) => o.createdAt >= bStart && o.createdAt < bEnd)
        .reduce((s, o) => s + o.amount, 0);
      const h = bStart.getHours().toString().padStart(2, "0");
      const m = bStart.getMinutes().toString().padStart(2, "0");
      return { label: `${h}:${m}`, revenue: rev };
    });
  }

  if (period === "7D") {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(NOW);
      day.setDate(NOW.getDate() - (6 - i));
      const bStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const bEnd = new Date(bStart.getTime() + 864e5);
      const rev = ordersData
        .filter((o) => o.createdAt >= bStart && o.createdAt < bEnd)
        .reduce((s, o) => s + o.amount, 0);
      return { label: day.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" }), revenue: rev };
    });
  }

  if (period === "MTD") {
    const mStart = new Date(NOW.getFullYear(), NOW.getMonth(), 1);
    const totalMs = NOW.getTime() - mStart.getTime() || 1;
    const count = Math.min(Math.ceil(totalMs / 864e5), 10);
    const bucket = totalMs / count;
    return Array.from({ length: count }, (_, i) => {
      const bStart = new Date(mStart.getTime() + i * bucket);
      const bEnd = new Date(mStart.getTime() + (i + 1) * bucket);
      const rev = ordersData
        .filter((o) => o.createdAt >= bStart && o.createdAt < bEnd)
        .reduce((s, o) => s + o.amount, 0);
      return { label: bStart.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), revenue: rev };
    });
  }

  if (period === "QTD") {
    const q = Math.floor(NOW.getMonth() / 3);
    const qStart = new Date(NOW.getFullYear(), q * 3, 1);
    const count = 6;
    const bucket = (NOW.getTime() - qStart.getTime()) / count;
    return Array.from({ length: count }, (_, i) => {
      const bStart = new Date(qStart.getTime() + i * bucket);
      const bEnd = new Date(qStart.getTime() + (i + 1) * bucket);
      const rev = ordersData
        .filter((o) => o.createdAt >= bStart && o.createdAt < bEnd)
        .reduce((s, o) => s + o.amount, 0);
      return { label: bStart.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), revenue: rev };
    });
  }

  if (period === "YTD") {
    const months = NOW.getMonth() + 1;
    return Array.from({ length: months }, (_, i) => {
      const bStart = new Date(NOW.getFullYear(), i, 1);
      const bEnd = new Date(NOW.getFullYear(), i + 1, 0, 23, 59, 59);
      const rev = ordersData
        .filter((o) => o.createdAt >= bStart && o.createdAt <= bEnd)
        .reduce((s, o) => s + o.amount, 0);
      return { label: bStart.toLocaleDateString("en-GB", { month: "short" }), revenue: rev };
    });
  }

  // CUSTOM
  const cs = customStart ?? new Date(NOW.getTime() - 30 * 864e5);
  const ce = end;
  const totalMs = ce.getTime() - cs.getTime() || 1;
  const count = 10;
  const bucket = totalMs / count;
  return Array.from({ length: count }, (_, i) => {
    const bStart = new Date(cs.getTime() + i * bucket);
    const bEnd = new Date(cs.getTime() + (i + 1) * bucket);
    const rev = ordersData.filter((o) => o.createdAt >= bStart && o.createdAt < bEnd).reduce((s, o) => s + o.amount, 0);
    return { label: bStart.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), revenue: rev };
  });
}

function getPeriodLabel(period: Period): string {
  return {
    TODAY: "today",
    "7D": "last 7 days",
    MTD: "month to date",
    QTD: "quarter to date",
    YTD: "year to date",
    CUSTOM: "custom range",
  }[period];
}

type OverviewChartProps = {
  activePeriod: Period;
  onPeriodChange: (p: Period) => void;
  currency?: "NGN" | "USD";
  ngnPerUsd?: number;
  customStart?: Date;
  customEnd?: Date;
};

export default function OverviewChart({
  activePeriod,
  onPeriodChange: _onPeriodChange,
  currency = "NGN",
  ngnPerUsd = 1620,
  customStart,
  customEnd,
}: OverviewChartProps) {
  const fmt = (naira: number) =>
    currency === "USD"
      ? `$${(naira / ngnPerUsd).toLocaleString("en-US", { maximumFractionDigits: 0 })}`
      : `₦${naira.toLocaleString()}`;

  const chartData = useMemo(
    () => buildChartData(activePeriod, customStart, customEnd),
    [activePeriod, customStart, customEnd],
  );

  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0);

  const revenueValues = chartData.map((d) => d.revenue).filter((v) => v > 0);
  const rawMax = revenueValues.length ? Math.max(...revenueValues) : 10000;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax || 1)));
  const niceMax = Math.ceil(rawMax / magnitude) * magnitude;
  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round((niceMax / 4) * i));
  const hasData = totalRevenue > 0;

  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-zinc-900 dark:ring-zinc-800">
      {/* HEADER */}
      <div className="flex items-start justify-between border-b border-gray-50 px-6 py-5 dark:border-zinc-800">
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase dark:text-zinc-500">
            Revenue Overview
          </p>
          <p className="mt-1 text-[11px] text-gray-400 dark:text-zinc-500">{getPeriodLabel(activePeriod)}</p>
        </div>
      </div>

      {/* CHART */}
      <div className="relative h-72 px-2 py-4">
        {!hasData && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <p className="text-sm font-medium text-gray-300">No sales data for this period</p>
            <p className="text-xs text-gray-200">Try selecting a wider time range</p>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f3f4f6" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              ticks={yTicks}
              tickFormatter={(val) => {
                const a = currency === "USD" ? val / ngnPerUsd : val;
                const s = currency === "USD" ? "$" : "₦";
                return a >= 1000 ? `${s}${(a / 1000).toFixed(0)}k` : `${s}${Math.round(a)}`;
              }}
              width={56}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              domain={[0, niceMax]}
            />
            <Tooltip
              formatter={(val: number) => [fmt(val), "Revenue"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#7c3aed"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={{ r: 3, fill: "#7c3aed", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#7c3aed", stroke: "#fff", strokeWidth: 2 }}
            >
              <LabelList
                dataKey="revenue"
                position="top"
                formatter={(val: number) => {
                  const a = currency === "USD" ? val / ngnPerUsd : val;
                  const s = currency === "USD" ? "$" : "₦";
                  return a >= 1000 ? `${s}${(a / 1000).toFixed(0)}k` : `${s}${Math.round(a)}`;
                }}
                style={{ fontSize: 10, fill: "#7c3aed", fontWeight: 600 }}
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
