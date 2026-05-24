// ── Shared period type used across Dashboard, Sales Analytics, etc. ───────────

export type Period = "TODAY" | "7D" | "MTD" | "QTD" | "YTD" | "CUSTOM";

export const PERIODS: Period[] = ["TODAY", "7D", "MTD", "QTD", "YTD", "CUSTOM"];

export const PERIOD_BUTTON_LABEL: Record<Period, string> = {
  TODAY: "Today",
  "7D": "7D",
  MTD: "MTD",
  QTD: "QTD",
  YTD: "YTD",
  CUSTOM: "Custom",
};

export const PERIOD_DESCRIPTION: Record<Period, string> = {
  TODAY: "Today",
  "7D": "Last 7 Days",
  MTD: "Month to Date",
  QTD: "Quarter to Date",
  YTD: "Year to Date",
  CUSTOM: "Custom Range",
};

export const PERIOD_CHANGE_LABEL: Record<Period, string> = {
  TODAY: "vs yesterday",
  "7D": "vs prev week",
  MTD: "vs prev month",
  QTD: "vs prev quarter",
  YTD: "vs prev year",
  CUSTOM: "vs prev period",
};

/** Returns the current + comparison windows for a given period.
 *  Pass `now` explicitly so mock-data pages can use a fixed reference date. */
export function getPeriodWindows(
  period: Period,
  now: Date,
  customStart?: Date,
  customEnd?: Date,
): { currentStart: Date; currentEnd: Date; prevStart: Date; prevEnd: Date } {
  if (period === "TODAY") {
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yestStart = new Date(todayStart.getTime() - 864e5);
    return { currentStart: todayStart, currentEnd: now, prevStart: yestStart, prevEnd: todayStart };
  }

  if (period === "7D") {
    const ms = 7 * 864e5;
    const cs = new Date(now.getTime() - ms);
    return { currentStart: cs, currentEnd: now, prevStart: new Date(cs.getTime() - ms), prevEnd: cs };
  }

  if (period === "MTD") {
    const cs = new Date(now.getFullYear(), now.getMonth(), 1);
    const ps = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const pe = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    return { currentStart: cs, currentEnd: now, prevStart: ps, prevEnd: pe };
  }

  if (period === "QTD") {
    const q = Math.floor(now.getMonth() / 3);
    const cs = new Date(now.getFullYear(), q * 3, 1);
    const ps = new Date(now.getFullYear(), (q - 1) * 3, 1);
    const pe = new Date(now.getFullYear(), q * 3, 0, 23, 59, 59);
    const daysIn = Math.floor((now.getTime() - cs.getTime()) / 864e5);
    return { currentStart: cs, currentEnd: now, prevStart: ps, prevEnd: new Date(ps.getTime() + daysIn * 864e5) };
  }

  if (period === "YTD") {
    const cs = new Date(now.getFullYear(), 0, 1);
    const ps = new Date(now.getFullYear() - 1, 0, 1);
    const pe = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(), 23, 59, 59);
    return { currentStart: cs, currentEnd: now, prevStart: ps, prevEnd: pe };
  }

  // CUSTOM
  const cs = customStart ?? new Date(now.getTime() - 30 * 864e5);
  const ce = customEnd ?? now;
  const ms = ce.getTime() - cs.getTime();
  return { currentStart: cs, currentEnd: ce, prevStart: new Date(cs.getTime() - ms), prevEnd: cs };
}
