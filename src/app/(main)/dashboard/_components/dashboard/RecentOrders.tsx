"use client";

import { Eye, Trash2, ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order } from "@/app/(main)/dashboard/_components/dashboard/data/orders";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RecentOrders({
  orders,
  setOrders,
}: {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}) {
  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  };

  const toggleAllRows = () => {
    if (selectedRows.length === orders.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(orders.map((o) => o.id));
    }
  };

  function formatDateTime(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${day}/${month}/${year} - ${hours}:${minutes}${ampm}`;
  }

  const statusColor = {
    Waiting: "text-yellow-500",
    Delivered: "text-green-500",
    "In-Transit": "text-purple-500",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {/* Main Recent Orders */}
      <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <div className="mb-4 flex justify-between">
          <h3 className="text-base font-semibold">Recent Orders</h3>
          <Button variant="ghost" className="gap-1" onClick={() => setIsModalOpen(true)}>
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-muted bg-muted text-muted-foreground rounded-lg border">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-muted bg-primary/10 text-muted-foreground">
                <TableHead className="w-12">
                  <Checkbox checked={selectedRows.length === orders.length} onCheckedChange={toggleAllRows} />
                </TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date/Time</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 5).map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-red-300!">
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(order.id)}
                      onCheckedChange={() => toggleRowSelection(order.id)}
                    />
                  </TableCell>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.region}</TableCell>
                  <TableCell className={statusColor[order.status]}>{order.status}</TableCell>
                  <TableCell>₦{order.amount.toLocaleString()}</TableCell>
                  <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                  <TableCell className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Edit Order</DropdownMenuItem>
                        <DropdownMenuItem>View Full Order</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

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
                          <AlertDialogAction onClick={() => deleteOrder(order.id)} className="bg-red-600">
                            Delete
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[90%] max-w-5xl rounded-lg bg-white p-6 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">All Orders</h2>
              <X onClick={() => setIsModalOpen(false)} className="h-4 w-4">
                X
              </X>
            </div>

            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow className="border-muted bg-primary/10 text-muted-foreground">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date/Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-red-300!">
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.region}</TableCell>
                    <TableCell className={statusColor[order.status]}>{order.status}</TableCell>
                    <TableCell>₦{order.amount.toLocaleString()}</TableCell>
                    <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              <div className="flex items-center gap-2">
                <Select
                  defaultValue={String(itemsPerPage)}
                  onValueChange={(val) => {
                    setItemsPerPage(Number(val));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-9 w-[100px] border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Entries</SelectItem>
                    <SelectItem value="10">10 Entries</SelectItem>
                    <SelectItem value="20">20 Entries</SelectItem>
                    <SelectItem value="50">50 Entries</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-20 gap-1 border-gray-300"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant="outline"
                      size="sm"
                      className={`h-8 w-8 border-gray-300 ${
                        currentPage === page ? "border-purple-600 bg-purple-50 text-purple-600" : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-16 gap-1 border-gray-300"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
