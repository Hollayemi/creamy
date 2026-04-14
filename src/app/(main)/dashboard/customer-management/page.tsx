"use client";

import { useState, useEffect } from "react";
import { Eye, Search, Filter, Download, Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import CustomerProfileDialog from "./_components/customer-profile-dialog";
import { useGetCustomersQuery, GetCustomersParams, Customer } from "@/stores/services/customerApi";

export default function CustomersListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<GetCustomersParams["status"]>("all");
  const [selectedBadge, setSelectedBadge] = useState<GetCustomersParams["badge"]>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedBadge, dateFrom, dateTo, limit]);

  const { data, isLoading, isError, refetch } = useGetCustomersQuery({
    page: currentPage,
    limit,
    search: searchQuery,
    status: selectedStatus,
    badge: selectedBadge,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const customers = data?.data.customers ?? [];
  const stats = data?.data.stats ?? [];
  const pagination = data?.data.pagination ?? { total: 0, totalPages: 1, currentPage: 1, limit: 8 };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string }> = {
      Active: { bg: "bg-green-100", text: "text-green-700" },
      "In-active": { bg: "bg-gray-300", text: "text-gray-700" },
    };

    const variant = variants[status] || variants.Active;

    return (
      <span className={cn("inline-flex rounded-md px-2.5 py-1 text-xs font-medium", variant.bg, variant.text)}>
        {status}
      </span>
    );
  };

  const getBadgeColor = (badge: string) => {
    const colors: Record<string, string> = {
      "Frequent Buyer": "bg-orange-100 text-orange-700",
      "New User": "bg-lime-200 text-lime-700",
    };
    if (badge in colors) {
      return colors[badge as keyof typeof colors];
    }

    return "bg-blue-100 text-blue-700";
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  };

  const toggleAllRows = () => {
    if (selectedRows.length === customers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(customers.map((c) => c.customerId));
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setIsDialogOpen(true);
  };

  const handleExport = () => {
    const params = new URLSearchParams({
      search: searchQuery,
      status: selectedStatus || "all",
      badge: selectedBadge || "all",
      dateFrom: dateFrom,
      dateTo: dateTo,
    });
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/admin/customers/export?${params.toString()}`, "_blank");
  };

  if (isError) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-red-500">Failed to load customers</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-col gap-6 p-2">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="dark:text-primary text-2xl font-semibold text-gray-900">Customer&apos;s List</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all customers across dark stores and regions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-muted text-muted-foreground h-9 gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="bg-muted h-24 animate-pulse rounded-lg border"></div>
            ))
          : stats.map((stat) => (
              <div key={stat.label} className="bg-muted text-muted-foreground rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-foreground text-sm font-medium">{stat.label}</p>
                    <div className="flex items-baseline gap-2 pb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                      {stat.color === "purple" && <span className="h-2 w-10 bg-purple-600"></span>}
                      {stat.color === "orange" && <span className="h-2 w-10 bg-orange-600"></span>}
                      {stat.color === "cyan" && <span className="h-2 w-10 bg-cyan-600"></span>}
                      {stat.color === "red" && <span className="h-2 w-10 bg-red-600"></span>}
                      {stat.color === "blue" && <span className="h-2 w-10 bg-blue-600"></span>}
                    </div>
                    {/* <p className="mt-1 text-xs text-gray-500">{stat.change}</p> */}
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
            placeholder="Search customers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-muted bg-muted text-muted-foreground h-10 pl-10"
          />
        </div>

        <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as GetCustomersParams["status"])}>
          <SelectTrigger className="border-muted bg-muted text-muted-foreground h-10 w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">In-active</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Button
            variant="outline"
            className="border-muted bg-muted text-muted-foreground h-10 gap-2"
            onClick={() => setShowDateFilter(!showDateFilter)}
          >
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
          {showDateFilter && (
            <div className="absolute top-12 z-50 flex w-64 flex-col gap-3 rounded-md border bg-white p-4 shadow-md">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Start Date</label>
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">End Date</label>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        <div className="relative">
          <Button
            variant="outline"
            className="border-muted bg-muted text-muted-foreground h-10 gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          {showFilters && (
            <div className="absolute top-12 z-50 flex w-64 flex-col gap-3 rounded-md border bg-white p-4 shadow-md">
              <p className="text-sm font-medium">Advanced Filters</p>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Badge</label>
                <Select value={selectedBadge} onValueChange={(v) => setSelectedBadge(v as GetCustomersParams["badge"])}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Badges" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Badges</SelectItem>
                    <SelectItem value="frequent_buyer">Frequent Buyer</SelectItem>
                    <SelectItem value="new_user">New User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedBadge("all")}>
                Clear
              </Button>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          className="border-muted bg-muted text-muted-foreground h-10 gap-2"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Customers Table */}
      <div className="border-muted bg-muted text-muted-foreground rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="border-muted bg-primary/10 text-muted-foreground">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.length === customers.length && customers.length > 0}
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
              <TableHead className="font-medium">Profile Name</TableHead>
              <TableHead className="font-medium">Region</TableHead>
              <TableHead className="font-medium">Contact Info</TableHead>
              <TableHead className="font-medium">Total Orders</TableHead>
              <TableHead className="font-medium">Total Spent</TableHead>
              <TableHead className="font-medium">Date Joined</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="text-right font-medium">Action</TableHead>
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
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(customer.id)}
                      onCheckedChange={() => toggleRowSelection(customer.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold",
                          customer.avatarColor,
                        )}
                      >
                        {getInitials(customer.name)}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.region}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{customer.phone}</p>
                      <p className="text-xs text-gray-500">{customer.address}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{customer.totalOrders}</TableCell>
                  <TableCell className="font-medium">₦{customer.totalSpent.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{customer.dateJoined}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(customer.status)}
                      {customer.badges.map((badge) => (
                        <Badge key={badge} className={getBadgeColor(badge)}>
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleViewCustomer(customer)}
                      className="rounded-full p-1.5 text-purple-600 hover:bg-purple-50"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
              <SelectTrigger className="h-9 w-[120px] border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8 Entries</SelectItem>
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
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-16 gap-1 border-gray-300"
              onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage === pagination.totalPages || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Customer Profile Dialog */}
      <CustomerProfileDialog
        customerId={selectedCustomerId}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedCustomerId(null);
        }}
      />
    </div>
  );
}
