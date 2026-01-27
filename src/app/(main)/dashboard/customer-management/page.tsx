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
import CustomerProfileDialog from "./_components/customer-profile-dialog";

// Mock data for customers
const customers = [
    {
        customerId: "CST-105272",
        name: "Tunde Adebayo",
        email: "tundeadebayo@gmail.com",
        phone: "+234 (801) 234 5678",
        region: "Ikeja",
        address: "14, Adeniji Jones Ave, Ikeja",
        totalOrders: 14,
        totalSpent: 182400,
        dateJoined: "4 Dec 2025",
        lastActivity: "28 Oct 2025",
        status: "Active",
        badges: [],
        avatar: "TA",
        avatarColor: "bg-pink-200",
        purchaseHistory: [
            { orderId: "#GK-3127", date: "2 Oct 2025 - 10:32AM", items: 2, amount: 14500, status: "Delivered" },
            { orderId: "#GK-3131", date: "4 Oct 2025 - 1:45PM", items: 1, amount: 8200, status: "Delivered" },
            { orderId: "#GK-3139", date: "7 Oct 2025 - 4:10PM", items: 3, amount: 15600, status: "Delivered" },
            { orderId: "#GK-3144", date: "9 Oct 2025 - 9:25AM", items: 2, amount: 11800, status: "Delivered" },
            { orderId: "#GK-3150", date: "12 Oct 2025 - 3:40PM", items: 1, amount: 6000, status: "Cancelled" }
        ],
        customerActivity: [
            { date: "1 Oct 2025 - 9:20AM", activity: "Account Created", details: "Signed up via referral link from", status: "Successful" },
            { date: "1 Oct 2025 - 9:25AM", activity: "Profile Updated", details: "Added delivery address: No 12, Allen Avenue, Ikeja", status: "Successful" },
            { date: "2 Oct 2025 - 10:15AM", activity: "Placed Order", details: "Order #GK-3127, 2 items (₦14,500)", status: "Successful" },
            { date: "2 Oct 2025 - 10:32AM", activity: "Payment Attempt", details: "Paid via card (Paystack)", status: "Successful" },
            { date: "7 Oct 2025 - 4:10PM", activity: "Left Review", details: "Rated driver 4.5 stars, comment: 'Fast delivery, but driver missed my call once.'", status: "Successful" },
            { date: "9 Oct 2025 - 9:25AM", activity: "Reordered", details: "Repeated previous order (#GK-3139)", status: "Failed" },
            { date: "25 Oct 2025 - 8:47PM", activity: "Promo Code Used", details: "Code: NEW50FF", status: "Successful" }
        ],
        loyaltyProgress: [
            { date: "1 Oct 2025", event: "Joined Loyalty Program", points: "+50 pts" },
            { date: "2 Oct 2025", event: "First Order Completed", points: "+100 pts" },
            { date: "7 Oct 2025", event: "Left a Driver Review", points: "+20 pts" },
            { date: "12 Oct 2025", event: "5th Order Milestone", points: "+150 pts" },
            { date: "18 Oct 2025", event: "Referred New User", points: "+200 pts" },
            { date: "23 Oct 2025", event: "Used Promo Code (NEW50FF)", points: "+50 pts" },
            { date: "25 Oct 2025", event: "Spent ₦25,000+ in one month", points: "+100 pts" }
        ],
        stats: {
            totalOrders: 14,
            totalSpent: 245000,
            averageOrderValue: 20400,
            lastOrderDate: "22 Oct 2025",
            cancelledOrders: 2
        }
    },
    {
        customerId: "CST-108456",
        name: "Kemi Balogun",
        email: "kemmitty@gmail.com",
        phone: "+234 (803) 241 9082",
        region: "Surulere",
        address: "22, Adeniji Jones, Ikeja",
        totalOrders: 18,
        totalSpent: 245000,
        dateJoined: "27 Nov 2025",
        lastActivity: "30 Nov 2025",
        status: "Active",
        badges: ["Frequent Buyer"],
        avatar: "KB",
        avatarColor: "bg-orange-200",
        purchaseHistory: [],
        customerActivity: [],
        loyaltyProgress: [],
        stats: {
            totalOrders: 18,
            totalSpent: 245000,
            averageOrderValue: 20400,
            lastOrderDate: "30 Nov 2025",
            cancelledOrders: 1
        }
    },
    {
        customerId: "CST-109823",
        name: "Samuel Ojo",
        email: "sammyojo@gmail.com",
        phone: "+234 (901) 665 7832",
        region: "Lekki-Ajah",
        address: "14 Orchid Rd, Lekki",
        totalOrders: 4,
        totalSpent: 78000,
        dateJoined: "25 Nov 2025",
        lastActivity: "26 Nov 2025",
        status: "Active",
        badges: ["New User"],
        avatar: "SO",
        avatarColor: "bg-blue-200",
        purchaseHistory: [],
        customerActivity: [],
        loyaltyProgress: [],
        stats: {
            totalOrders: 4,
            totalSpent: 78000,
            averageOrderValue: 19500,
            lastOrderDate: "26 Nov 2025",
            cancelledOrders: 0
        }
    },
    {
        customerId: "CST-107234",
        name: "Funmi Adeoye",
        email: "funmiadeoye@gmail.com",
        phone: "+234 (708) 345 1228",
        region: "Yaba",
        address: "8 Commercial Ave, Yaba",
        totalOrders: 16,
        totalSpent: 310000,
        dateJoined: "19 Nov 2025",
        lastActivity: "28 Nov 2025",
        status: "Active",
        badges: ["Frequent Buyer"],
        avatar: "FA",
        avatarColor: "bg-yellow-200",
        purchaseHistory: [],
        customerActivity: [],
        loyaltyProgress: [],
        stats: {
            totalOrders: 16,
            totalSpent: 310000,
            averageOrderValue: 19375,
            lastOrderDate: "28 Nov 2025",
            cancelledOrders: 0
        }
    },
    {
        customerId: "CST-106789",
        name: "Michael Oseni",
        email: "osenimich@gmail.com",
        phone: "+234 (805) 940 2213",
        region: "Agege",
        address: "20 Olaniyi St, Agege",
        totalOrders: 6,
        totalSpent: 94500,
        dateJoined: "16 Nov 2025",
        lastActivity: "20 Nov 2025",
        status: "In-active",
        badges: [],
        avatar: "MO",
        avatarColor: "bg-purple-200",
        purchaseHistory: [],
        customerActivity: [],
        loyaltyProgress: [],
        stats: {
            totalOrders: 6,
            totalSpent: 94500,
            averageOrderValue: 15750,
            lastOrderDate: "20 Nov 2025",
            cancelledOrders: 1
        }
    },
    {
        customerId: "CST-105634",
        name: "Grace Okafor",
        email: "okaffgrace@gmail.com",
        phone: "+234 (906) 332 7781",
        region: "Surulere",
        address: "14, Adeniji Jones Ave, Ikeja",
        totalOrders: 3,
        totalSpent: 49000,
        dateJoined: "14 Nov 2025",
        lastActivity: "15 Nov 2025",
        status: "In-active",
        badges: [],
        avatar: "GO",
        avatarColor: "bg-gray-200",
        purchaseHistory: [],
        customerActivity: [],
        loyaltyProgress: [],
        stats: {
            totalOrders: 3,
            totalSpent: 49000,
            averageOrderValue: 16333,
            lastOrderDate: "15 Nov 2025",
            cancelledOrders: 0
        }
    },
    {
        customerId: "CST-108901",
        name: "David Akintunde",
        email: "davidakintunde@gmail.com",
        phone: "+234 (816) 478 9056",
        region: "Ikeja",
        address: "5 Allen Ave, Ikeja",
        totalOrders: 11,
        totalSpent: 175000,
        dateJoined: "10 Nov 2025",
        lastActivity: "29 Nov 2025",
        status: "Active",
        badges: [],
        avatar: "DA",
        avatarColor: "bg-cyan-200",
        purchaseHistory: [],
        customerActivity: [],
        loyaltyProgress: [],
        stats: {
            totalOrders: 11,
            totalSpent: 175000,
            averageOrderValue: 15909,
            lastOrderDate: "29 Nov 2025",
            cancelledOrders: 0
        }
    },
    {
        customerId: "CST-109456",
        name: "Rukayat Lawal",
        email: "rukkyylawal@gmail.com",
        phone: "+234 (701) 588 4012",
        region: "Yaba",
        address: "34 Herbert Macaulay Way, Yaba",
        totalOrders: 2,
        totalSpent: 33000,
        dateJoined: "8 Nov 2025",
        lastActivity: "9 Nov 2025",
        status: "Active",
        badges: ["New User"],
        avatar: "RL",
        avatarColor: "bg-green-200",
        purchaseHistory: [],
        customerActivity: [],
        loyaltyProgress: [],
        stats: {
            totalOrders: 2,
            totalSpent: 33000,
            averageOrderValue: 16500,
            lastOrderDate: "9 Nov 2025",
            cancelledOrders: 0
        }
    }
];

// Stats data
const stats = [
    {
        label: "Total Customers",
        value: "1,528",
        change: "1.7% vs last month",
        changeType: "increase",
        color: "purple",
    },
    {
        label: "Active Customers",
        value: "1,230",
        change: "1.2% vs last month",
        changeType: "increase",
        color: "orange",
    },
    {
        label: "Inactive Customers",
        value: "220",
        change: "4.5% vs last month",
        changeType: "increase",
        color: "cyan",
    },
    {
        label: "Avg. Order Value",
        value: "₦8,750",
        change: "24% vs last month",
        changeType: "increase",
        color: "red",
    },
    {
        label: "Refunds",
        value: "32",
        change: "- vs last month",
        changeType: "neutral",
        color: "blue",
    },
];

export default function CustomersListPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { bg: string; text: string }> = {
            Active: { bg: "bg-green-100", text: "text-green-700" },
            "In-active": { bg: "bg-gray-100", text: "text-gray-700" },
        };

        const variant = variants[status] || variants.Active;

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

    const getBadgeColor = (badge: string) => {
        const colors: Record<string, string> = {
            "Frequent Buyer": "bg-orange-100 text-orange-700",
            "New User": "bg-green-100 text-green-700",
        };
        return colors[badge] || "bg-blue-100 text-blue-700";
    };

    const toggleRowSelection = (id: string) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const toggleAllRows = () => {
        if (selectedRows.length === customers.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(customers.map((c) => c.customerId));
        }
    };

    const handleViewCustomer = (customer: typeof customers[0]) => {
        setSelectedCustomer(customer);
        setIsDialogOpen(true);
    };

    return (
        <div className="flex flex-col gap-6 p-2">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-primary">Customer's List</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage all customers across dark stores and regions
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
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">In-active</SelectItem>
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

            {/* Customers Table */}
            <div className="rounded-lg border border-muted bg-muted text-muted-foreground">
                <Table>
                    <TableHeader>
                        <TableRow className="border-muted bg-muted text-muted-foreground">
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedRows.length === customers.length}
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
                            <TableHead className="font-medium">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer.customerId} className="hover:bg-gray-50">
                                <TableCell>
                                    <Checkbox
                                        checked={selectedRows.includes(customer.customerId)}
                                        onCheckedChange={() => toggleRowSelection(customer.customerId)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold", customer.avatarColor)}>
                                            {customer.avatar}
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
                                        {customer.badges.map((badge, idx) => (
                                            <Badge key={idx} className={getBadgeColor(badge)}>
                                                {badge}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <button
                                        onClick={() => handleViewCustomer(customer)}
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

            {/* Customer Profile Dialog */}
            <CustomerProfileDialog
                customer={selectedCustomer}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </div>
    );
}