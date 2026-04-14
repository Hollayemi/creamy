"use client";
import { ReactNode } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

type Props = {
  title: string;
  value: string;
  change: string;
  data: { value: number }[];
  icon?: ReactNode;
};

export default function StatsCard({ title, value, change, data, icon }: Props) {
  // Determine if the last value change is positive or negative
  const positive = data.length > 1 ? data[data.length - 1].value >= data[data.length - 2].value : true;

  // Dynamic colors for chart
  const strokeColor = positive ? "#22c55e" : "#ef4444";
  const fillColor = positive ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"; // green/red fill

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          {icon && <div className="rounded-lg bg-purple-100 p-2 text-purple-600">{icon}</div>}
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <h3 className="text-xl font-semibold">{value}</h3>
            <p className={`text-xs ${positive ? "text-green-600" : "text-red-500"}`}>{change} vs last month</p>
          </div>
        </div>

        <div className="h-16 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Area type="monotone" dataKey="value" stroke={strokeColor} fill={fillColor} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
