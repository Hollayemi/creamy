"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

type Customer = {
  name: string;
  region: string;
  orders: number;
  spend: number;
};

export default function TopCustomers() {
  const customers: Customer[] = [
    { name: "Adetola James", region: "Surulere", orders: 18, spend: 12800 },
    { name: "Funke Ade", region: "Ikeja", orders: 24, spend: 15600 },
    { name: "Chidi Nwosu", region: "Victoria Island", orders: 30, spend: 20400 },
    { name: "Aisha Bello", region: "Lekki", orders: 15, spend: 9800 },
    { name: "Emeka Okafor", region: "Yaba", orders: 12, spend: 7800 },
    { name: "Temitope Ade", region: "Ikorodu", orders: 9, spend: 4500 },
    { name: "Ngozi Obi", region: "Ajah", orders: 21, spend: 13400 },
    { name: "Olusegun Adebayo", region: "Magodo", orders: 17, spend: 10200 },
    { name: "Blessing Uche", region: "Surulere", orders: 14, spend: 8600 },
    { name: "Michael Johnson", region: "Ikeja", orders: 19, spend: 11500 },
    { name: "Fatima Yusuf", region: "Lekki", orders: 11, spend: 7200 },
    { name: "Kunle Adewale", region: "Victoria Island", orders: 25, spend: 17500 },
    { name: "Ngozi Nnamdi", region: "Ajah", orders: 16, spend: 10400 },
    { name: "Samuel Ade", region: "Yaba", orders: 22, spend: 13800 },
    { name: "Amina Bello", region: "Ikorodu", orders: 8, spend: 4000 },
    { name: "Chuka Obi", region: "Magodo", orders: 20, spend: 13000 },
    { name: "Tosin Adeyemi", region: "Lekki", orders: 18, spend: 11200 },
    { name: "Ify Okeke", region: "Surulere", orders: 13, spend: 8600 },
    { name: "Femi Oladipo", region: "Ikeja", orders: 27, spend: 18200 },
    { name: "Halima Musa", region: "Ajah", orders: 15, spend: 9400 },
    { name: "Emmanuel Chukwu", region: "Yaba", orders: 10, spend: 5600 },
    { name: "Kemi Afolabi", region: "Magodo", orders: 19, spend: 11800 },
    { name: "Victor Onu", region: "Lekki", orders: 21, spend: 14000 },
    { name: "Maryam Sani", region: "Ikorodu", orders: 12, spend: 6500 },
    { name: "Uche Nwankwo", region: "Victoria Island", orders: 26, spend: 19000 },
    { name: "Adewale Akin", region: "Surulere", orders: 14, spend: 9000 },
    { name: "Chioma Eze", region: "Ajah", orders: 23, spend: 15200 },
    { name: "Jide Adebayo", region: "Ikeja", orders: 17, spend: 10800 },
    { name: "Halima Bello", region: "Lekki", orders: 16, spend: 10200 },
    { name: "Emeka Ifeanyi", region: "Yaba", orders: 20, spend: 12800 },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const paginatedCustomers = customers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {/* Main Top Customers */}
      <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <div className="mb-4 flex justify-between">
          <h3 className="text-base font-semibold">Top Customers</h3>
          <Button variant="ghost" className="gap-1 text-sm" onClick={() => setIsModalOpen(true)}>
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
            {customers.slice(0, 5).map((c, i) => (
              <TableRow key={i} className="border-b hover:bg-gray-50 dark:hover:bg-zinc-800">
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.region}</TableCell>
                <TableCell>{c.orders}</TableCell>
                <TableCell>₦{c.spend.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal for all customers */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[90%] max-w-5xl rounded-lg bg-white p-6 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">All Customers</h2>
              <X className="h-4 w-4 cursor-pointer" onClick={() => setIsModalOpen(false)} />
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
                  <TableRow key={i} className="border-b hover:bg-gray-50 dark:hover:bg-zinc-800">
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.region}</TableCell>
                    <TableCell>{c.orders}</TableCell>
                    <TableCell>₦{c.spend.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
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

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-20 gap-1 border-gray-300"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                      className={`h-8 w-8 border-gray-300 ${currentPage === page ? "border-purple-600 bg-purple-50 text-purple-600" : ""}`}
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
