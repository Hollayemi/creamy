"use client";

import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useState, useMemo, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ordersData } from "@/app/(main)/dashboard/_components/dashboard/data/orders";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid } from "recharts";

export default function RegionalPerformance() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedSort, setSelectedSort] = useState<
    "sales-desc" | "sales-asc" | "orders-desc" | "orders-asc" | "name-asc"
  >("sales-desc");

  const normalizeRegion = (region: string) => region.toLowerCase().replace(/[\s-]/g, "");

  /* ==========================
     Aggregate & Sort Region Data
  =========================== */
  const formattedRegions = useMemo(() => {
    const regionMap: Record<string, { totalAmount: number; orderCount: number; label: string }> = {};

    ordersData.forEach((order) => {
      const key = normalizeRegion(order.region);
      if (!regionMap[key]) {
        regionMap[key] = { totalAmount: 0, orderCount: 0, label: order.region };
      }
      regionMap[key].totalAmount += order.amount;
      regionMap[key].orderCount += 1;
    });

    const totalOrders = ordersData.length;
    const getRegionPercentage = (count: number) => (totalOrders === 0 ? 0 : Math.round((count / totalOrders) * 100));

    const regions = Object.values(regionMap).map((region) => ({
      name: region.label,
      totalIncome: region.totalAmount,
      totalOrders: region.orderCount,
      percent: getRegionPercentage(region.orderCount),
    }));

    const sortFunctions: Record<string, (a: any, b: any) => number> = {
      "sales-desc": (a, b) => b.totalIncome - a.totalIncome,
      "sales-asc": (a, b) => a.totalIncome - b.totalIncome,
      "orders-desc": (a, b) => b.totalOrders - a.totalOrders,
      "orders-asc": (a, b) => a.totalOrders - b.totalOrders,
      "name-asc": (a, b) => a.name.localeCompare(b.name),
    };

    return regions.sort(sortFunctions[selectedSort]);
  }, [selectedSort]);

  const isOrderSort = selectedSort === "orders-asc" || selectedSort === "orders-desc";

  /* ==========================
     Bubble Chart Data
  =========================== */
  const bubbleData = formattedRegions.map((region, index) => ({
    x: index + 1,
    y: isOrderSort ? region.totalOrders : region.totalIncome,
    z: region.percent,
    name: region.name,
  }));

  /* ==========================
     Pagination
  =========================== */
  const totalPages = Math.ceil(formattedRegions.length / itemsPerPage);
  const paginatedRegions = formattedRegions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  /* ==========================
     Region Colors
  =========================== */
  const regionColors: Record<string, string> = {
    agege: "bg-red-500",
    ajeromiifelodun: "bg-red-400",
    alimosho: "bg-emerald-500",
    amuwoodofin: "bg-violet-500",
    apapa: "bg-amber-500",
    badagry: "bg-sky-500",
    epe: "bg-orange-500",
    etiosa: "bg-blue-400",
    ibejulekki: "bg-purple-500",
    ifakoijaiye: "bg-blue-500",
    ikeja: "bg-green-500",
    ikorodu: "bg-indigo-500",
    kosofe: "bg-pink-500",
    lagosisland: "bg-teal-500",
    lagosmainland: "bg-cyan-500",
    mushin: "bg-rose-500",
    ojo: "bg-lime-500",
    oshodiisolo: "bg-fuchsia-500",
    shomolu: "bg-green-400",
    surulere: "bg-yellow-500",
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
      <h3 className="mb-2 font-semibold">Regional Performance</h3>

      {/* Sort Dropdown */}
      <div className="mb-1 flex justify-end">
        <Select value={selectedSort} onValueChange={(v) => setSelectedSort(v as any)}>
          <SelectTrigger className="border-muted bg-muted text-muted-foreground h-9 w-[200px]">
            <SelectValue placeholder="Sort Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales-desc">Highest Sales</SelectItem>
            <SelectItem value="sales-asc">Lowest Sales</SelectItem>
            <SelectItem value="orders-desc">Most Orders</SelectItem>
            <SelectItem value="orders-asc">Least Orders</SelectItem>
            <SelectItem value="name-asc">Region A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bubble Chart */}
      <div className="h-50 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="Region Index" tick={false} />
            <YAxis
              type="number"
              dataKey="y"
              name={isOrderSort ? "Orders" : "Revenue"}
              tickFormatter={(value) => (isOrderSort ? value : `₦${value / 1000}k`)}
            />
            <ZAxis type="number" dataKey="z" range={[60, 400]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value, name) => (name === "Revenue" ? `₦${Number(value).toLocaleString()}` : `${value}%`)}
              labelFormatter={(label, payload) => payload?.[0]?.payload?.name || ""}
            />
            <Scatter name="Regions" data={bubbleData} fill="#7c3aed" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Preview Table */}
      <Table className="w-full text-sm">
        <TableBody>
          {formattedRegions.slice(0, 2).map((region) => {
            const key = normalizeRegion(region.name);
            return (
              <TableRow key={region.name}>
                <TableCell className="font-medium">{region.name}</TableCell>
                <TableCell>{isOrderSort ? region.totalOrders : `₦${region.totalIncome.toLocaleString()}`}</TableCell>
                <TableCell className="w-full">
                  <div className="h-2 rounded bg-gray-200">
                    <div
                      className={`h-2 rounded ${regionColors[key] || "bg-purple-500"}`}
                      style={{ width: `${region.percent}%` }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right">{region.percent}%</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* View All Button */}
      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => {
            setIsModalOpen(true);
            setCurrentPage(1);
          }}
        >
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[90%] max-w-5xl rounded-lg bg-white p-6 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">All Regions</h2>
              <X onClick={() => setIsModalOpen(false)} className="h-4 w-4 cursor-pointer" />
            </div>

            {/* Modal Sort Dropdown */}
            <div className="mb-4 flex justify-end">
              <Select value={selectedSort} onValueChange={(v) => setSelectedSort(v as any)}>
                <SelectTrigger className="border-muted bg-muted text-muted-foreground h-9 w-[200px]">
                  <SelectValue placeholder="Sort Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales-desc">Highest Sales</SelectItem>
                  <SelectItem value="sales-asc">Lowest Sales</SelectItem>
                  <SelectItem value="orders-desc">Most Orders</SelectItem>
                  <SelectItem value="orders-asc">Least Orders</SelectItem>
                  <SelectItem value="name-asc">Region A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table className="w-full text-sm">
              <TableBody>
                {paginatedRegions.map((region) => {
                  const key = normalizeRegion(region.name);
                  return (
                    <TableRow key={region.name}>
                      <TableCell>{region.name}</TableCell>
                      <TableCell>
                        {isOrderSort ? region.totalOrders : `₦${region.totalIncome.toLocaleString()}`}
                      </TableCell>
                      <TableCell className="w-full">
                        <div className="h-2 rounded bg-gray-200">
                          <div
                            className={`h-2 rounded ${regionColors[key] || "bg-purple-500"}`}
                            style={{ width: `${region.percent}%` }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{region.percent}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={(val) => {
                    setItemsPerPage(Number(val));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-9 w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Entries</SelectItem>
                    <SelectItem value="10">10 Entries</SelectItem>
                    <SelectItem value="20">20 Entries</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      size="sm"
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
