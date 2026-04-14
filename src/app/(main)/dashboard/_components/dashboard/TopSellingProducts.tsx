"use client";

import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const productNames = [
  "Milo Refill",
  "Peak Milk Tin",
  "Golden Morn",
  "Indomie Noodles",
  "Nescafe Coffee",
  "Sunlight Soap",
  "Lipton Tea",
  "Coke Can",
  "Sprite Bottle",
  "Cadbury Chocolate",
  "Ovaltine",
  "Maggi Cubes",
  "Fanta Can",
  "Lays Chips",
  "Tropical Juice",
  "Nestle Pure Water",
  "Pepsi Bottle",
  "Royal Gala Apple",
  "Heineken Beer",
  "Nestle Yogurt",
  "Chivita Juice",
  "Sunflower Oil",
  "Pampers Diaper",
  "Sardine Tin",
  "Eva Water",
  "Tomato Paste",
  "Amstel Malta",
  "Frytol Oil",
  "Kellogg Cornflakes",
  "Cocoa Powder",
  "Mackerel Tin",
  "Honey Jar",
  "Pure Fry Oil",
  "Dettol Soap",
  "Evaporated Milk",
  "Cottage Cheese",
  "Maltina",
  "Egg Pack",
  "Omo Detergent",
  "Guinness Stout",
  "Tide Detergent",
  "Peanut Butter",
  "Sugar Bag",
  "Salt Pack",
  "Rice 50kg",
  "Wheat Flour",
  "Tomato Ketchup",
  "Mayonnaise",
  "Cooking Oil",
];

const categories = ["Groceries", "Baby & Kids", "Beverages", "Household"];

// Category colors
const categoryColor: Record<string, string> = {
  "Baby & Kids": "bg-purple-100 text-purple-700",
  Groceries: "bg-green-100 text-green-700",
  Beverages: "bg-blue-100 text-blue-700",
  Household: "bg-yellow-100 text-yellow-800",
};

const products = productNames.map((name, i) => ({
  product: name,
  category: categories[i % categories.length],
  units: Math.floor(Math.random() * 2000) + 100,
  revenue: Math.floor(Math.random() * 5000000) + 50000,
}));

export default function TopSellingProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Top-Selling Products</h3>
        <Button variant="ghost" className="gap-1 text-sm" onClick={() => setIsModalOpen(true)}>
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable Table */}
      <div className="border-muted max-h-96 overflow-y-auto rounded-lg border">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="bg-primary/10 text-muted-foreground">
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Units Sold</TableHead>
              <TableHead>Revenue (₦)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.slice(0, 5).map((p, i) => (
              <TableRow key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <TableCell>{p.product}</TableCell>
                <TableCell>
                  <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${categoryColor[p.category]}`}>
                    {p.category}
                  </span>
                </TableCell>
                <TableCell>{p.units.toLocaleString()}</TableCell>
                <TableCell>₦{p.revenue.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[90%] max-w-5xl rounded-lg bg-white p-6 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">All Top-Selling Products</h2>
              <X onClick={() => setIsModalOpen(false)} className="h-4 w-4 cursor-pointer" />
            </div>

            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow className="bg-primary/10 text-muted-foreground">
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Units Sold</TableHead>
                  <TableHead>Revenue (₦)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((p, i) => (
                  <TableRow key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <TableCell>{p.product}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block rounded px-2 py-1 text-xs font-medium ${categoryColor[p.category]}`}
                      >
                        {p.category}
                      </span>
                    </TableCell>
                    <TableCell>{p.units.toLocaleString()}</TableCell>
                    <TableCell>₦{p.revenue.toLocaleString()}</TableCell>
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
                  <ChevronLeft className="h-4 w-4" /> Previous
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
