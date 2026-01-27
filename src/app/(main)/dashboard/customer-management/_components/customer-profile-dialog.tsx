"use client";

import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface PurchaseHistoryItem {
    orderId: string;
    date: string;
    items: number;
    amount: number;
    status: string;
}

interface ActivityItem {
    date: string;
    activity: string;
    details: string;
    status: string;
}

interface LoyaltyItem {
    date: string;
    event: string;
    points: string;
}

interface CustomerStats {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate: string;
    cancelledOrders: number;
}

interface Customer {
    customerId: string;
    name: string;
    email: string;
    phone: string;
    region: string;
    address: string;
    totalOrders: number;
    totalSpent: number;
    dateJoined: string;
    lastActivity: string;
    status: string;
    badges: string[];
    avatar: string;
    avatarColor: string;
    purchaseHistory: PurchaseHistoryItem[];
    customerActivity: ActivityItem[];
    loyaltyProgress: LoyaltyItem[];
    stats: CustomerStats;
}

interface CustomerProfileDialogProps {
    customer: Customer | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function CustomerProfileDialog({ customer, isOpen, onClose }: CustomerProfileDialogProps) {
    if (!isOpen || !customer) return null;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-6 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold", customer.avatarColor)}>
                            {customer.avatar}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{customer.name}</h2>
                                <Badge className="bg-green-100 text-green-800">
                                    {customer.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
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
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Content - scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-12 gap-6 p-6">
                        {/* Left Column - Profile Summary & Stats */}
                        <div className="col-span-12 lg:col-span-4 space-y-6">
                            {/* Customer Profile Summary */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                                <h3 className="text-lg font-semibold mb-4">Customer Profile Summary</h3>

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
                            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                                <h3 className="text-lg font-semibold mb-4">Customer Stats Overview</h3>

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
                                <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
                                    <TabsTrigger
                                        value="purchase"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent"
                                    >
                                        Purchase History
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="activity"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent"
                                    >
                                        Customer Activity
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="loyalty"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent"
                                    >
                                        Loyalty Progress
                                    </TabsTrigger>
                                </TabsList>

                                {/* Purchase History Tab */}
                                <TabsContent value="purchase" className="mt-6">
                                    <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-purple-50 dark:bg-purple-900/20">
                                                <TableRow>
                                                    <TableHead className="font-semibold">Order ID</TableHead>
                                                    <TableHead className="font-semibold">Date & Time</TableHead>
                                                    <TableHead className="font-semibold">Items</TableHead>
                                                    <TableHead className="font-semibold">Amount</TableHead>
                                                    <TableHead className="font-semibold">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {customer.purchaseHistory.map((order, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell className="font-medium">{order.orderId}</TableCell>
                                                        <TableCell>{order.date}</TableCell>
                                                        <TableCell>{order.items}</TableCell>
                                                        <TableCell className="font-semibold">₦{order.amount.toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            <Badge className={getStatusBadge(order.status)}>
                                                                {order.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>

                                {/* Customer Activity Tab */}
                                <TabsContent value="activity" className="mt-6">
                                    <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-purple-50 dark:bg-purple-900/20">
                                                <TableRow>
                                                    <TableHead className="font-semibold">Date & Time</TableHead>
                                                    <TableHead className="font-semibold">Activity</TableHead>
                                                    <TableHead className="font-semibold">Details</TableHead>
                                                    <TableHead className="font-semibold">Status / Outcome</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {customer.customerActivity.map((activity, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{activity.date}</TableCell>
                                                        <TableCell className="font-medium">{activity.activity}</TableCell>
                                                        <TableCell className="max-w-xs">{activity.details}</TableCell>
                                                        <TableCell>
                                                            <Badge className={getActivityStatusBadge(activity.status)}>
                                                                {activity.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>

                                {/* Loyalty Progress Tab */}
                                <TabsContent value="loyalty" className="mt-6">
                                    <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-purple-50 dark:bg-purple-900/20">
                                                <TableRow>
                                                    <TableHead className="font-semibold">Date & Time</TableHead>
                                                    <TableHead className="font-semibold">Event</TableHead>
                                                    <TableHead className="font-semibold">Points Earned</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {customer.loyaltyProgress.map((loyalty, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{loyalty.date}</TableCell>
                                                        <TableCell className="font-medium">{loyalty.event}</TableCell>
                                                        <TableCell>
                                                            <span className="text-green-600 font-semibold">{loyalty.points}</span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}