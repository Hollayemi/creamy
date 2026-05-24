"use client";

import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Types ─────────────────────────────────────────────────────
export type TopCustomer = {
  name: string;
  region: string;
  totalOrders: number;
  totalSpent: number;
};

type Props = {
  customers: TopCustomer[];
};

// ── Component ─────────────────────────────────────────────────
export default function TopCustomers({ customers }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const paginatedCustomers = customers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const previewCustomers = customers.slice(0, 5);

  return (
    <div>
      {/* ── Main card ───────────────────────────────────────── */}
      <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <div className="mb-4 flex justify-between">
          <h3 className="text-base font-semibold">Top Customers</h3>
          <Button
            variant="ghost"
            className="gap-1 text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="bg-primary/10 text-muted-foreground border-b">
              <TableHead>Customer</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>T. Orders</TableHead>
              <TableHead>Total Spend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewCustomers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-gray-400"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              previewCustomers.map((c, i) => (
                <TableRow
                  key={`${c.name}-${i}`}
                  className="border-b hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.region}</TableCell>
                  <TableCell>{c.totalOrders}</TableCell>
                  <TableCell>₦{c.totalSpent?.toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Modal ───────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[90%] max-w-5xl rounded-lg bg-white p-6 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">All Top Customers</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4 cursor-pointer" />
              </button>
            </div>

            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow className="bg-primary/10 text-muted-foreground border-b">
                  <TableHead>Customer</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>T. Orders</TableHead>
                  <TableHead>Total Spend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.map((c, i) => (
                  <TableRow
                    key={`${c.name}-modal-${i}`}
                    className="border-b hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.region}</TableCell>
                    <TableCell>{c.totalOrders}</TableCell>
                    <TableCell>₦{c.totalSpent.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <Select
                defaultValue={String(itemsPerPage)}
                onValueChange={(v) => {
                  setItemsPerPage(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} Entries
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant="outline"
                      size="sm"
                      className={`h-8 w-8 ${
                        currentPage === page
                          ? "border-purple-600 bg-purple-50 text-purple-600"
                          : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ),
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}