"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useDeleteProductMutation, useGetProductsQuery, useGetProductStatsQuery } from "@/stores/services/productApi";
import ProductImportExportDialog from "./_components/product-import-export-dialog";

export default function ProductsListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"active" | "inactive" | "all" | "low-stock" | "out-of-stock">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentRow, setCurrentRow] = useState<string>("");
  const [importExportOpen, setImportExportOpen] = useState(false);

  const [handleDelete, { isLoading: deleting }] = useDeleteProductMutation();
  const { data, isLoading } = useGetProductsQuery({ page: currentPage, status: selectedStatus, search: searchQuery });
  const {data:statsRaw} = useGetProductStatsQuery();
  const products = data?.data?.products || [];
  const stats = statsRaw?.data || {};

  const { totalProducts={}, inStock={}, outOfStock={}, lowStock={}, categories={} } = stats

  console.log(stats)

  const statsData = [
  { label: "Total Products", value: totalProducts?.value || 0, change: totalProducts.change, changeType: "increase", color: "purple" },
  { label: "In Stock", value: inStock?.value || 0, change: inStock.change, changeType: "increase", color: "orange" },
  { label: "Low Stock", value: lowStock?.value || 0, change: lowStock.change, changeType: "increase", color: "cyan" },
  { label: "Out of Stock", value: outOfStock?.value || 0, change: outOfStock.change, changeType: "increase", color: "red" },
  { label: "Categories", value: categories?.value || 0, change: categories.change, changeType: "neutral", color: "blue" },
];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string }> = {
      Active: { bg: "bg-green-100", text: "text-green-700" },
      "Low Stock": { bg: "bg-orange-100", text: "text-orange-700" },
      "Out of Stock": { bg: "bg-red-100", text: "text-red-700" },
    };
    const variant = variants[status] || variants.Active;
    return (
      <span className={cn("inline-flex rounded-md px-2.5 py-1 text-xs font-medium", variant.bg, variant.text)}>
        {status}
      </span>
    );
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  };

  const toggleAllRows = () => {
    if (selectedRows.length === products.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(products.map((p: any) => p._id));
    }
  };

  const goTo = (link: string) => router.push(link);

  const deleteHandler = (id: string) => {
    setCurrentRow(id);
    handleDelete(id).then((e) => console.log(e));
  };

  return (
    <div className="flex flex-col gap-6 p-2">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="dark:text-primary text-2xl font-semibold text-gray-900">Products List</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all products available across dark stores and regions</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Import / Export button */}
          <Button
            variant="outline"
            className="bg-muted text-muted-foreground h-9 gap-2"
            onClick={() => setImportExportOpen(true)}
          >
            <Upload className="h-4 w-4" />
            Import / Export
          </Button>
          <Button
            className="bg-primary h-9 gap-2 text-white"
            onClick={() => router.push("/dashboard/product-management/create")}
          >
            + Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-muted text-muted-foreground rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-foreground text-sm font-medium">{stat.label}</p>
                <div className="flex items-baseline gap-2 pb-2">
                  <h3 className="text-muted-foreground text-2xl font-bold">
                    {parseInt(stat.value || "0")?.toLocaleString()}
                  </h3>
                  {stat.color === "purple" && <span className="h-2 w-10 bg-purple-600"></span>}
                  {stat.color === "orange" && <span className="h-2 w-10 bg-orange-600"></span>}
                  {stat.color === "cyan" && <span className="h-2 w-10 bg-cyan-600"></span>}
                  {stat.color === "red" && <span className="h-2 w-10 bg-red-600"></span>}
                  {stat.color === "blue" && <span className="h-2 w-10 bg-blue-600"></span>}
                </div>
                <p className="mt-1 text-xs text-gray-500">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[300px] flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search product"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-muted bg-muted text-muted-foreground h-10 pl-10"
          />
        </div>

        <Select
          value={selectedStatus}
          onValueChange={(v) => setSelectedStatus(v as "active" | "inactive" | "all" | "low-stock" | "out-of-stock")}
        >
          <SelectTrigger className="border-muted bg-muted text-muted-foreground h-10 w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">In Active</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="border-muted bg-muted text-muted-foreground h-10 gap-2">
          <Calendar className="h-4 w-4" />
          Time Frame
        </Button>

        <Button variant="outline" className="border-muted bg-muted text-muted-foreground h-10 gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>

        <Button
          variant="outline"
          className="border-muted bg-muted text-muted-foreground h-10 gap-2"
          onClick={() => setImportExportOpen(true)}
        >
          <FileDown className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Products Table */}
      <div className="border-muted bg-muted text-muted-foreground rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="border-muted bg-muted text-muted-foreground">
              <TableHead className="w-12">
                <Checkbox checked={selectedRows.length === products.length} onCheckedChange={toggleAllRows} />
              </TableHead>
              <TableHead className="font-medium">Product Name</TableHead>
              <TableHead className="font-medium">SKU / ID</TableHead>
              <TableHead className="font-medium">Category</TableHead>
              <TableHead className="font-medium">Price (₦)</TableHead>
              <TableHead className="font-medium">Stock</TableHead>
              <TableHead className="font-medium">Sold</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={9}>
                    <div className="h-10 animate-pulse rounded bg-gray-100"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-muted-foreground h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(product._id)}
                      onCheckedChange={() => toggleRowSelection(product._id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.productName}</TableCell>
                  <TableCell className="">{product.sku}</TableCell>
                  <TableCell className="">{product.category.name}</TableCell>
                  <TableCell className="font-medium">{product.salesPrice.toLocaleString()}</TableCell>
                  <TableCell className="">{product.stockQuantity}</TableCell>
                  <TableCell className="">{product?.minimumStockAlert || 0}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => goTo(`/dashboard/product-management/preview?id=${product._id}`)}
                        className="rounded-full p-1.5 text-purple-600 hover:bg-purple-50"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => goTo(`/dashboard/product-management/edit?id=${product._id}`)}
                        className="rounded-full p-1.5 text-orange-600 hover:bg-orange-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="rounded-full p-1.5 text-red-600 hover:bg-red-50"
                      >
                        {deleting && currentRow === product._id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Select defaultValue="11">
              <SelectTrigger className="h-9 w-[100px] border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 Entries</SelectItem>
                <SelectItem value="11">11 Entries</SelectItem>
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
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 w-8 border-gray-300",
                    currentPage === page && "border-purple-600 bg-purple-50 text-purple-600",
                  )}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <span className="px-2 text-sm text-gray-500">...</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-16 gap-1 border-gray-300"
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Import / Export Dialog */}
      <ProductImportExportDialog
        open={importExportOpen}
        onOpenChange={setImportExportOpen}
        exportParams={{ search: searchQuery, status: selectedStatus !== "all" ? selectedStatus : undefined }}
      />
    </div>
  );
}
