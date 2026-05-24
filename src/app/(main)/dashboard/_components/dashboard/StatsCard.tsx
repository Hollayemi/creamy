"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

type CardColor = "purple" | "blue" | "green" | "amber" | "red";

type Props = {
  title: string;
  value: string;
  change: string;
  data: { value: number }[];
  icon?: ReactNode;
  color?: CardColor;
  subtitle?: string;
  changeLabel?: string;
  danger?: boolean;
  hideChange?: boolean;
  href?: string;
};

const colorConfig: Record<
  CardColor,
  { iconBg: string; iconText: string; stroke: string; fill: string; topBorder: string }
> = {
  purple: {
    iconBg: "bg-purple-50 dark:bg-purple-900/20",
    iconText: "text-purple-600",
    stroke: "#7c3aed",
    fill: "rgba(124,58,237,0.12)",
    topBorder: "border-t-purple-500",
  },
  blue: {
    iconBg: "bg-blue-50 dark:bg-blue-900/20",
    iconText: "text-blue-600",
    stroke: "#2563eb",
    fill: "rgba(37,99,235,0.12)",
    topBorder: "border-t-blue-500",
  },
  green: {
    iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
    iconText: "text-emerald-600",
    stroke: "#059669",
    fill: "rgba(5,150,105,0.12)",
    topBorder: "border-t-emerald-500",
  },
  amber: {
    iconBg: "bg-amber-50 dark:bg-amber-900/20",
    iconText: "text-amber-600",
    stroke: "#d97706",
    fill: "rgba(217,119,6,0.12)",
    topBorder: "border-t-amber-500",
  },
  red: {
    iconBg: "bg-red-50 dark:bg-red-900/20",
    iconText: "text-red-600",
    stroke: "#dc2626",
    fill: "rgba(220,38,38,0.12)",
    topBorder: "border-t-red-500",
  },
};

export default function StatsCard({
  title,
  value,
  change,
  data,
  icon,
  color = "purple",
  subtitle,
  changeLabel = "vs last period",
  danger = false,
  hideChange = false,
  href,
}: Props) {
  const positive = parseFloat(change) >= 0;
  const cfg = colorConfig[color];

  const inner = (
    <div className="p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase dark:text-zinc-500">{title}</p>
        {icon && (
          <div className={`rounded-xl p-2 ${cfg.iconBg}`}>
            <span className={`${cfg.iconText} [&>svg]:h-5 [&>svg]:w-5`}>{icon}</span>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-1.5">
        <div className="min-w-0 flex-1">
          <p
            className={`text-xl leading-none font-bold tracking-tight ${danger ? "text-red-600" : "text-gray-900 dark:text-white"}`}
          >
            {value}
          </p>
          {!hideChange && (
            <div className="mt-1.5">
              <div
                className={`flex items-center gap-0.5 text-[10px] font-semibold ${positive ? "text-emerald-600" : "text-red-500"}`}
              >
                {positive ? <TrendingUp className="h-3 w-3 shrink-0" /> : <TrendingDown className="h-3 w-3 shrink-0" />}
                <span>{change}</span>
              </div>
              <p className="text-[9px] text-gray-400">{changeLabel}</p>
            </div>
          )}
          {subtitle && (
            <p className={`mt-1 text-[10px] leading-tight ${danger ? "font-bold text-red-500" : "text-gray-400"}`}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="h-10 w-16 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={cfg.stroke} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={cfg.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={cfg.stroke}
                strokeWidth={1.5}
                fill={`url(#grad-${color})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const baseClass = `relative overflow-hidden rounded-2xl border-t-[3px] ${cfg.topBorder} bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)] dark:bg-zinc-900 dark:shadow-zinc-950/60`;

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClass} block transition-shadow transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(0,0,0,0.12)]`}
      >
        {inner}
      </Link>
    );
  }

  return <div className={baseClass}>{inner}</div>;
}
