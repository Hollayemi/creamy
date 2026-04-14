"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

type OverviewChartProps = {
  change: number;
  positive: boolean;
};

const data = [
  { month: "Jan", revenue: 10000 },
  { month: "Feb", revenue: 20000 },
  { month: "Mar", revenue: 30000 },
  { month: "Apr", revenue: 25000 },
  { month: "May", revenue: 35000 },
  { month: "Jun", revenue: 42000 },
  { month: "Jul", revenue: 60000 },
  { month: "Aug", revenue: 40000 },
  { month: "Sep", revenue: 35000 },
  { month: "Oct", revenue: 24000 },
  { month: "Nov", revenue: 50000 },
  { month: "Dec", revenue: 90000 },
];

export default function OverviewChart({ change, positive }: OverviewChartProps) {
  // Generate ticks dynamically for Y-axis
  const revenueValues = data.map((d) => d.revenue);
  const minRevenue = Math.min(...revenueValues);
  const maxRevenue = Math.max(...revenueValues);

  // Optional: generate 5 ticks between min and max
  const yTicks = Array.from({ length: 6 }, (_, i) => Math.round(minRevenue + ((maxRevenue - minRevenue) / 5) * i));

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Overall Revenue</h3>
          <div className="mt-1 flex items-center gap-2 text-sm">
            {positive ? (
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowDownLeft className="h-4 w-4 text-red-500" />
            )}
            <span className={positive ? "text-green-600" : "text-red-500"}>{change}% vs last month</span>
          </div>
        </div>

        <div className="text-muted-foreground flex gap-3 text-sm">
          <span>1h</span>
          <span>24h</span>
          <span>1w</span>
          <span className="text-primary font-medium">1m</span>
          <span>1y</span>
        </div>
      </div>

      {/* CHART */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="month" interval={0} padding={{ left: 20, right: 20 }} tick={{ fontSize: 12 }} />
            <YAxis
              ticks={yTicks} // force ticks
              tickFormatter={(val) => (val >= 100000 ? `₦${(val / 100000).toFixed(0)}M` : `₦${val.toLocaleString()}`)}
              width={80}
            />
            <Tooltip formatter={(val: number) => `₦${val.toLocaleString()}`} />
            <Area type="monotone" dataKey="revenue" stroke="#7c3aed" fill="#c4b5fd" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
