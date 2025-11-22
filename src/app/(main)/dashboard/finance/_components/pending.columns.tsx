"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, CheckCircle, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { CheckedRequest } from "@/types/tableColumns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  MEDIUM: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  HIGH: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export const FinancePendingColumns = (
  router: any,
  handleProcessPayment: any,
  isProcessing: boolean,
): ColumnDef<PendingPayment>[] => [
  {
    accessorKey: "poNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="PO Number" />,
    cell: ({ row }) => <div className="font-mono font-medium">{row.getValue("poNumber")}</div>,
  },
  {
    accessorKey: "requestNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Request ID" />,
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("requestNumber")}</div>,
  },
  {
    accessorKey: "itemName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Item" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("itemName")}</div>,
  },
  {
    accessorKey: "vendorName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Vendor" />,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => <div className="font-medium">₦{(row.getValue("totalAmount") as number).toLocaleString()}</div>,
  },
  {
    accessorKey: "department",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
    cell: ({ row }) => <Badge variant="outline">{row.getValue("department")}</Badge>,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => {
      const priority = row.getValue("priority") as keyof typeof priorityColors;
      return (
        <Badge variant="outline" className={priorityColors[priority]}>
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "daysWaiting",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Days Waiting" />,
    cell: ({ row }) => {
      const days = row.getValue("daysWaiting") as number;
      return (
        <div className="flex items-center gap-2">
          {days > 5 && <AlertCircle className="size-4 text-red-500" />}
          <span className={days > 5 ? "font-medium text-red-600" : ""}>{days} days</span>
        </div>
      );
    },
  },
  {
    accessorKey: "procuredDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Procured Date" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("procuredDate"));
      return (
        <div className="text-muted-foreground text-sm">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => router.push(`/dashboard/finance/pending/${row.original.id}`)}>
          <Eye className="size-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" disabled={isProcessing}>
              <CheckCircle className="mr-2 size-4" />
              Process Payment
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Process Payment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to process payment for {row.original.poNumber}? This will mark it as paid and move
                it to processed payments.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleProcessPayment(row.original.id, row.original.poNumber)}>
                Process Payment
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
  },
];
