"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Search, Filter, Download, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
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
import { cn } from "@/lib/utils";
import OrderDetailsDialog from "./_components/order-details-dialog";

// Mock data for orders
const orders = [
    {
        orderId: "ORD-2456",
        customerName: "Michael Adeyemi",
        customerEmail: "michealadeyemi@yahoo.com",
        customerPhone: "+234 (801) 234 5678",
        deliveryAddress: "22, Olufemi Street, Surulere, Lagos",
        region: "Surulere",
        totalAmount: 12000,
        items: 3,
        status: "Pending",
        dateOrdered: "2 Dec 2025 - 10:45 AM",
        deliveryDate: "-",
        courierName: "John Okoro",
        courierPhone: "0802 555 0021",
        vehicleType: "Bike",
        plateNumber: "KJA-203BY",
        pickupLocation: "Ikeja Regional Store",
        trackingStatus: "En Route (Updated 4 Dec 2025 - 12:15 PM)",
        orderedItems: [
            { name: "Dettol Antibacterial Liquid Hand Wash (200ml)", quantity: 1, price: 7200 },
            { name: "Chivita Active Fruit Juice (1L)", quantity: 2, price: 2200 }
        ],
        activityTimeline: [
            { time: "10:45 AM", event: "Order placed" },
            { time: "10:52 AM", event: "Order accepted" },
            { time: "11:15 AM", event: "Delivery request sent" },
            { time: "11:20 AM", event: "Courier accepted request" },
            { time: "11:20 AM", event: "Courier en route" }
        ]
    },
    {
        orderId: "ORD-2482",
        customerName: "Sarah Johnson",
        customerEmail: "sarah.j@email.com",
        customerPhone: "+234 (802) 345 6789",
        deliveryAddress: "15, Allen Avenue, Ikeja, Lagos",
        region: "Lekki-Ajah",
        totalAmount: 9500,
        items: 2,
        status: "Delivered",
        dateOrdered: "4 Dec 2025 - 1:20 PM",
        deliveryDate: "4 Dec 2025 - 1:57 PM",
        courierName: "John Okoro",
        courierPhone: "0802 555 0021",
        vehicleType: "Bike",
        plateNumber: "KJA-203BY",
        pickupLocation: "Ikeja Regional Store",
        trackingStatus: "Delivered",
        orderedItems: [
            { name: "Golden Penny Spaghetti (500g)", quantity: 2, price: 5200 }
        ],
        activityTimeline: [
            { time: "1:20 PM", event: "Order placed" },
            { time: "1:25 PM", event: "Order accepted" },
            { time: "1:30 PM", event: "Courier en route" },
            { time: "1:57 PM", event: "Delivered" }
        ]
    },
    {
        orderId: "ORD-2510",
        customerName: "Emeka Obi",
        customerEmail: "emeka.obi@email.com",
        customerPhone: "+234 (803) 456 7890",
        deliveryAddress: "8, Victoria Island, Lagos",
        region: "Ikeja",
        totalAmount: 15200,
        items: 4,
        status: "En-Route",
        dateOrdered: "3 Dec 2025 - 9:10 AM",
        deliveryDate: "-",
        courierName: "John Okoro",
        courierPhone: "0802 555 0021",
        vehicleType: "Bike",
        plateNumber: "KJA-203BY",
        pickupLocation: "Ikeja Regional Store",
        trackingStatus: "En Route",
        orderedItems: [
            { name: "Peak Milk (400g)", quantity: 3, price: 4500 },
            { name: "Indomie Noodles (70g)", quantity: 1, price: 150 }
        ],
        activityTimeline: [
            { time: "9:10 AM", event: "Order placed" },
            { time: "9:15 AM", event: "Order accepted" },
            { time: "9:30 AM", event: "Courier en route" }
        ]
    },
    {
        orderId: "ORD-2568",
        customerName: "Ifeoluwa Daniels",
        customerEmail: "ifedaniels@email.com",
        customerPhone: "+234 (804) 567 8901",
        deliveryAddress: "32, Herbert Macaulay, Yaba, Lagos",
        region: "Yaba",
        totalAmount: 7000,
        items: 1,
        status: "Processing",
        dateOrdered: "2 Dec 2025 - 5:50 PM",
        deliveryDate: "-",
        courierName: "-",
        courierPhone: "-",
        vehicleType: "-",
        plateNumber: "-",
        pickupLocation: "-",
        trackingStatus: "Processing",
        orderedItems: [
            { name: "Honey Well Wheat Flour (2kg)", quantity: 1, price: 7000 }
        ],
        activityTimeline: [
            { time: "5:50 PM", event: "Order placed" },
            { time: "5:55 PM", event: "Order accepted" }
        ]
    }
];

// Stats data
const stats = [
    {
        label: "Total Orders",
        value: "167",
        change: "1.7% vs last month",
        changeType: "increase",
        color: "purple",
    },
    {
        label: "Processing",
        value: "3",
        change: "1.2% vs last month",
        changeType: "increase",
        color: "orange",
    },
    {
        label: "Delivered",
        value: "160",
        change: "4.5% vs last month",
        changeType: "increase",
        color: "green",
    },
    {
        label: "Cancelled",
        value: "4",
        change: "24% vs last month",
        changeType: "increase",
        color: "red",
    },
    {
        label: "Revenue",
        value: "₦752,400",
        change: "- vs last month",
        changeType: "neutral",
        color: "blue",
    },
];

export default function OrdersListPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { bg: string; text: string }> = {
            Pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
            Processing: { bg: "bg-blue-100", text: "text-blue-700" },
            "En-Route": { bg: "bg-purple-100", text: "text-purple-700" },
            Delivered: { bg: "bg-green-100", text: "text-green-700" },
            Cancelled: { bg: "bg-red-100", text: "text-red-700" },
        };

        const variant = variants[status] || variants.Pending;

        return (
            <span
                className={cn(
                    "inline-flex rounded-md px-2.5 py-1 text-xs font-medium",
                    variant.bg,
                    variant.text
                )}
            >
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
        if (selectedRows.length === orders.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(orders.map((o) => o.orderId));
        }
    };

    const handleViewOrder = (order: typeof orders[0]) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    return (
        <div className="flex flex-col gap-6 p-2">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-primary">Order's List</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage all orders available across dark stores and regions
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
                                    <h3 className="text-2xl font-bold text-muted-foreground">{stat.value}</h3>
                                    {stat.color === "purple" && (
                                        <span className="bg-purple-600 w-10 h-2"></span>
                                        
                                    )}
                                    {stat.color === "orange" && (
                                        <span className="bg-orange-600 w-10 h-2"></span>
                                        
                                    )}
                                    {stat.color === "green" && (
                                        <span className="bg-green-600 w-10 h-2"></span>
                                        
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
                        placeholder="Search orders"
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="en-route">En-Route</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    className="h-10 gap-2 border-muted bg-muted text-muted-foreground"
                >
                    <Calendar className="h-4 w-4" />
                    Time Frame
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

            {/* Orders Table */}
            <div className="rounded-lg border border-muted bg-muted text-muted-foreground">
                <Table>
                    <TableHeader className="">
                        <TableRow className="border-muted bg-primary/10 text-muted-foreground">
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedRows.length === orders.length}
                                    onCheckedChange={toggleAllRows}
                                />
                            </TableHead>
                            <TableHead className="font-medium">Order ID</TableHead>
                            <TableHead className="font-medium">Customer Name</TableHead>
                            <TableHead className="font-medium">Region</TableHead>
                            <TableHead className="font-medium">Total Amount (₦)</TableHead>
                            <TableHead className="font-medium">Items</TableHead>
                            <TableHead className="font-medium">Status</TableHead>
                            <TableHead className="font-medium">Date Ordered</TableHead>
                            <TableHead className="font-medium">Delivery Date</TableHead>
                            <TableHead className="font-medium">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.orderId} className="hover:bg-gray-50 dark:hover:bg-red-300!">
                                <TableCell>
                                    <Checkbox
                                        checked={selectedRows.includes(order.orderId)}
                                        onCheckedChange={() => toggleRowSelection(order.orderId)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{order.orderId}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>{order.region}</TableCell>
                                <TableCell className="font-medium">
                                    {order.totalAmount.toLocaleString()}
                                </TableCell>
                                <TableCell>{order.items}</TableCell>
                                <TableCell>{getStatusBadge(order.status)}</TableCell>
                                <TableCell className="text-sm">{order.dateOrdered}</TableCell>
                                <TableCell className="text-sm">{order.deliveryDate}</TableCell>
                                <TableCell>
                                    <button
                                        onClick={() => handleViewOrder(order)}
                                        className="rounded-full p-1.5 text-purple-600 hover:bg-purple-50"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Select defaultValue="9">
                            <SelectTrigger className="h-9 w-[100px] border-gray-300">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="9">9 Entries</SelectItem>
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

            {/* Order Details Dialog */}
            <OrderDetailsDialog
                order={selectedOrder}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </div>
    );
}