"use client";

import {
  Eye,
  Trash2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────
export type OrderStatus = "Waiting" | "Delivered" | "In-Transit";

export type Order = {
  orderId: string;                   // MongoDB ObjectId as string
  orderNumber: string;          // "#GK-10234"
  customerName: string;
  region: string;
  amount: number;
  status: OrderStatus;
  createdAt: Date | string;
};

type Props = {
  orders: Order[];
};

// ── Helpers ───────────────────────────────────────────────────
function formatDateTime(raw: Date | string): string {
  const date = new Date(raw);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day}/${month}/${year} - ${hours}:${minutes}${ampm}`;
}

const statusColor: Record<OrderStatus, string> = {
  Waiting: "text-yellow-500",
  Delivered: "text-green-500",
  "In-Transit": "text-purple-500",
};

// ── Component ─────────────────────────────────────────────────
export default function RecentOrders({ orders }: Props) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleRow = (id: string) =>
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );

  const toggleAll = () =>
    setSelectedRows(
      selectedRows.length === orders.length ? [] : orders.map((o) => o.orderId),
    );

  // Preview table (first 5, shown on page)
  const previewOrders = orders.slice(0, 5);

  return (
    <div>
      {/* ── Main card ───────────────────────────────────────── */}
      <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <div className="mb-4 flex justify-between">
          <h3 className="text-base font-semibold">Recent Orders</h3>
          <Button
            variant="ghost"
            className="gap-1"
            onClick={() => setIsModalOpen(true)}
          >
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-muted bg-muted text-muted-foreground rounded-lg border">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-muted bg-primary/10 text-muted-foreground">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedRows.length === orders.length &&
                      orders.length > 0
                    }
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {previewOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-8 text-center text-gray-400"
                  >
                    No recent orders
                  </TableCell>
                </TableRow>
              ) : (
                previewOrders.map((order) => (
                  <TableRow
                    key={order.orderId}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(order.orderId)}
                        onCheckedChange={() => toggleRow(order.orderId)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.region}</TableCell>
                    <TableCell
                      className={`font-medium ${statusColor[order.status]}`}
                    >
                      {order.status}
                    </TableCell>
                    <TableCell>₦{order.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-xs">
                      {formatDateTime(order.createdAt)}
                    </TableCell>
                    <TableCell className="flex gap-2">
                          <Link href={`/dashboard/order-management?slug=${order.orderNumber}`}>
                            <Eye className="h-4 w-4 mt-2" />
                          </Link>
                      

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <p>Are you sure you want to delete this order?</p>
                          <div className="mt-4 flex justify-end gap-3">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600">
                              Delete
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── All-orders modal ─────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[90%] max-w-5xl rounded-lg bg-white p-6 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">All Orders</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow className="border-muted bg-primary/10 text-muted-foreground">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date / Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow
                    key={order.orderNumber}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    <TableCell className="font-mono text-xs">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.region}</TableCell>
                    <TableCell
                      className={`font-medium ${statusColor[order.status]}`}
                    >
                      {order.status}
                    </TableCell>
                    <TableCell>₦{order.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-xs">
                      {formatDateTime(order.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
              <Select
                defaultValue={String(itemsPerPage)}
                onValueChange={(v) => {
                  setItemsPerPage(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-[110px] border-gray-300">
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
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
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