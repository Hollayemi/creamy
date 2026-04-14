"use client";

import { X, Package, MapPin, Clock, Phone, Navigation } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useGetDriverOngoingPickupsQuery, type Driver } from "@/stores/services/driverApi";

interface DriverOngoingPickupsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Driver;
}

export default function DriverOngoingPickups({ open, onOpenChange, driver }: DriverOngoingPickupsProps) {
  const { data: pickupsResponse, isLoading } = useGetDriverOngoingPickupsQuery(driver._id, { skip: !open });

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
    return <span className={`rounded-full px-2 py-1 text-xs ${config.color}`}>{config.label}</span>;
  };

  const getPaymentBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      paid: { color: "bg-green-100 text-green-700", label: "Paid" },
      cod: { color: "bg-yellow-100 text-yellow-700", label: "Cash on Delivery" },
      pending: { color: "bg-gray-100 text-gray-700", label: "Pending" },
    };

    const config = variants[status] || variants.pending;
    return <span className={`rounded-full px-2 py-1 text-xs ${config.color}`}>{config.label}</span>;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Ongoing Pickups</SheetTitle>
              <SheetDescription>Active deliveries for {driver.fullName}</SheetDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Driver Info Card */}
        <div className="mx-3 mt-6 rounded-lg border bg-gray-50 p-4 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{driver.fullName}</p>
              <p className="text-muted-foreground text-sm">{driver.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{pickups.length}</p>
              <p className="text-muted-foreground text-xs">Active Deliveries</p>
            </div>
          </div>
        </div>

        <ScrollArea className="mt-6 h-[calc(100vh-240px)]">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
            </div>
          ) : pickups.length === 0 ? (
            <div className="text-muted-foreground flex h-32 flex-col items-center justify-center">
              <Package className="mb-2 h-12 w-12 opacity-50" />
              <p>No ongoing pickups</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pickups.map((pickup) => (
                <div key={pickup._id} className="rounded-lg border bg-white p-4 transition-shadow hover:shadow-md">
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <p className="text-lg font-semibold">#{pickup.orderNumber}</p>
                        {getStatusBadge(pickup.status)}
                      </div>
                      <p className="text-muted-foreground text-sm">{pickup.customerName}</p>
                    </div>
                    <div className="text-right">{getPriorityBadge(pickup.priority)}</div>
                  </div>

                  {/* Locations */}
                  <div className="mb-3 space-y-3">
                    {/* Pickup Location */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-orange-500" />
                        <div className="my-1 h-full w-0.5 bg-gray-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-muted-foreground mb-1 text-xs">Pickup Location</p>
                        <p className="text-sm font-medium">{pickup.pickupLocation.address}</p>
                        {pickup.pickupLocation.contactName && (
                          <p className="text-muted-foreground mt-1 text-xs">
                            Contact: {pickup.pickupLocation.contactName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Location */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-muted-foreground mb-1 text-xs">Delivery Location</p>
                        <p className="text-sm font-medium">{pickup.deliveryLocation.address}</p>
                        <div className="mt-1 flex items-center gap-3">
                          <p className="text-muted-foreground text-xs">{pickup.deliveryLocation.contactName}</p>
                          <a
                            href={`tel:${pickup.deliveryLocation.contactPhone}`}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
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
                    <div className="text-muted-foreground mb-3 flex items-center gap-4 text-xs">
                      {pickup.distance && (
                        <div className="flex items-center gap-1">
                          <Navigation className="h-3 w-3" />
                          <span>{pickup.distance} km</span>
                        </div>
                      )}
                      {pickup.estimatedDeliveryTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>ETA: {format(new Date(pickup.estimatedDeliveryTime), "hh:mm a")}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Items Summary */}
                  <div className="mb-3 rounded bg-gray-50 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-muted-foreground text-xs font-medium">Items</p>
                      {getPaymentBadge(pickup.paymentStatus)}
                    </div>
                    <div className="space-y-1">
                      {pickup.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.quantity}x {item.productName}
                          </span>
                          <span className="font-medium">₦{item.price.toLocaleString()}</span>
                        </div>
                      ))}
                      {pickup.items.length > 2 && (
                        <p className="text-muted-foreground text-xs">+{pickup.items.length - 2} more items</p>
                      )}
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total</span>
                      <span className="text-blue-600">₦{pickup.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Delivery Instructions */}
                  {pickup.deliveryInstructions && (
                    <div className="rounded border border-blue-200 bg-blue-50 p-2 text-xs">
                      <p className="mb-1 font-medium text-blue-800">Instructions:</p>
                      <p className="text-blue-700">{pickup.deliveryInstructions}</p>
                    </div>
                  )}

                  {/* Tracking Info */}
                  {pickup.currentLocation && (
                    <div className="mt-3 border-t pt-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>Last updated: {format(new Date(pickup.currentLocation.timestamp), "hh:mm a")}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            window.open(
                              `https://www.google.com/maps?q=${pickup.currentLocation?.lat},${pickup.currentLocation?.lng}`,
                              "_blank",
                            );
                          }}
                        >
                          <Navigation className="mr-1 h-3 w-3" />
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
