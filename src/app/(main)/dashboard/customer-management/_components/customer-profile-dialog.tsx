"use client";

import { useState } from "react";
import { X, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useGetCustomerByIdQuery } from "@/stores/services/customerApi";

interface CustomerProfileDialogProps {
  customerId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerProfileDialog({ customerId, isOpen, onClose }: CustomerProfileDialogProps) {
  const [selectedPurchaseRows, setSelectedPurchaseRows] = useState<string[]>([]);
  const [selectedActivityRows, setSelectedActivityRows] = useState<number[]>([]);
  const [selectedLoyaltyRows, setSelectedLoyaltyRows] = useState<number[]>([]);

  const { data, isLoading, isError } = useGetCustomerByIdQuery(customerId!, {
    skip: !isOpen || !customerId,
  });

  const customer = data?.data;

  if (!isOpen) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const toggleAllPurchaseRows = () => {
    if (!customer) return;
    if (selectedPurchaseRows.length === customer.purchaseHistory.length) {
      setSelectedPurchaseRows([]);
    } else {
      setSelectedPurchaseRows(customer.purchaseHistory.map((order) => order.orderId));
    }
  };

  const togglePurchaseRowSelection = (orderId: string) => {
    setSelectedPurchaseRows((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId],
    );
  };

  const toggleAllActivityRows = () => {
    if (!customer) return;
    if (selectedActivityRows.length === customer.customerActivity.length) {
      setSelectedActivityRows([]);
    } else {
      setSelectedActivityRows(customer.customerActivity.map((_, index) => index));
    }
  };

  const toggleActivityRowSelection = (index: number) => {
    setSelectedActivityRows((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const toggleAllLoyaltyRows = () => {
    if (!customer) return;
    if (selectedLoyaltyRows.length === customer.loyaltyProgress.length) {
      setSelectedLoyaltyRows([]);
    } else {
      setSelectedLoyaltyRows(customer.loyaltyProgress.map((_, index) => index));
    }
  };

  const toggleLoyaltyRowSelection = (index: number) => {
    setSelectedLoyaltyRows((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getActivityStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Successful: "bg-green-100 text-green-800",
      Failed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 text-gray-900">
      <div className="relative flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-900">
        {isLoading ? (
          <div className="flex h-96 flex-col items-center justify-center gap-4 bg-white dark:bg-gray-900">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
            <p className="text-gray-500">Loading customer profile...</p>
          </div>
        ) : isError || !customer ? (
          <div className="flex h-96 flex-col items-center justify-center gap-4 bg-white dark:bg-gray-900">
            <p className="text-red-500">Failed to load customer profile</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b bg-gray-50 p-6 dark:bg-gray-800">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold",
                    customer.avatarColor,
                  )}
                >
                  {getInitials(customer.name)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{customer.name}</h2>
                    <Badge
                      className={cn(
                        customer.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800",
                      )}
                    >
                      {customer.status}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Customer ID: {customer.customerId}</span>
                    <span>•</span>
                    <span>Last Activity: {customer.lastActivity}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() =>
                    window.open(
                      `${process.env.NEXT_PUBLIC_API_URL}/admin/customers/export?search=${customer.email}`,
                      "_blank",
                    )
                  }
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <button
                  onClick={onClose}
                  className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content - scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-12 gap-6 p-6">
                {/* Left Column - Profile Summary & Stats */}
                <div className="col-span-12 space-y-6 text-gray-900 lg:col-span-4 dark:text-white">
                  {/* Customer Profile Summary */}
                  <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold">Customer Profile Summary</h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                        <p className="font-semibold">{customer.name}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Email Address</p>
                        <p className="font-semibold">{customer.email}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Phone Number</p>
                        <p className="font-semibold">{customer.phone}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Region</p>
                        <p className="font-semibold">{customer.region}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Date Joined</p>
                        <p className="font-semibold">{customer.dateJoined}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                        <p className="font-semibold">{customer.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Stats Overview */}
                  <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold">Customer Stats Overview</h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                        <p className="text-2xl font-bold">{customer.stats.totalOrders}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                        <p className="text-2xl font-bold">₦{customer.stats.totalSpent.toLocaleString()}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Average Order Value</p>
                        <p className="text-2xl font-bold">₦{customer.stats.averageOrderValue.toLocaleString()}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Last Order Date</p>
                        <p className="text-lg font-semibold">{customer.stats.lastOrderDate}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Cancelled Orders</p>
                        <p className="text-lg font-semibold">{customer.stats.cancelledOrders}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Tabs */}
                <div className="col-span-12 lg:col-span-8">
                  <Tabs defaultValue="purchase" className="w-full">
                    <TabsList className="h-12 w-full justify-start rounded-none border-b bg-transparent p-0">
                      <TabsTrigger
                        value="purchase"
                        className="rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:bg-transparent data-[state=active]:text-purple-600 dark:text-gray-400 dark:data-[state=active]:text-purple-400"
                      >
                        Purchase History
                      </TabsTrigger>
                      <TabsTrigger
                        value="activity"
                        className="rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:bg-transparent data-[state=active]:text-purple-600 dark:text-gray-400 dark:data-[state=active]:text-purple-400"
                      >
                        Customer Activity
                      </TabsTrigger>
                      <TabsTrigger
                        value="loyalty"
                        className="rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:bg-transparent data-[state=active]:text-purple-600 dark:text-gray-400 dark:data-[state=active]:text-purple-400"
                      >
                        Loyalty Progress
                      </TabsTrigger>
                    </TabsList>

                    {/* Purchase History Tab */}
                    <TabsContent value="purchase" className="mt-6">
                      <div className="overflow-hidden rounded-lg border">
                        <Table>
                          <TableHeader className="bg-purple-50 dark:bg-purple-900/20">
                            <TableRow>
                              <TableHead className="w-12">
                                <Checkbox
                                  checked={
                                    selectedPurchaseRows.length === customer.purchaseHistory.length &&
                                    customer.purchaseHistory.length > 0
                                  }
                                  onCheckedChange={toggleAllPurchaseRows}
                                />
                              </TableHead>
                              <TableHead className="font-semibold whitespace-nowrap">Order ID</TableHead>
                              <TableHead className="font-semibold whitespace-nowrap">Date & Time</TableHead>
                              <TableHead className="font-semibold whitespace-nowrap">Items</TableHead>
                              <TableHead className="font-semibold whitespace-nowrap">Amount</TableHead>
                              <TableHead className="font-semibold whitespace-nowrap">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {customer.purchaseHistory.map((order, index) => (
                              <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <TableCell>
                                  <Checkbox
                                    checked={selectedPurchaseRows.includes(order.orderId)}
                                    onCheckedChange={() => togglePurchaseRowSelection(order.orderId)}
                                  />
                                </TableCell>
                                <TableCell className="font-medium break-all">{order.orderId}</TableCell>
                                <TableCell className="whitespace-normal">{order.date}</TableCell>
                                <TableCell>{order.items}</TableCell>
                                <TableCell className="font-semibold whitespace-nowrap">
                                  ₦{order.amount.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Badge className={getStatusBadge(order.status)}>{order.status}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>

                    {/* Customer Activity Tab */}
                    <TabsContent value="activity" className="mt-6">
                      <div className="overflow-hidden rounded-lg border">
                        <Table>
                          <TableHeader className="bg-purple-50 dark:bg-purple-900/20">
                            <TableRow>
                              <TableHead className="w-12">
                                <Checkbox
                                  checked={
                                    selectedActivityRows.length === customer.customerActivity.length &&
                                    customer.customerActivity.length > 0
                                  }
                                  onCheckedChange={toggleAllActivityRows}
                                />
                              </TableHead>
                              <TableHead className="font-semibold whitespace-nowrap">Date & Time</TableHead>
                              <TableHead className="font-semibold whitespace-nowrap">Activity</TableHead>
                              <TableHead className="font-semibold whitespace-nowrap">Details</TableHead>
                              <TableHead className="font-semibold whitespace-nowrap">Status / Outcome</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {customer.customerActivity.map((activity, index) => (
                              <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <TableCell>
                                  <Checkbox
                                    checked={selectedActivityRows.includes(index)}
                                    onCheckedChange={() => toggleActivityRowSelection(index)}
                                  />
                                </TableCell>
                                <TableCell className="">{activity.date}</TableCell>
                                <TableCell className="font-medium whitespace-normal">{activity.activity}</TableCell>
                                <TableCell className="max-w-xs break-words whitespace-normal">
                                  {activity.details}
                                </TableCell>
                                <TableCell>
                                  <Badge className={getActivityStatusBadge(activity.status)}>{activity.status}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>

                    {/* Loyalty Progress Tab */}
                    <TabsContent value="loyalty" className="mt-6">
                      <div className="overflow-hidden rounded-lg border">
                        <Table>
                          <TableHeader className="bg-purple-50 dark:bg-purple-900/20">
                            <TableRow>
                              <TableHead className="w-12">
                                <Checkbox
                                  checked={
                                    selectedLoyaltyRows.length === customer.loyaltyProgress.length &&
                                    customer.loyaltyProgress.length > 0
                                  }
                                  onCheckedChange={toggleAllLoyaltyRows}
                                />
                              </TableHead>
                              <TableHead className="font-semibold whitespace-nowrap">Date & Time</TableHead>
                              <TableHead className="font-semibold whitespace-nowrap">Event</TableHead>
                              <TableHead className="font-semibold whitespace-nowrap">Points Earned</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {customer.loyaltyProgress.map((loyalty, index) => (
                              <TableRow key={`${loyalty.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <TableCell>
                                  <Checkbox
                                    checked={selectedLoyaltyRows.includes(index)}
                                    onCheckedChange={() => toggleLoyaltyRowSelection(index)}
                                  />
                                </TableCell>
                                <TableCell className="whitespace-normal">{loyalty.date}</TableCell>
                                <TableCell className="font-medium whitespace-normal">{loyalty.event}</TableCell>
                                <TableCell>
                                  <span
                                    className={`font-semibold ${
                                      loyalty.points >= 0 ? "text-green-600" : "text-red-600"
                                    }`}
                                  >
                                    {loyalty.points >= 0 ? "+" : ""}
                                    {loyalty.points} points
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div className="flex justify-end p-4">
                          <div className="text-lg font-bold text-purple-600">
                            Total Points: {customer.totalLoyaltyPoints}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
