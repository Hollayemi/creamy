"use client";

import {
  X,
  Package,
  MapPin,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetDriverPickupHistoryQuery, useGetDriverPickupStatsQuery, type Driver } from "@/stores/services/driverApi";

interface DriverPickupHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Driver;
}

export default function DriverPickupHistory({ open, onOpenChange, driver }: DriverPickupHistoryProps) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const limit = 10;

  // const { data: historyResponse, isLoading } = useGetDriverPickupHistoryQuery(
  //   { driverId: driver._id, page, limit },
  //   { skip: !open }
  // );
  //
  // const { data: statsResponse } = useGetDriverPickupStatsQuery(driver._id, {
  //   skip: !open,
  // });

  const isLoading = false;

  const getRandomDate = (daysBack: number = 30) => {
    const now = new Date();
    const past = new Date();
    past.setDate(now.getDate() - daysBack);

    return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
  };

  const createdAt = getRandomDate();

  const addMinutes = (date: Date, minutes: number) => new Date(date.getTime() + minutes * 60000);

  const mockPickups = [
    {
      _id: "1",
      orderNumber: "ORD-1001",
      status: "delivered",
      createdAt,
      totalAmount: 8500,
      customerName: "John Doe",
      customerPhone: "08012345678",
      pickupLocation: { address: "Ikeja, Lagos" },
      deliveryLocation: { address: "Lekki, Lagos" },
      actualPickupTime: addMinutes(createdAt, 10),
      actualDeliveryTime: addMinutes(createdAt, 45),
      duration: 45,
      distance: 18,
      items: [
        { name: "Rice (5kg)", quantity: 1, price: 4500 },
        { name: "Golden Penny Spaghetti", quantity: 2, price: 500 },
        { name: "Indomie Noodles (Pack)", quantity: 1, price: 1500 },
      ],
      paymentStatus: "paid",
      rating: 5,
      feedback: "Fast and professional service",
    },
    {
      _id: "2",
      orderNumber: "ORD-1002",
      status: "cancelled",
      createdAt,
      totalAmount: 5200,
      customerName: "Jane Smith",
      customerPhone: "08098765432",
      pickupLocation: { address: "Yaba, Lagos" },
      deliveryLocation: { address: "Surulere, Lagos" },
      duration: 10,
      distance: 3,
      items: [
        { name: "Milk (Peak)", quantity: 2, price: 800 },
        { name: "Cornflakes", quantity: 1, price: 1200 },
      ],
      paymentStatus: "refunded",
      feedback: "Customer cancelled before pickup",
    },
    {
      _id: "3",
      orderNumber: "ORD-1003",
      status: "failed",
      createdAt,
      totalAmount: 10000,
      customerName: "Michael Johnson",
      customerPhone: "08122223333",
      pickupLocation: { address: "Victoria Island, Lagos" },
      deliveryLocation: { address: "Ajah, Lagos" },
      duration: 30,
      distance: 12,
      items: [
        { name: "Yam (Tubers)", quantity: 4, price: 500 },
        { name: "Eggs (Crate)", quantity: 1, price: 3500 },
        { name: "Vegetable Oil (5L)", quantity: 1, price: 4000 },
      ],
      paymentStatus: "pending",
      feedback: "Driver couldn’t reach the location",
    },
    {
      _id: "4",
      orderNumber: "ORD-1004",
      status: "delivered",
      createdAt,
      totalAmount: 7200,
      customerName: "Blessing Ade",
      customerPhone: "08033334444",
      pickupLocation: { address: "Maryland, Lagos" },
      deliveryLocation: { address: "Magodo, Lagos" },
      actualPickupTime: addMinutes(createdAt, 10),
      actualDeliveryTime: addMinutes(createdAt, 25),
      duration: 25,
      distance: 9,
      items: [
        { name: "Bread", quantity: 2, price: 700 },
        { name: "Butter", quantity: 1, price: 1500 },
        { name: "Sugar (1kg)", quantity: 2, price: 900 },
      ],
      paymentStatus: "paid",
      rating: 4,
      feedback: "Very smooth delivery experience",
    },
    {
      _id: "5",
      orderNumber: "ORD-1005",
      status: "delivered",
      createdAt,
      totalAmount: 15000,
      customerName: "David Okafor",
      customerPhone: "08155556666",
      pickupLocation: { address: "Ojodu, Lagos" },
      deliveryLocation: { address: "Ikorodu, Lagos" },
      actualPickupTime: addMinutes(createdAt, 10),
      actualDeliveryTime: addMinutes(createdAt, 60),
      duration: 60,
      distance: 25,
      items: [
        { name: "Frozen Chicken", quantity: 2, price: 4500 },
        { name: "Plantain (Bunch)", quantity: 1, price: 2500 },
        { name: "Tomatoes Basket", quantity: 1, price: 3000 },
      ],
      paymentStatus: "paid",
      feedback: "Driver was polite and punctual",
    },
    {
      _id: "6",
      orderNumber: "ORD-1006",
      status: "delivered",
      createdAt,
      totalAmount: 6300,
      customerName: "Chioma Nwosu",
      customerPhone: "08077778888",
      pickupLocation: { address: "Gbagada, Lagos" },
      deliveryLocation: { address: "Ketu, Lagos" },
      actualPickupTime: addMinutes(createdAt, 10),
      actualDeliveryTime: addMinutes(createdAt, 20),
      duration: 20,
      distance: 7,
      items: [
        { name: "Beans (3kg)", quantity: 1, price: 3000 },
        { name: "Palm Oil (2L)", quantity: 1, price: 1800 },
        { name: "Onions (Bag)", quantity: 1, price: 1500 },
      ],
      paymentStatus: "paid",
      rating: 5,
      feedback: "Package arrived in perfect condition",
    },
    {
      _id: "7",
      orderNumber: "ORD-1007",
      status: "cancelled",
      createdAt,
      totalAmount: 4100,
      customerName: "Samuel Bello",
      customerPhone: "08099990000",
      pickupLocation: { address: "Festac, Lagos" },
      deliveryLocation: { address: "Amuwo Odofin, Lagos" },
      duration: 15,
      distance: 5,
      items: [
        { name: "Sardines", quantity: 4, price: 500 },
        { name: "Tea Bags", quantity: 1, price: 900 },
      ],
      paymentStatus: "refunded",
      feedback: "Order cancelled due to payment issue",
    },
    {
      _id: "8",
      orderNumber: "ORD-1008",
      status: "delivered",
      createdAt,
      totalAmount: 9800,
      customerName: "Fatima Musa",
      customerPhone: "08144445555",
      pickupLocation: { address: "Ogba, Lagos" },
      deliveryLocation: { address: "Agege, Lagos" },
      actualPickupTime: addMinutes(createdAt, 10),
      actualDeliveryTime: addMinutes(createdAt, 35),
      duration: 35,
      distance: 14,
      items: [
        { name: "Semovita (5kg)", quantity: 1, price: 5200 },
        { name: "Groundnut Oil (3L)", quantity: 1, price: 4600 },
      ],
      paymentStatus: "paid",
      rating: 4,
      feedback: "Excellent communication throughout",
    },
    {
      _id: "9",
      orderNumber: "ORD-1009",
      status: "delivered",
      createdAt,
      totalAmount: 5400,
      customerName: "Emeka Obi",
      customerPhone: "08066667777",
      pickupLocation: { address: "Ikoyi, Lagos" },
      deliveryLocation: { address: "Lekki Phase 1, Lagos" },
      actualPickupTime: addMinutes(createdAt, 10),
      actualDeliveryTime: addMinutes(createdAt, 28),
      duration: 28,
      distance: 11,
      items: [
        { name: "Soft Drinks (Pack)", quantity: 1, price: 3200 },
        { name: "Biscuits", quantity: 3, price: 700 },
      ],
      paymentStatus: "paid",
      feedback: "Super quick delivery!",
    },
    {
      _id: "10",
      orderNumber: "ORD-1010",
      status: "delivered",
      createdAt,
      totalAmount: 11200,
      customerName: "Aisha Lawal",
      customerPhone: "08188889999",
      pickupLocation: { address: "Badagry, Lagos" },
      deliveryLocation: { address: "Ijanikin, Lagos" },
      actualPickupTime: addMinutes(createdAt, 10),
      actualDeliveryTime: addMinutes(createdAt, 50),
      duration: 50,
      distance: 22,
      items: [
        { name: "Garri (10kg)", quantity: 1, price: 6000 },
        { name: "Stockfish", quantity: 1, price: 3500 },
        { name: "Pepper (Basket)", quantity: 1, price: 1700 },
      ],
      paymentStatus: "paid",
      rating: 5,
      feedback: "Excellent delivery timing",
    },
    {
      _id: "11",
      orderNumber: "ORD-1011",
      status: "delivered",
      createdAt,
      totalAmount: 7800,
      customerName: "Kelvin Adeyemi",
      customerPhone: "08011112222",
      pickupLocation: { address: "Alimosho, Lagos" },
      deliveryLocation: { address: "Egbeda, Lagos" },
      actualPickupTime: addMinutes(createdAt, 10),
      actualDeliveryTime: addMinutes(createdAt, 40),
      duration: 40,
      distance: 16,
      items: [
        { name: "Rice (3kg)", quantity: 1, price: 3200 },
        { name: "Chicken Wings", quantity: 2, price: 2300 },
      ],
      paymentStatus: "paid",
      rating: 4,
      feedback: "Timely delivery and good service",
    },
    {
      _id: "12",
      orderNumber: "ORD-1012",
      status: "cancelled",
      createdAt,
      totalAmount: 3000,
      customerName: "Grace Williams",
      customerPhone: "08022223333",
      pickupLocation: { address: "Berger, Lagos" },
      deliveryLocation: { address: "Ojota, Lagos" },
      duration: 12,
      distance: 4,
      items: [{ name: "Bread", quantity: 2, price: 700 }],
      paymentStatus: "refunded",
      feedback: "Order cancelled due to customer request",
    },
    {
      _id: "13",
      orderNumber: "ORD-1013",
      status: "delivered",
      createdAt,
      totalAmount: 6400,
      customerName: "Tunde Bakare",
      customerPhone: "08033335555",
      pickupLocation: { address: "Anthony, Lagos" },
      deliveryLocation: { address: "Ilupeju, Lagos" },
      actualPickupTime: addMinutes(createdAt, 10),
      actualDeliveryTime: addMinutes(createdAt, 22),
      duration: 22,
      distance: 8,
      items: [
        { name: "Palm Oil (5L)", quantity: 1, price: 5000 },
        { name: "Onions", quantity: 1, price: 1400 },
      ],
      paymentStatus: "paid",
      rating: 5,
      feedback: "Quick and efficient delivery",
    },
    {
      _id: "14",
      orderNumber: "ORD-1014",
      status: "failed",
      createdAt,
      totalAmount: 9000,
      customerName: "Rita Okoro",
      customerPhone: "08044446666",
      pickupLocation: { address: "Chevron, Lagos" },
      deliveryLocation: { address: "Sangotedo, Lagos" },
      duration: 33,
      distance: 13,
      items: [{ name: "Turkey", quantity: 1, price: 9000 }],
      paymentStatus: "pending",
      feedback: "Delivery failed due to unreachable address",
    },
    {
      _id: "15",
      orderNumber: "ORD-1015",
      status: "delivered",
      createdAt,
      totalAmount: 5200,
      customerName: "Ibrahim Musa",
      customerPhone: "08055557777",
      pickupLocation: { address: "Apapa, Lagos" },
      deliveryLocation: { address: "Tincan, Lagos" },
      actualPickupTime: addMinutes(createdAt, 10),
      actualDeliveryTime: addMinutes(createdAt, 26),
      duration: 26,
      distance: 10,
      items: [
        { name: "Coca Cola Pack", quantity: 1, price: 3800 },
        { name: "Biscuits", quantity: 2, price: 700 },
      ],
      paymentStatus: "paid",
      feedback: "Smooth delivery, very satisfied",
    },
    {
      _id: "16",
      orderNumber: "ORD-1016",
      status: "delivered",
      createdAt,
      totalAmount: 8800,
      customerName: "Adaobi Nnamdi",
      customerPhone: "08066668888",
      pickupLocation: { address: "Ikotun, Lagos" },
      deliveryLocation: { address: "Isolo, Lagos" },
      actualPickupTime: addMinutes(createdAt, 10),
      actualDeliveryTime: addMinutes(createdAt, 29),
      duration: 29,
      distance: 12,
      items: [
        { name: "Garri (5kg)", quantity: 1, price: 4000 },
        { name: "Eggs (Crate)", quantity: 1, price: 4800 },
      ],
      paymentStatus: "paid",
      rating: 4,
      feedback: "Delivery was on time and items intact",
    },
    {
      _id: "17",
      orderNumber: "ORD-1017",
      status: "failed",
      createdAt,
      totalAmount: 4600,
      customerName: "Henry Cole",
      customerPhone: "08077779999",
      pickupLocation: { address: "Lekki Phase 2, Lagos" },
      deliveryLocation: { address: "Jakande, Lagos" },
      duration: 18,
      distance: 6,
      items: [
        { name: "Milk", quantity: 2, price: 1200 },
        { name: "Cornflakes", quantity: 1, price: 2200 },
      ],
      paymentStatus: "pending",
      feedback: "Failed delivery due to traffic delay",
    },
    {
      _id: "18",
      orderNumber: "ORD-1018",
      status: "delivered",
      createdAt,
      totalAmount: 10500,
      customerName: "Mary Akin",
      customerPhone: "08088881111",
      pickupLocation: { address: "Oshodi, Lagos" },
      deliveryLocation: { address: "Mushin, Lagos" },
      actualPickupTime: addMinutes(createdAt, 10),
      actualDeliveryTime: addMinutes(createdAt, 31),
      duration: 31,
      distance: 14,
      items: [
        { name: "Semovita (10kg)", quantity: 1, price: 7500 },
        { name: "Vegetable Oil", quantity: 1, price: 3000 },
      ],
      paymentStatus: "paid",
      rating: 5,
      feedback: "Excellent service, very reliable",
    },
    {
      _id: "19",
      orderNumber: "ORD-1019",
      status: "cancelled",
      createdAt,
      totalAmount: 2100,
      customerName: "Paul John",
      customerPhone: "08099992222",
      pickupLocation: { address: "Ajah, Lagos" },
      deliveryLocation: { address: "Badore, Lagos" },
      duration: 9,
      distance: 3,
      items: [
        { name: "Bread", quantity: 1, price: 700 },
        { name: "Butter", quantity: 1, price: 1400 },
      ],
      paymentStatus: "refunded",
      feedback: "Order cancelled due to payment issues",
    },
    {
      _id: "20",
      orderNumber: "ORD-1020",
      status: "delivered",
      createdAt,
      totalAmount: 6900,
      customerName: "Esther Dan",
      customerPhone: "08100001111",
      pickupLocation: { address: "Ketu, Lagos" },
      deliveryLocation: { address: "Ojodu, Lagos" },
      actualPickupTime: addMinutes(createdAt, 10),
      actualDeliveryTime: addMinutes(createdAt, 24),
      duration: 24,
      distance: 9,
      items: [
        { name: "Beans (5kg)", quantity: 1, price: 5200 },
        { name: "Pepper", quantity: 1, price: 1700 },
      ],
      paymentStatus: "paid",
      rating: 4,
      feedback: "Delivered on time with care",
    },
  ];

  const [expandedItemsId, setExpandedItemsId] = useState<string | null>(null);

  const completed = mockPickups.filter((p) => p.status === "delivered").length;
  const cancelled = mockPickups.filter((p) => p.status === "cancelled").length;
  const failed = mockPickups.filter((p) => p.status === "failed").length;

  const totalDistance = mockPickups.reduce((sum, p) => sum + (p.distance || 0), 0);
  const ratedOrders = mockPickups.filter((p): p is typeof p & { rating: number } => typeof p.rating === "number");

  const averageRating = ratedOrders.reduce((sum, p) => sum + (p.rating ?? 0), 0) / (ratedOrders.length || 1);

  const mockStats = {
    completed,
    cancelled,
    failed,
    totalDistance: Number(totalDistance.toFixed(1)),
    averageRating: Number(averageRating.toFixed(1)),
  };

  // const pickups = historyResponse?.data?.pickups || [];
  // const stats = statsResponse?.data;
  // const totalPages = historyResponse?.data?.pagination?.totalPages || 1;

  const pickups = mockPickups;
  const stats = mockStats;
  const totalPages = 1;

  const generateTimeline = (pickup: any) => {
    const formatTime = (date?: Date | string) => (date ? format(new Date(date), "hh:mm a") : null);

    const createdTime = format(new Date(pickup.createdAt), "hh:mm a");
    const pickupTime = formatTime(pickup.actualPickupTime);
    const deliveryTime = formatTime(pickup.actualDeliveryTime);

    const baseSteps = [
      {
        key: "pickup",
        label: "Pickup Confirmed",
        icon: PackageCheck,
        time: pickupTime || createdTime,
      },
      {
        key: "enroute",
        label: "En Route to Destination",
        icon: Truck,
        time: pickupTime || null,
      },
      {
        key: "delivered",
        label: "Delivered Successfully",
        icon: CheckCircle2,
        time: deliveryTime,
      },
    ];

    if (pickup.status === "delivered") {
      return baseSteps.map((s) => ({ ...s, completed: true }));
    }

    if (pickup.status === "failed") {
      return [
        { ...baseSteps[0], completed: true },
        { ...baseSteps[1], completed: true },
        {
          key: "failed",
          label: "Delivery Failed",
          icon: XCircle,
          time: createdTime,
          completed: true,
          isError: true,
        },
      ];
    }

    if (pickup.status === "cancelled") {
      return [
        { ...baseSteps[0], completed: true },
        {
          key: "cancelled",
          label: "Order Cancelled",
          icon: XCircle,
          time: createdTime,
          completed: true,
          isError: true,
        },
      ];
    }

    // In-progress
    return baseSteps.map((step, index) => ({
      ...step,
      completed: index === 0,
    }));
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string; icon?: string }> = {
      delivered: { variant: "default", label: "Delivered", icon: "✓" },
      cancelled: { variant: "destructive", label: "Cancelled", icon: "✕" },
      failed: { variant: "destructive", label: "Failed", icon: "!" },
    };

    const config = variants[status] || variants.delivered;
    return (
      <Badge variant={config.variant} className="capitalize">
        {config.icon && <span className="mr-1">{config.icon}</span>}
        {config.label}
      </Badge>
    );
  };

  const filteredPickups = statusFilter === "all" ? pickups : pickups.filter((p) => p.status === statusFilter);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Pickup History</SheetTitle>
              <SheetDescription>Delivery history for {driver.fullName}</SheetDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-4">
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
              <p className="text-xs text-green-600">Completed</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-4">
              <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
              <p className="text-xs text-red-600">Cancelled</p>
            </div>
            <div className="rounded-lg border border-red-300 bg-gradient-to-br from-red-50 to-red-200 p-4">
              <p className="text-2xl font-bold text-red-800">{stats.failed}</p>
              <p className="text-xs text-red-800">Failed</p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4">
              <p className="text-2xl font-bold text-blue-700">{stats.totalDistance.toFixed(1)} km</p>
              <p className="text-xs text-blue-600">Total Distance</p>
            </div>
            <div className="rounded-lg border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-600 text-yellow-600" />
                <p className="text-2xl font-bold text-yellow-700">{stats.averageRating.toFixed(1)}</p>
              </div>
              <p className="text-xs text-yellow-600">Avg Rating</p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mt-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="mt-2 h-[calc(100vh-480px)]">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
            </div>
          ) : filteredPickups.length === 0 ? (
            <div className="text-muted-foreground flex h-32 flex-col items-center justify-center">
              <Package className="mb-2 h-12 w-12 opacity-50" />
              <p>No pickup history</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* {filteredPickups.map((pickup) => (*/}

              {filteredPickups.map((pickup) => {
                const isExpanded = expandedId === pickup._id;
                return (
                  <div key={pickup._id} className="rounded-lg border bg-white p-4 transition-shadow hover:shadow-md">
                    {/* Header */}
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <p className="font-semibold">#{pickup.orderNumber}</p>
                          {getStatusBadge(pickup.status)}
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {format(new Date(pickup.createdAt), "MMM dd, yyyy • hh:mm a")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">₦{pickup.totalAmount.toLocaleString()}</p>
                        {pickup.rating && (
                          <div className="mt-1 flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs font-medium">{pickup.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="mb-3">
                      <p className="text-sm font-medium">{pickup.customerName}</p>
                      <p className="text-muted-foreground text-xs">{pickup.customerPhone}</p>
                    </div>

                    {/* Location Summary */}
                    <div className="mb-3 rounded bg-gray-50 p-3">
                      <div className="mb-2 flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-orange-500" />
                        <div className="flex-1">
                          <p className="text-muted-foreground text-xs">From</p>
                          <p className="text-muted-foreground">{pickup.pickupLocation.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-green-500" />
                        <div className="flex-1">
                          <p className="text-muted-foreground text-xs">To</p>
                          <p className="text-muted-foreground">{pickup.deliveryLocation.address}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-purple-800 dark:bg-purple-900"
                      onClick={() => setExpandedId(isExpanded ? null : pickup._id)}
                    >
                      {isExpanded ? "Hide Delivery Progress" : "View Delivery Progress"}
                    </Button>

                    {/* Timeline */}
                    {isExpanded && (
                      <div className="relative mt-4 mb-3 space-y-6 transition-all duration-300 ease-in-out">
                        {generateTimeline(pickup).map((activity, index, arr) => {
                          const isLast = index === arr.length - 1;
                          const Icon = activity.icon;

                          const dotColor = activity.isError
                            ? "bg-red-600"
                            : activity.completed
                              ? "bg-green-600"
                              : "bg-gray-300 dark:bg-gray-600";

                          const lineColor = activity.completed ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700";

                          return (
                            <div
                              key={activity.key}
                              className="animate-in fade-in slide-in-from-bottom-2 flex items-start gap-4 duration-300"
                            >
                              {/* Timeline Column */}
                              <div className="flex flex-col items-center">
                                <div
                                  className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${dotColor}`}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>

                                {!isLast && <div className={`h-12 w-0.5 ${lineColor}`} />}
                              </div>

                              {/* Content */}
                              <div className="flex w-full items-center gap-4">
                                {/* Fixed Time Column */}
                                <div className="w-24 text-right">
                                  {activity.time && (
                                    <span
                                      className={`text-xs font-semibold ${
                                        activity.completed ? "text-gray-900" : "text-muted-foreground"
                                      }`}
                                    >
                                      {activity.time}
                                    </span>
                                  )}
                                </div>

                                {/* Label */}
                                <div className="flex-1">
                                  <p
                                    className={`text-sm ${
                                      activity.completed ? "font-medium text-gray-900" : "text-muted-foreground"
                                    }`}
                                  >
                                    {activity.label}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Timing */}
                    <div className="mt-5 mb-3 grid grid-cols-2 gap-3">
                      {pickup.actualPickupTime && (
                        <div>
                          <p className="text-muted-foreground mb-1 text-xs">Picked Up</p>
                          <div className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(pickup.actualPickupTime), "hh:mm a")}</span>
                          </div>
                        </div>
                      )}
                      {pickup.actualDeliveryTime && (
                        <div>
                          <p className="text-muted-foreground mb-1 text-xs">Delivered</p>
                          <div className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(pickup.actualDeliveryTime), "hh:mm a")}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Duration & Distance */}
                    {(pickup.duration || pickup.distance) && (
                      <div className="text-muted-foreground flex items-center gap-4 text-xs">
                        {pickup.duration && <span>{pickup.duration} mins</span>}
                        {pickup.distance && <span>{pickup.distance} km</span>}
                      </div>
                    )}

                    {/* Items Count */}
                    <Separator className="my-3" />
                    <div className="mt-2 text-xs">
                      {/* Header Row (Clickable) */}
                      <button
                        onClick={() => setExpandedItemsId(expandedItemsId === pickup._id ? null : pickup._id)}
                        className="text-muted-foreground flex w-full items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span>{pickup.items.length} item(s)</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              expandedItemsId === pickup._id ? "rotate-180" : ""
                            }`}
                          />
                        </div>

                        <span>
                          Payment: <span className="capitalize">{pickup.paymentStatus}</span>
                        </span>
                      </button>

                      {/* Dropdown Content */}
                      {expandedItemsId === pickup._id && (
                        <div className="mt-3 space-y-2 rounded-md border bg-gray-50 p-3 dark:bg-gray-800">
                          {pickup.items.map((item, index) => {
                            const subtotal = item.quantity * item.price;

                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between text-gray-700 dark:text-gray-300"
                              >
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  <span className="text-muted-foreground ml-1">x{item.quantity}</span>
                                </div>

                                <div className="text-right">₦{subtotal.toLocaleString()}</div>
                              </div>
                            );
                          })}

                          {/* Total */}
                          <div className="flex justify-between border-t pt-2 font-semibold text-gray-900 dark:text-gray-100">
                            <span>Total</span>
                            <span>₦{pickup.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* <div className="mt-2 space-y-2 text-xs">*/}
                    {/*  /!* Header Row *!/*/}
                    {/*  <div className="text-muted-foreground flex items-center justify-between">*/}
                    {/*    <span>{pickup.items.length} item(s)</span>*/}
                    {/*    <span>*/}
                    {/*      Payment: <span className="capitalize">{pickup.paymentStatus}</span>*/}
                    {/*    </span>*/}
                    {/*  </div>*/}

                    {/*  /!* Items List *!/*/}
                    {/*  <div className="space-y-1">*/}
                    {/*    {pickup.items.map((item, index) => {*/}
                    {/*      const subtotal = item.quantity * item.price;*/}

                    {/*      return (*/}
                    {/*        <div*/}
                    {/*          key={index}*/}
                    {/*          className="flex items-center justify-between text-gray-700 dark:text-gray-300"*/}
                    {/*        >*/}
                    {/*          <div>*/}
                    {/*            <span className="font-medium">{item.name}</span>*/}
                    {/*            <span className="text-muted-foreground ml-1">x{item.quantity}</span>*/}
                    {/*          </div>*/}

                    {/*          <div className="text-right">*/}
                    {/*            <p>₦{subtotal.toLocaleString()}</p>*/}
                    {/*          </div>*/}
                    {/*        </div>*/}
                    {/*      );*/}
                    {/*    })}*/}
                    {/*  </div>*/}

                    {/*  /!* Total *!/*/}
                    {/*  <div className="flex justify-between border-t pt-2 font-semibold text-gray-900 dark:text-gray-100">*/}
                    {/*    <span>Total</span>*/}
                    {/*    <span>₦{pickup.totalAmount.toLocaleString()}</span>*/}
                    {/*  </div>*/}
                    {/* </div>*/}

                    {/* Feedback */}
                    {pickup.feedback && (
                      <div className="mt-3 rounded border border-blue-200 bg-blue-50 p-2 text-xs">
                        <p className="text-blue-800 italic">{pickup.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Pagination */}
        {!isLoading && filteredPickups.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <span className="text-muted-foreground text-sm">
              Page {page} of {totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
