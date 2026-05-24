"use client";

import { useState, useMemo } from "react";
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Search, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPeriodWindows, type Period } from "@/app/(main)/dashboard/_components/shared/period";
import { ordersData } from "@/app/(main)/dashboard/_components/dashboard/data/orders";
import { aggregateTopProducts } from "@/app/(main)/dashboard/_components/shared/productData";

const CATEGORY_STYLE: Record<string, string> = {
  "Baby & Kids": "bg-purple-50 text-purple-700",
  Groceries: "bg-emerald-50 text-emerald-700",
  Beverages: "bg-blue-50 text-blue-700",
  Household: "bg-amber-50 text-amber-700",
};

const DATA_NOW = new Date(Math.max(...ordersData.map((o) => o.createdAt.getTime())));

// ─── Shared labels ────────────────────────────────────────────────────────────

const PERIOD_LABEL: Record<Period, string> = {
  TODAY: "today",
  "7D": "last 7 days",
  MTD: "month to date",
  QTD: "quarter to date",
  YTD: "year to date",
  CUSTOM: "custom range",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryBadge({ cat }: { cat: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_STYLE[cat] ?? "bg-gray-100 text-gray-600"}`}
    >
      {cat}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TopSellingProducts({ period }: { period: Period }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const products = useMemo(() => {
    const { currentStart, currentEnd } = getPeriodWindows(period, DATA_NOW);
    return aggregateTopProducts(ordersData, currentStart, currentEnd);
  }, [period]);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()),
      ),
    [products, search],
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExport = () => {
    const headers = ["#", "Product ID", "Product", "Brand", "Category", "Revenue (₦)", "Units Sold"];
    const rows = filtered.map((p, i) =>
      [i + 1, p.productId, `"${p.name}"`, p.brand, p.category, p.revenue, p.units].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })),
      download: `top_products_${period}_${new Date().toISOString().split("T")[0]}.csv`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      {/* ── Card ────────────────────────────────────────────────────────── */}
      <div className="self-start overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-zinc-900 dark:ring-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-50 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top-Selling Products</h3>
            <span className="text-sm text-gray-300">·</span>
            <span className="text-[11px] font-medium text-purple-600">{PERIOD_LABEL[period]}</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-purple-600 transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Table — top 5 */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-zinc-800">
                <th className="px-6 py-3 text-left text-[11px] font-semibold tracking-wider whitespace-nowrap text-gray-400 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold tracking-wider whitespace-nowrap text-gray-400 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-center text-[11px] font-semibold tracking-wider whitespace-nowrap text-gray-400 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-center text-[11px] font-semibold tracking-wider whitespace-nowrap text-gray-400 uppercase">
                  Units Sold
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-xs text-gray-400">
                    No orders in this period
                  </td>
                </tr>
              ) : (
                products.slice(0, 5).map((p, i) => (
                  <tr key={p.productId} className="transition-colors hover:bg-gray-50/60 dark:hover:bg-zinc-800/40">
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 text-[10px] font-bold text-gray-300">{i + 1}</span>
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <CategoryBadge cat={p.category} />
                    </td>
                    <td className="px-6 py-3.5 text-center whitespace-nowrap">
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        ₦{p.revenue.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center whitespace-nowrap">
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {p.units.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ───────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex h-[85vh] w-[92%] max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-zinc-800">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  All Products — {PERIOD_LABEL[period]}
                </h2>
                <p className="mt-0.5 text-[11px] text-gray-400">{filtered.length} products</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 dark:border-zinc-700">
                  <Search className="h-3.5 w-3.5 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search products…"
                    className="w-40 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-300"
                  />
                </div>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300"
                >
                  <Download className="h-3.5 w-3.5" /> Export
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modal table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-gray-50 dark:bg-zinc-800">
                  <tr>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                      #
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                      Product
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                      Category
                    </th>
                    <th className="px-5 py-3 text-center text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                      Revenue
                    </th>
                    <th className="px-5 py-3 text-center text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                      Units Sold
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                  {paginated.map((p, i) => (
                    <tr key={p.productId} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/40">
                      <td className="px-5 py-3 text-gray-400">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                      <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{p.name}</td>
                      <td className="px-5 py-3">
                        <CategoryBadge cat={p.category} />
                      </td>
                      <td className="px-5 py-3 text-center font-semibold text-gray-900 dark:text-white">
                        ₦{p.revenue.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-center font-semibold text-gray-900 dark:text-white">
                        {p.units.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400">Rows per page</span>
                <Select
                  defaultValue={String(itemsPerPage)}
                  onValueChange={(v) => {
                    setItemsPerPage(Number(v));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-7 w-16 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20].map((n) => (
                      <SelectItem key={n} value={String(n)} className="text-xs">
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-[11px] text-gray-400">
                  · {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of{" "}
                  {filtered.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-zinc-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
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
