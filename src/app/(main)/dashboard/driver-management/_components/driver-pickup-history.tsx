"use client";

import { X, Package, MapPin, Clock, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDriverPickupHistoryQuery, useGetDriverPickupStatsQuery, type Driver } from "@/stores/services/driverApi";

interface DriverPickupHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Driver;
}

export default function DriverPickupHistory({
  open,
  onOpenChange,
  driver,
}: DriverPickupHistoryProps) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const limit = 10;

  const { data: historyResponse, isLoading } = useGetDriverPickupHistoryQuery(
    { driverId: driver._id, page, limit },
    { skip: !open }
  );

  const { data: statsResponse } = useGetDriverPickupStatsQuery(driver._id, {
    skip: !open,
  });

  const pickups = historyResponse?.data?.pickups || [];
  const stats = statsResponse?.data;
  const totalPages = historyResponse?.data?.pagination?.totalPages || 1;

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

  const filteredPickups = statusFilter === "all" 
    ? pickups 
    : pickups.filter(p => p.status === statusFilter);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Pickup History</SheetTitle>
              <SheetDescription>
                Delivery history for {driver.fullName}
              </SheetDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Stats Cards */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
              <p className="text-xs text-green-600">Completed</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
              <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
              <p className="text-xs text-red-600">Cancelled</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <p className="text-2xl font-bold text-blue-700">
                {stats.totalDistance.toFixed(1)} km
              </p>
              <p className="text-xs text-blue-600">Total Distance</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                <p className="text-2xl font-bold text-yellow-700">
                  {stats.averageRating.toFixed(1)}
                </p>
              </div>
              <p className="text-xs text-yellow-600">Avg Rating</p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mt-6">
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

        <ScrollArea className="h-[calc(100vh-480px)] mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredPickups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Package className="h-12 w-12 mb-2 opacity-50" />
              <p>No pickup history</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPickups.map((pickup) => (
                <div
                  key={pickup._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">#{pickup.orderNumber}</p>
                        {getStatusBadge(pickup.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(pickup.createdAt), "MMM dd, yyyy • hh:mm a")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">
                        ₦{pickup.totalAmount.toLocaleString()}
                      </p>
                      {pickup.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-medium">{pickup.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="mb-3">
                    <p className="text-sm font-medium">{pickup.customerName}</p>
                    <p className="text-xs text-muted-foreground">{pickup.customerPhone}</p>
                  </div>

                  {/* Location Summary */}
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">From</p>
                        <p className="text-sm">{pickup.pickupLocation.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">To</p>
                        <p className="text-sm">{pickup.deliveryLocation.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timing */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {pickup.actualPickupTime && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Picked Up</p>
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(pickup.actualPickupTime), "hh:mm a")}</span>
                        </div>
                      </div>
                    )}
                    {pickup.actualDeliveryTime && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Delivered</p>
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(pickup.actualDeliveryTime), "hh:mm a")}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Duration & Distance */}
                  {(pickup.duration || pickup.distance) && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {pickup.duration && <span>{pickup.duration} mins</span>}
                      {pickup.distance && <span>{pickup.distance} km</span>}
                    </div>
                  )}

                  {/* Items Count */}
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      {pickup.items.length} item(s)
                    </span>
                    <span className="text-muted-foreground">
                      Payment: <span className="capitalize">{pickup.paymentStatus}</span>
                    </span>
                  </div>

                  {/* Feedback */}
                  {pickup.feedback && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                      <p className="text-blue-800 italic">"{pickup.feedback}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Pagination */}
        {!isLoading && filteredPickups.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}