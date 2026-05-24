"use client";

import { PERIODS, PERIOD_BUTTON_LABEL, type Period } from "./period";

interface PeriodSelectorProps {
  period: Period;
  onPeriodChange: (p: Period) => void;
  customStart?: string; // YYYY-MM-DD
  customEnd?: string; // YYYY-MM-DD
  onCustomStartChange?: (d: string) => void;
  onCustomEndChange?: (d: string) => void;
}

export default function PeriodSelector({
  period,
  onPeriodChange,
  customStart = "",
  customEnd = "",
  onCustomStartChange,
  onCustomEndChange,
}: PeriodSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Period toggle buttons */}
      <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              p === period
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            }`}
          >
            {PERIOD_BUTTON_LABEL[p]}
          </button>
        ))}
      </div>

      {/* Custom date range inputs — only visible when Custom is selected */}
      {period === "CUSTOM" && (
        <div className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3 py-1.5 shadow-sm dark:border-purple-800 dark:bg-zinc-900">
          <input
            type="date"
            value={customStart}
            onChange={(e) => onCustomStartChange?.(e.target.value)}
            className="cursor-pointer bg-transparent text-xs text-gray-700 outline-none dark:text-gray-300"
          />
          <span className="text-xs text-gray-400">→</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => onCustomEndChange?.(e.target.value)}
            className="cursor-pointer bg-transparent text-xs text-gray-700 outline-none dark:text-gray-300"
          />
        </div>
      )}
    </div>
  );
}
