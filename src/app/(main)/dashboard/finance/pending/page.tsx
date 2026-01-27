"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Receipt, Eye, CheckCircle, AlertCircle, Download } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { mockPendingPayments } from "../_components/mock";
import { FinancePendingColumns } from "../_components/pending.columns";

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  MEDIUM: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  HIGH: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function PendingPaymentsPage() {
  const router = useRouter();
  const [data, setData] = useState<PendingPayment[]>(mockPendingPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredData = useMemo(
    () =>
      data.filter((payment) => {
        const matchesPriority = priorityFilter === "all" || payment.priority === priorityFilter;
        const matchesSearch =
          searchQuery === "" ||
          payment.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.itemName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesPriority && matchesSearch;
      }),
    [priorityFilter, searchQuery],
  );

  const handleProcessPayment = async (id: string, poNumber: string) => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setData(data.filter((payment) => payment.id !== id));

      toast.success("Payment processed successfully!", {
        description: `${poNumber} has been marked as paid and moved to processed payments.`,
      });
    } catch (error) {
      toast.error("Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = useMemo(() => FinancePendingColumns(router, handleProcessPayment, isProcessing), [router]);

  const table = useDataTableInstance({
    data: filteredData,
    columns,
    getRowId: (row) => row.id,
  });

  const totalPendingAmount = data.reduce((sum, payment) => sum + payment.totalAmount, 0);

  return (
    <div className="@container/main flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pending Payments</h1>
          <p className="text-muted-foreground text-sm">Process payments for procured items</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <Receipt className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <Receipt className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalPendingAmount.toLocaleString()}</div>
            <p className="text-muted-foreground mt-1 text-xs">To be paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((p) => p.priority === "HIGH").length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Urgent payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((p) => p.daysWaiting > 5).length}</div>
            <p className="text-muted-foreground mt-1 text-xs">More than 5 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Payment Requests</CardTitle>
          <CardDescription>Process payments for successfully procured items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search by PO, Request ID, Vendor, or Item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="HIGH">High Priority</SelectItem>
                <SelectItem value="MEDIUM">Medium Priority</SelectItem>
                <SelectItem value="LOW">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <DataTable table={table} columns={columns} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
