"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, X, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Download } from "lucide-react";
import { ordersData } from "@/app/(main)/dashboard/_components/dashboard/data/orders";
import type { Period } from "@/app/(main)/dashboard/_components/shared/period";

// ─── Constants ────────────────────────────────────────────────────────────────

const REGION_COLORS = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
];
const REGION_LIGHT = [
  "bg-purple-50 text-purple-700",
  "bg-blue-50 text-blue-700",
  "bg-emerald-50 text-emerald-700",
  "bg-amber-50 text-amber-700",
  "bg-rose-50 text-rose-700",
  "bg-indigo-50 text-indigo-700",
  "bg-teal-50 text-teal-700",
  "bg-orange-50 text-orange-700",
];

const DATA_NOW = new Date(Math.max(...ordersData.map((o) => o.createdAt.getTime())));

// ─── Window helpers ───────────────────────────────────────────────────────────

function getBounds(period: Period): { curStart: Date; curEnd: Date; prevStart: Date; prevEnd: Date } {
  const now = DATA_NOW;
  const y = now.getFullYear();
  const m = now.getMonth();

  if (period === "TODAY") {
    const cs = new Date(y, m, now.getDate());
    const ps = new Date(cs.getTime() - 864e5);
    return { curStart: cs, curEnd: now, prevStart: ps, prevEnd: cs };
  }
  if (period === "7D") {
    const ms = 7 * 86400000;
    return {
      curStart: new Date(now.getTime() - ms),
      curEnd: now,
      prevStart: new Date(now.getTime() - 2 * ms),
      prevEnd: new Date(now.getTime() - ms),
    };
  }
  if (period === "MTD") {
    const cs = new Date(y, m, 1);
    return { curStart: cs, curEnd: now, prevStart: new Date(y, m - 1, 1), prevEnd: new Date(y, m, 0, 23, 59, 59) };
  }
  if (period === "QTD") {
    const q = Math.floor(m / 3);
    const cs = new Date(y, q * 3, 1);
    return {
      curStart: cs,
      curEnd: now,
      prevStart: new Date(y, (q - 1) * 3, 1),
      prevEnd: new Date(y, q * 3, 0, 23, 59, 59),
    };
  }
  return {
    curStart: new Date(y, 0, 1),
    curEnd: now,
    prevStart: new Date(y - 1, 0, 1),
    prevEnd: new Date(y - 1, m, now.getDate(), 23, 59, 59),
  };
}

type ModalPeriod = "month" | "quarter" | "year";

function getModalBounds(period: ModalPeriod): { curStart: Date; curEnd: Date; prevStart: Date; prevEnd: Date } {
  const now = DATA_NOW;
  const y = now.getFullYear();
  const m = now.getMonth();
  if (period === "month")
    return {
      curStart: new Date(y, m, 1),
      curEnd: new Date(y, m + 1, 0, 23, 59, 59),
      prevStart: new Date(y, m - 1, 1),
      prevEnd: new Date(y, m, 0, 23, 59, 59),
    };
  if (period === "quarter") {
    const q = Math.floor(m / 3);
    const ps = q === 0 ? new Date(y - 1, 9, 1) : new Date(y, (q - 1) * 3, 1);
    const pe = q === 0 ? new Date(y - 1, 12, 0, 23, 59, 59) : new Date(y, q * 3, 0, 23, 59, 59);
    return {
      curStart: new Date(y, q * 3, 1),
      curEnd: new Date(y, q * 3 + 3, 0, 23, 59, 59),
      prevStart: ps,
      prevEnd: pe,
    };
  }
  return {
    curStart: new Date(y, 0, 1),
    curEnd: new Date(y, 11, 31, 23, 59, 59),
    prevStart: new Date(y - 1, 0, 1),
    prevEnd: new Date(y - 1, 11, 31, 23, 59, 59),
  };
}

// ─── Data builder ─────────────────────────────────────────────────────────────

type RegionRow = {
  name: string;
  curOrders: number; // total orders in period
  curCompleted: number; // Delivered orders
  curCancelled: number; // Cancelled orders
  curValue: number; // total revenue
  prevOrders: number;
  prevCompleted: number;
  prevCancelled: number;
  prevValue: number;
  barWidth: number;
};

function buildRegions(curStart: Date, curEnd: Date, prevStart: Date, prevEnd: Date): RegionRow[] {
  const map: Record<string, Omit<RegionRow, "barWidth">> = {};

  for (const o of ordersData) {
    const key = o.region.toLowerCase().replace(/[\s-]/g, "");
    if (!map[key])
      map[key] = {
        name: o.region,
        curOrders: 0,
        curCompleted: 0,
        curCancelled: 0,
        curValue: 0,
        prevOrders: 0,
        prevCompleted: 0,
        prevCancelled: 0,
        prevValue: 0,
      };
    const t = o.createdAt.getTime();
    if (t >= curStart.getTime() && t <= curEnd.getTime()) {
      map[key].curOrders += 1;
      map[key].curValue += o.amount;
      if (o.status === "Delivered") map[key].curCompleted += 1;
      if (o.status === "Cancelled") map[key].curCancelled += 1;
    } else if (t >= prevStart.getTime() && t <= prevEnd.getTime()) {
      map[key].prevOrders += 1;
      map[key].prevValue += o.amount;
      if (o.status === "Delivered") map[key].prevCompleted += 1;
      if (o.status === "Cancelled") map[key].prevCancelled += 1;
    }
  }

  const all = Object.values(map).filter((r) => r.curOrders > 0 || r.prevOrders > 0);
  const maxOrders = Math.max(...all.map((r) => r.curOrders), 1);

  return all
    .map((r) => ({ ...r, barWidth: Math.round((r.curOrders / maxOrders) * 100) }))
    .sort((a, b) => b.curValue - a.curValue);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcGrowth(cur: number, prev: number) {
  if (prev === 0) return { pct: null as null | number, positive: true };
  const pct = Math.round(((cur - prev) / prev) * 100);
  return { pct, positive: pct >= 0 };
}

function GrowthBadge({ cur, prev }: { cur: number; prev: number }) {
  const { pct, positive } = calcGrowth(cur, prev);
  if (pct === null) return <span className="text-[11px] text-gray-300">—</span>;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${positive ? "text-emerald-600" : "text-red-500"}`}
    >
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {positive ? "+" : ""}
      {pct}%
    </span>
  );
}

const PERIOD_LABEL: Record<Period, string> = {
  TODAY: "today",
  "7D": "last 7 days",
  MTD: "month to date",
  QTD: "quarter to date",
  YTD: "year to date",
  CUSTOM: "custom range",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegionalPerformance({ period }: { period: Period }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPeriod, setModalPeriod] = useState<ModalPeriod>("month");
  const ITEMS_PER_PAGE = 8;

  // Card — driven by dashboard period
  const cardRegions = useMemo(() => {
    const { curStart, curEnd, prevStart, prevEnd } = getBounds(period);
    return buildRegions(curStart, curEnd, prevStart, prevEnd);
  }, [period]);

  // Modal — own independent period selector
  const modalRegions = useMemo(() => {
    const { curStart, curEnd, prevStart, prevEnd } = getModalBounds(modalPeriod);
    return buildRegions(curStart, curEnd, prevStart, prevEnd);
  }, [modalPeriod]);

  const totalPages = Math.ceil(modalRegions.length / ITEMS_PER_PAGE);
  const paginated = modalRegions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalRevenue = modalRegions.reduce((s, r) => s + r.curValue, 0);
  const totalCompleted = modalRegions.reduce((s, r) => s + r.curCompleted, 0);
  const totalCancelled = modalRegions.reduce((s, r) => s + r.curCancelled, 0);
  const totalPrevRev = modalRegions.reduce((s, r) => s + r.prevValue, 0);

  const modalPeriodLabel = { month: "Last Month", quarter: "Last Quarter", year: "Last Year" }[modalPeriod];

  const handleExport = () => {
    const headers = ["#", "Region", "Revenue (₦)", "Completed Orders", "Cancelled Orders", "Revenue Growth", "Share %"];
    const rows = modalRegions.map((r, i) => {
      const { pct } = calcGrowth(r.curValue, r.prevValue);
      const share = totalRevenue > 0 ? ((r.curValue / totalRevenue) * 100).toFixed(1) : "0.0";
      return [
        i + 1,
        `"${r.name}"`,
        r.curValue,
        r.curCompleted,
        r.curCancelled,
        pct !== null ? `${pct}%` : "—",
        share,
      ].join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })),
      download: `top_regions_${modalPeriod}_${new Date().toISOString().split("T")[0]}.csv`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      {/* ── Card ────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-zinc-900 dark:ring-zinc-800">
        <div className="flex items-center justify-between border-b border-gray-50 px-5 py-4 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top Regions</h3>
            <p className="mt-0.5 text-[11px] text-gray-400">
              {cardRegions.length} active · {PERIOD_LABEL[period]}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-purple-600 transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="divide-y divide-gray-50 px-5 dark:divide-zinc-800">
          {cardRegions.length === 0 ? (
            <p className="py-8 text-center text-xs text-gray-400">No orders in this period</p>
          ) : (
            cardRegions.slice(0, 6).map((region, i) => (
              <div key={region.name} className="flex items-center gap-3 py-3">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${REGION_LIGHT[i % REGION_LIGHT.length]}`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="mb-1.5 block truncate text-xs font-medium text-gray-700 dark:text-gray-300">
                    {region.name}
                  </span>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${REGION_COLORS[i % REGION_COLORS.length]}`}
                      style={{ width: `${region.barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-50 px-5 py-3 dark:border-zinc-800">
          <p className="text-[11px] text-gray-400">
            {cardRegions.length > 0
              ? `${cardRegions.reduce((s, r) => s + r.curCompleted, 0)} completed · ${cardRegions.reduce((s, r) => s + r.curCancelled, 0)} cancelled this period`
              : "No data for selected period"}
          </p>
        </div>
      </div>

      {/* ── Modal ───────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex h-[88vh] w-[92%] max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
            {/* Header */}
            <div className="border-b border-gray-100 px-6 py-4 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Regional Performance</h2>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    {modalRegions.length} regions · revenue growth vs {modalPeriodLabel.toLowerCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300"
                  >
                    <Download className="h-3.5 w-3.5" /> Export
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Controls row */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {/* Period selector */}
                <div className="flex items-center gap-0.5 rounded-lg bg-gray-50 p-1 dark:bg-zinc-800">
                  {(["month", "quarter", "year"] as ModalPeriod[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setModalPeriod(p);
                        setCurrentPage(1);
                      }}
                      className={`rounded-md px-3 py-1 text-[11px] font-semibold transition-all ${
                        modalPeriod === p
                          ? "bg-white text-purple-700 shadow-sm dark:bg-zinc-700 dark:text-purple-400"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {p === "month" ? "Monthly" : p === "quarter" ? "Quarterly" : "Yearly"}
                    </button>
                  ))}
                </div>

                {/* Summary pills */}
                <div className="ml-auto flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 dark:bg-zinc-800">
                    <span className="text-[11px] text-gray-400">Revenue:</span>
                    <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-200">
                      ₦{totalRevenue.toLocaleString()}
                    </span>
                    <GrowthBadge cur={totalRevenue} prev={totalPrevRev} />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 dark:bg-zinc-800">
                    <span className="text-[11px] text-gray-400">Completed:</span>
                    <span className="text-[11px] font-semibold text-emerald-600">{totalCompleted}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 dark:bg-zinc-800">
                    <span className="text-[11px] text-gray-400">Cancelled:</span>
                    <span className="text-[11px] font-semibold text-red-500">{totalCancelled}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-gray-50 dark:bg-zinc-800">
                  <tr>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold tracking-wide whitespace-nowrap text-gray-400 uppercase">
                      #
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold tracking-wide whitespace-nowrap text-gray-400 uppercase">
                      Region
                    </th>
                    <th className="px-5 py-3 text-right text-[11px] font-semibold tracking-wide whitespace-nowrap text-gray-400 uppercase">
                      Revenue
                    </th>
                    <th className="px-5 py-3 text-center text-[11px] font-semibold tracking-wide whitespace-nowrap text-gray-400 uppercase">
                      Completed
                    </th>
                    <th className="px-5 py-3 text-center text-[11px] font-semibold tracking-wide whitespace-nowrap text-gray-400 uppercase">
                      Cancelled
                    </th>
                    <th className="px-5 py-3 text-center text-[11px] font-semibold tracking-wide whitespace-nowrap text-gray-400 uppercase">
                      Growth
                    </th>
                    <th className="w-32 px-5 py-3 text-center text-[11px] font-semibold tracking-wide whitespace-nowrap text-gray-400 uppercase">
                      Share
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                  {paginated.map((region, i) => {
                    const idx = (currentPage - 1) * ITEMS_PER_PAGE + i;
                    const share = totalRevenue > 0 ? (region.curValue / totalRevenue) * 100 : 0;

                    return (
                      <tr key={region.name} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/40">
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${REGION_LIGHT[idx % REGION_LIGHT.length]}`}
                          >
                            {idx + 1}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-medium whitespace-nowrap text-gray-800 dark:text-gray-200">
                          {region.name}
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold whitespace-nowrap text-gray-900 dark:text-white">
                          ₦{region.curValue.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="font-semibold text-emerald-600">{region.curCompleted}</span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {region.curCancelled > 0 ? (
                            <span className="font-semibold text-red-500">{region.curCancelled}</span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <GrowthBadge cur={region.curValue} prev={region.prevValue} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
                              <div
                                className={`h-full rounded-full ${REGION_COLORS[idx % REGION_COLORS.length]} transition-all duration-500`}
                                style={{ width: `${share}%` }}
                              />
                            </div>
                            <span className="w-10 text-right font-semibold text-gray-700 dark:text-gray-300">
                              {share.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 dark:border-zinc-800">
              <span className="text-[11px] text-gray-400">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, modalRegions.length)}{" "}
                of {modalRegions.length} regions
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-zinc-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`h-7 w-7 rounded-md text-[11px] font-medium transition-colors ${
                      currentPage === p
                        ? "bg-purple-600 text-white"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-zinc-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
