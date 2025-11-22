"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const paymentMethodColors = {
  BANK_TRANSFER: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  CHEQUE: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  CASH: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

export const processedColumns = (router: any): ColumnDef<ProcessedPayment>[] => [
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
    accessorKey: "paymentMethod",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Method" />,
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as keyof typeof paymentMethodColors;
      return (
        <Badge variant="outline" className={paymentMethodColors[method]}>
          {method.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "referenceNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reference" />,
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("referenceNumber")}</div>,
  },
  {
    accessorKey: "paidDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Paid Date" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("paidDate"));
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
    accessorKey: "processedBy",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Processed By" />,
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-green-50 text-green-700">
        {row.getValue("processedBy")}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => router.push(`/dashboard/finance/processed/${row.original.id}`)}
        >
          <Eye className="size-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <Download className="size-4" />
        </Button>
      </div>
    ),
  },
];
