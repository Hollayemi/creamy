"use client";

import { X, Package, MapPin, Clock, Phone, Navigation } from "lucide-react";
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
import { useGetDriverOngoingPickupsQuery, type Driver } from "@/stores/services/driverApi";

interface DriverOngoingPickupsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Driver;
}

export default function DriverOngoingPickups({
  open,
  onOpenChange,
  driver,
}: DriverOngoingPickupsProps) {
  const { data: pickupsResponse, isLoading } = useGetDriverOngoingPickupsQuery(
    driver._id,
    { skip: !open }
  );

  const pickups = pickupsResponse?.data || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      assigned: { variant: "secondary", label: "Assigned" },
      "picked-up": { variant: "default", label: "Picked Up" },
      "in-transit": { variant: "default", label: "In Transit" },
    };

    const config = variants[status] || variants.assigned;
    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      urgent: { color: "bg-red-100 text-red-700", label: "Urgent" },
      high: { color: "bg-orange-100 text-orange-700", label: "High" },
      normal: { color: "bg-blue-100 text-blue-700", label: "Normal" },
      low: { color: "bg-gray-100 text-gray-700", label: "Low" },
    };

    const config = variants[priority] || variants.normal;
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      paid: { color: "bg-green-100 text-green-700", label: "Paid" },
      cod: { color: "bg-yellow-100 text-yellow-700", label: "Cash on Delivery" },
      pending: { color: "bg-gray-100 text-gray-700", label: "Pending" },
    };

    const config = variants[status] || variants.pending;
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Ongoing Pickups</SheetTitle>
              <SheetDescription>
                Active deliveries for {driver.fullName}
              </SheetDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Driver Info Card */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 mx-3 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">{driver.fullName}</p>
              <p className="text-sm text-muted-foreground">{driver.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{pickups.length}</p>
              <p className="text-xs text-muted-foreground">Active Deliveries</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-240px)] mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : pickups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Package className="h-12 w-12 mb-2 opacity-50" />
              <p>No ongoing pickups</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pickups.map((pickup) => (
                <div
                  key={pickup._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-lg">#{pickup.orderNumber}</p>
                        {getStatusBadge(pickup.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {pickup.customerName}
                      </p>
                    </div>
                    <div className="text-right">
                      {getPriorityBadge(pickup.priority)}
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="space-y-3 mb-3">
                    {/* Pickup Location */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <div className="w-0.5 h-full bg-gray-300 my-1" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">Pickup Location</p>
                        <p className="text-sm font-medium">{pickup.pickupLocation.address}</p>
                        {pickup.pickupLocation.contactName && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Contact: {pickup.pickupLocation.contactName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Location */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">Delivery Location</p>
                        <p className="text-sm font-medium">{pickup.deliveryLocation.address}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {pickup.deliveryLocation.contactName}
                          </p>
                          <a
                            href={`tel:${pickup.deliveryLocation.contactPhone}`}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Phone className="h-3 w-3" />
                            {pickup.deliveryLocation.contactPhone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Distance & Time */}
                  {(pickup.distance || pickup.estimatedDeliveryTime) && (
                    <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                      {pickup.distance && (
                        <div className="flex items-center gap-1">
                          <Navigation className="h-3 w-3" />
                          <span>{pickup.distance} km</span>
                        </div>
                      )}
                      {pickup.estimatedDeliveryTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            ETA: {format(new Date(pickup.estimatedDeliveryTime), "hh:mm a")}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Items Summary */}
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-muted-foreground">Items</p>
                      {getPaymentBadge(pickup.paymentStatus)}
                    </div>
                    <div className="space-y-1">
                      {pickup.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.quantity}x {item.productName}
                          </span>
                          <span className="font-medium">
                            ₦{item.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {pickup.items.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{pickup.items.length - 2} more items
                        </p>
                      )}
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total</span>
                      <span className="text-blue-600">
                        ₦{pickup.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Instructions */}
                  {pickup.deliveryInstructions && (
                    <div className="text-xs bg-blue-50 border border-blue-200 rounded p-2">
                      <p className="font-medium text-blue-800 mb-1">Instructions:</p>
                      <p className="text-blue-700">{pickup.deliveryInstructions}</p>
                    </div>
                  )}

                  {/* Tracking Info */}
                  {pickup.currentLocation && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>
                            Last updated:{" "}
                            {format(new Date(pickup.currentLocation.timestamp), "hh:mm a")}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            window.open(
                              `https://www.google.com/maps?q=${pickup.currentLocation?.lat},${pickup.currentLocation?.lng}`,
                              "_blank"
                            );
                          }}
                        >
                          <Navigation className="h-3 w-3 mr-1" />
                          Track
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}