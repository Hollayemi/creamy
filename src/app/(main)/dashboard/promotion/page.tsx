"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Download, Calendar, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Mock data for promotions (only one row as requested)
const promotions = [
    {
        id: "1",
        promoName: "Welcome Bonus",
        code: "WELCOME10",
        discountType: "Percentage",
        value: "10%",
        usageLimit: 200,
        used: 154,
        startDate: "01/09/2025",
        endDate: "31/12/2025",
        status: "Running",
        createdBy: "Admin"
    }
];

// Stats data
const stats = [
    {
        label: "Active Promotions",
        value: "12",
        change: "1.7% vs last month",
        changeType: "increase",
        color: "purple",
    },
    {
        label: "Upcoming Promotions",
        value: "2",
        change: "1.2% vs last month",
        changeType: "decrease",
        color: "orange",
    },
    {
        label: "Ended Promotions",
        value: "1,240",
        change: "4.5% vs last month",
        changeType: "increase",
        color: "cyan",
    },
    {
        label: "Most Redeemed Promo",
        value: "WELCOME10",
        change: "24% vs last month",
        changeType: "increase",
        color: "red",
    },
    {
        label: "Total Orders with Discounts",
        value: "4,520",
        change: "- vs last month",
        changeType: "neutral",
        color: "blue",
    },
];

export default function PromotionsListPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { bg: string; text: string; icon: string }> = {
            Running: { bg: "bg-green-100", text: "text-green-700", icon: "🟢" },
            Upcoming: { bg: "bg-orange-100", text: "text-orange-700", icon: "🟠" },
            Draft: { bg: "bg-purple-100", text: "text-purple-700", icon: "🟣" },
            Ended: { bg: "bg-red-100", text: "text-red-700", icon: "🔴" },
        };

        const variant = variants[status] || variants.Running;

        return (
            <span
                className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium",
                    variant.bg,
                    variant.text
                )}
            >
                <span>{variant.icon}</span>
                {status}
            </span>
        );
    };

    const toggleRowSelection = (id: string) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const toggleAllRows = () => {
        if (selectedRows.length === promotions.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(promotions.map((p) => p.id));
        }
    };

    return (
        <div className="flex flex-col gap-6 p-2">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-primary">Promotions</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        See how much your customers are saving, and how much your promos are slaying!
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="h-9 gap-2 bg-muted text-muted-foreground"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="rounded-lg border bg-muted text-muted-foreground p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{stat.label}</p>
                                <div className="pb-2 flex items-baseline gap-2">
                                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                    {stat.color === "purple" && (
                                        <span className="bg-purple-600 w-10 h-2"></span>
                                    )}
                                    {stat.color === "orange" && (
                                        <span className="bg-orange-600 w-10 h-2"></span>
                                    )}
                                    {stat.color === "cyan" && (
                                        <span className="bg-cyan-600 w-10 h-2"></span>
                                    )}
                                    {stat.color === "red" && (
                                        <span className="bg-red-600 w-10 h-2"></span>
                                    )}
                                    {stat.color === "blue" && (
                                        <span className="bg-blue-600 w-10 h-2"></span>
                                    )}
                                </div>
                                <p className="mt-1 text-xs text-gray-500">{stat.change}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search customers"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 pl-10 border-muted bg-muted text-muted-foreground"
                    />
                </div>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="h-10 w-[140px] border-muted bg-muted text-muted-foreground">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="running">Running</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    className="h-10 gap-2 border-muted bg-muted text-muted-foreground"
                >
                    <Calendar className="h-4 w-4" />
                    Date Range
                </Button>

                <Button
                    variant="outline"
                    className="h-10 gap-2 border-muted bg-muted text-muted-foreground"
                >
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>

                <Button
                    variant="outline"
                    className="h-10 gap-2 border-muted bg-muted text-muted-foreground"
                >
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </div>

            {/* Promotions Table */}
            <div className="rounded-lg border border-muted bg-muted text-muted-foreground">
                <Table>
                    <TableHeader>
                        <TableRow className="border-muted bg-muted text-muted-foreground">
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedRows.length === promotions.length}
                                    onCheckedChange={toggleAllRows}
                                />
                            </TableHead>
                            <TableHead className="font-medium">Promo Name</TableHead>
                            <TableHead className="font-medium">Code</TableHead>
                            <TableHead className="font-medium">Discount Type</TableHead>
                            <TableHead className="font-medium">Value</TableHead>
                            <TableHead className="font-medium">Usage Limit</TableHead>
                            <TableHead className="font-medium">Used</TableHead>
                            <TableHead className="font-medium">Start Date</TableHead>
                            <TableHead className="font-medium">End Date</TableHead>
                            <TableHead className="font-medium">Status</TableHead>
                            <TableHead className="font-medium">Created By</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {promotions.map((promo) => (
                            <TableRow key={promo.id} className="hover:bg-gray-50">
                                <TableCell>
                                    <Checkbox
                                        checked={selectedRows.includes(promo.id)}
                                        onCheckedChange={() => toggleRowSelection(promo.id)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{promo.promoName}</TableCell>
                                <TableCell className="font-medium">{promo.code}</TableCell>
                                <TableCell>{promo.discountType}</TableCell>
                                <TableCell className="font-semibold">{promo.value}</TableCell>
                                <TableCell>{promo.usageLimit}</TableCell>
                                <TableCell>{promo.used}</TableCell>
                                <TableCell className="text-sm">{promo.startDate}</TableCell>
                                <TableCell className="text-sm">{promo.endDate}</TableCell>
                                <TableCell>{getStatusBadge(promo.status)}</TableCell>
                                <TableCell>{promo.createdBy}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="rounded-full p-1.5 hover:bg-gray-100">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Select defaultValue="8">
                            <SelectTrigger className="h-9 w-[100px] border-gray-300">
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
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "h-8 w-8 border-gray-300",
                                    currentPage === 1 && "border-purple-600 bg-purple-50 text-purple-600"
                                )}
                                onClick={() => setCurrentPage(1)}
                            >
                                1
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 border-gray-300"
                                onClick={() => setCurrentPage(2)}
                            >
                                2
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 border-gray-300"
                                onClick={() => setCurrentPage(3)}
                            >
                                3
                            </Button>
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
        </div>
    );
}