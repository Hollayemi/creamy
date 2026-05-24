"use client";

import { useState, useMemo } from "react";
import StatsCard from "./_components/dashboard/StatsCard";
import OverviewChart from "./_components/dashboard/OverviewChart";
import RegionalPerformance from "./_components/dashboard/RegionalPerformance";
import TopSellingProducts from "./_components/dashboard/TopSellingProducts";
import PeriodSelector from "./_components/shared/PeriodSelector";
import { ordersData } from "./_components/dashboard/data/orders";
import { getPeriodWindows, PERIOD_CHANGE_LABEL, type Period } from "./_components/shared/period";
import { Banknote, ShoppingCart, Users, Clock, PackageOpen } from "lucide-react";

// Re-export so existing imports from this path keep working
export type { Period };

// Use latest order date as "now" so static data always resolves correctly
const DATA_NOW = new Date(Math.max(...ordersData.map((o) => o.createdAt.getTime())));

function calcChange(current: number, previous: number) {
  if (previous === 0) return "0";
  return (((current - previous) / previous) * 100).toFixed(1);
}

function buildBuckets(period: Period, customStart?: Date, customEnd?: Date): { start: Date; end: Date }[] {
  const now = DATA_NOW;

  if (period === "TODAY") {
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const totalMs = now.getTime() - dayStart.getTime() || 864e5;
    return Array.from({ length: 6 }, (_, i) => ({
      start: new Date(dayStart.getTime() + i * (totalMs / 6)),
      end: new Date(dayStart.getTime() + (i + 1) * (totalMs / 6)),
    }));
  }

  if (period === "YTD") {
    const months = now.getMonth() + 1;
    return Array.from({ length: months }, (_, i) => ({
      start: new Date(now.getFullYear(), i, 1),
      end: new Date(now.getFullYear(), i + 1, 0, 23, 59, 59),
    }));
  }

  if (period === "QTD") {
    const q = Math.floor(now.getMonth() / 3);
    const qStart = new Date(now.getFullYear(), q * 3, 1);
    const count = 6;
    const bMs = (now.getTime() - qStart.getTime()) / count;
    return Array.from({ length: count }, (_, i) => ({
      start: new Date(qStart.getTime() + i * bMs),
      end: new Date(qStart.getTime() + (i + 1) * bMs),
    }));
  }

  if (period === "MTD") {
    const mStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const days = Math.ceil((now.getTime() - mStart.getTime()) / 864e5) || 1;
    const count = Math.min(days, 6);
    const bMs = (now.getTime() - mStart.getTime()) / count;
    return Array.from({ length: count }, (_, i) => ({
      start: new Date(mStart.getTime() + i * bMs),
      end: new Date(mStart.getTime() + (i + 1) * bMs),
    }));
  }

  if (period === "7D") {
    return Array.from({ length: 7 }, (_, i) => ({
      start: new Date(now.getTime() - (6 - i) * 864e5),
      end: new Date(now.getTime() - (5 - i) * 864e5),
    }));
  }

  // CUSTOM
  const cs = customStart ?? new Date(now.getTime() - 30 * 864e5);
  const ce = customEnd ?? now;
  const bMs = (ce.getTime() - cs.getTime()) / 10;
  return Array.from({ length: 10 }, (_, i) => ({
    start: new Date(cs.getTime() + i * bMs),
    end: new Date(cs.getTime() + (i + 1) * bMs),
  }));
}

 const formatAmount = (naira: number) => {
    return `₦${naira.toLocaleString()}`;
  };

export default function Page() {
  const orders = ordersData;
  const [activePeriod, setActivePeriod] = useState<Period>("MTD");
  const [customStartStr, setCustomStartStr] = useState("");
  const [customEndStr, setCustomEndStr] = useState("");

  const customStart = customStartStr ? new Date(customStartStr) : undefined;
  const customEnd = customEndStr ? new Date(customEndStr) : undefined;

  const { currentOrders, prevOrders } = useMemo(() => {
    const { currentStart, currentEnd, prevStart, prevEnd } = getPeriodWindows(
      activePeriod,
      DATA_NOW,
      customStart,
      customEnd,
    );
    return {
      currentOrders: orders.filter((o) => o.createdAt >= currentStart && o.createdAt <= currentEnd),
      prevOrders: orders.filter((o) => o.createdAt >= prevStart && o.createdAt < prevEnd),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, activePeriod, customStartStr, customEndStr]);

  // Revenue
  const currentRevenue = currentOrders.reduce((s, o) => s + o.amount, 0);
  const prevRevenue = prevOrders.reduce((s, o) => s + o.amount, 0);

  // Completed orders
  const currentCompleted = currentOrders.filter((o) => o.status === "Delivered").length;
  const prevCompleted = prevOrders.filter((o) => o.status === "Delivered").length;

  // Customer count (unique)
  const currentCustomers = new Set(currentOrders.map((o) => o.customer)).size;
  const prevCustomers = new Set(prevOrders.map((o) => o.customer)).size;

  // Fill rate: % of orders in the period that were Delivered
  const currentFillRate = currentOrders.length > 0 ? (currentCompleted / currentOrders.length) * 100 : 0;
  const prevFillRate =
    prevOrders.length > 0 ? (prevOrders.filter((o) => o.status === "Delivered").length / prevOrders.length) * 100 : 0;
  const fillRateChange = (currentFillRate - prevFillRate).toFixed(1);

  // Open orders (Waiting status) + avg time open
  const openOrders = currentOrders.filter((o) => o.status === "Waiting");
  const avgOpenMinutes =
    openOrders.length > 0
      ? openOrders.reduce((sum, o) => sum + (DATA_NOW.getTime() - o.createdAt.getTime()), 0) / openOrders.length / 60000
      : 0;
  const formatAvgOpen = (mins: number) => {
    if (mins < 60) return `avg ${Math.round(mins)}m open`;
    if (mins < 1440) return `avg ${Math.round(mins / 60)}h ${Math.round(mins % 60)}m open`;
    return `avg ${Math.round(mins / 1440)}d open`;
  };

  // Bucketed sparklines — smooth, period-aware trend lines
  const sparkBuckets = useMemo(
    () => buildBuckets(activePeriod, customStart, customEnd),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activePeriod, customStartStr, customEndStr],
  );
  const revenueSpark = sparkBuckets.map(({ start, end }) => ({
    value: orders.filter((o) => o.createdAt >= start && o.createdAt <= end).reduce((s, o) => s + o.amount, 0),
  }));
  const completedSpark = sparkBuckets.map(({ start, end }) => ({
    value: orders.filter((o) => o.createdAt >= start && o.createdAt <= end && o.status === "Delivered").length,
  }));
  const customerSpark = sparkBuckets.map(({ start, end }) => ({
    value: new Set(orders.filter((o) => o.createdAt >= start && o.createdAt <= end).map((o) => o.customer)).size,
  }));
  const fillRateSpark = sparkBuckets.map(({ start, end }) => {
    const bucket = orders.filter((o) => o.createdAt >= start && o.createdAt <= end);
    return {
      value:
        bucket.length > 0
          ? Math.round((bucket.filter((o) => o.status === "Delivered").length / bucket.length) * 100)
          : 0,
    };
  });
  const openOrdersSpark = sparkBuckets.map(({ start, end }) => ({
    value: orders.filter((o) => o.createdAt >= start && o.createdAt <= end && o.status === "Waiting").length,
  }));

  return (
    <div className="min-h-screen space-y-5 bg-gray-50 p-6 dark:bg-zinc-950">
      {/* PERIOD SELECTOR */}
      <div className="flex justify-end">
        <PeriodSelector
          period={activePeriod}
          onPeriodChange={setActivePeriod}
          customStart={customStartStr}
          customEnd={customEndStr}
          onCustomStartChange={setCustomStartStr}
          onCustomEndChange={setCustomEndStr}
        />
      </div>

      {/* STATS CARDS ROW — order: Revenue · Completed · Open · Fill Rate · Customers */}
      <div className="grid grid-cols-5 gap-4">
        {/* 1 — Total Revenue */}
        <StatsCard
          title="Total Revenue"
          value={formatAmount(currentRevenue)}
          change={`${calcChange(currentRevenue, prevRevenue)}%`}
          data={revenueSpark.length ? revenueSpark : [{ value: 0 }]}
          icon={<Banknote />}
          color="purple"
          changeLabel={PERIOD_CHANGE_LABEL[activePeriod]}
        />
        {/* 2 — Completed Orders */}
        <StatsCard
          title="Completed Orders"
          value={currentCompleted.toLocaleString()}
          change={`${calcChange(currentCompleted, prevCompleted)}%`}
          data={completedSpark.length ? completedSpark : [{ value: 0 }]}
          icon={<ShoppingCart />}
          color="blue"
          changeLabel={PERIOD_CHANGE_LABEL[activePeriod]}
          href="/dashboard/order-management"
        />
        {/* 3 — Open Orders (always red — needs attention) */}
        <StatsCard
          title="Open Orders"
          value={openOrders.length.toLocaleString()}
          change=""
          hideChange
          data={openOrdersSpark.length ? openOrdersSpark : [{ value: 0 }]}
          icon={<PackageOpen />}
          color="red"
          danger={avgOpenMinutes > 59}
          subtitle={openOrders.length > 0 ? formatAvgOpen(avgOpenMinutes) : "No open orders"}
          href="/dashboard/order-management"
        />
        {/* 4 — Fill Rate */}
        <StatsCard
          title="Fill Rate"
          value={`${currentFillRate.toFixed(1)}%`}
          change={`${Number(fillRateChange) >= 0 ? "+" : ""}${fillRateChange}pts`}
          data={fillRateSpark.length ? fillRateSpark : [{ value: 0 }]}
          icon={<Clock />}
          color="amber"
          changeLabel={`${prevFillRate.toFixed(1)}% ${PERIOD_CHANGE_LABEL[activePeriod]}`}
          danger={currentFillRate < 85}
        />
        {/* 5 — Customer Count */}
        <StatsCard
          title="Customer Count"
          value={currentCustomers.toLocaleString()}
          change={`${calcChange(currentCustomers, prevCustomers)}%`}
          data={customerSpark.length ? customerSpark : [{ value: 0 }]}
          icon={<Users />}
          color="green"
          changeLabel={PERIOD_CHANGE_LABEL[activePeriod]}
          href="/dashboard/customers"
        />
      </div>

      {/* OVERVIEW CHART */}
      <OverviewChart
        activePeriod={activePeriod}
        onPeriodChange={setActivePeriod}
        // currency={currency}
        // ngnPerUsd={ngnPerUsd}
        customStart={customStart}
        customEnd={customEnd}
      />

      {/* BOTTOM ROW — Top Products · Regional Performance */}
      <div className="grid grid-cols-[3fr_2fr] items-start gap-4">
        <TopSellingProducts period={activePeriod} />
        <RegionalPerformance period={activePeriod} />
      </div>
    </div>
  );
}
