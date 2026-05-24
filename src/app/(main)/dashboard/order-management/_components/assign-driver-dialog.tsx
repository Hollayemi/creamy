"use client";

import { useState, useMemo } from "react";
import { X, MoreVertical, Search, Star, Truck, Bike, Car, Package, CheckCircle2, Loader2, User, MapPin, Phone, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGetAvailableDriversQuery } from "@/stores/services/driverApi";
import { useAssignDriverToOrderMutation } from "@/stores/services/orderApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

interface AssignDriverDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  order: Order
  onSuccess?: () => void;
}

const vehicleIcons: Record<string, any> = {
  motorcycle: Bike,
  bicycle: Bike,
  car: Car,
  van: Truck,
  truck: Truck,
};

const vehicleColors: Record<string, string> = {
  motorcycle: "text-orange-500 bg-orange-50",
  bicycle: "text-green-500 bg-green-50",
  car: "text-blue-500 bg-blue-50",
  van: "text-purple-500 bg-purple-50",
  truck: "text-red-500 bg-red-50",
};

export default function AssignDriverDialog({
  isOpen,
  order,
  onClose,
  orderNumber,
  onSuccess,
}: AssignDriverDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [distanceKm, setDistanceKm] = useState(order?.distanceToCustomerKm?.toString() || "3.5");
  const [pickupAddress, setPickupAddress] = useState("");
  const [isPriority, setIsPriority] = useState(false);

  const { data, isLoading, isFetching, refetch } = useGetAvailableDriversQuery(
    { search: search || undefined },
    { skip: !isOpen, pollingInterval: 30000 }
  );

  const [assignDriver, { isLoading: isAssigning }] = useAssignDriverToOrderMutation();

  const drivers = data?.data?.drivers ?? [];

  const selectedDriver = useMemo(
    () => drivers.find((d) => d._id === selectedDriverId) ?? null,
    [drivers, selectedDriverId]
  );

  const estimatedFare = useMemo(() => {
    const base = 900;
    const bonus = Math.round(Number(distanceKm) * 89);
    const priority = isPriority ? 50 : 0;
    return base + bonus + priority;
  }, [distanceKm, isPriority]);

  const handleAssign = async () => {
    if (!selectedDriverId) return;
    try {
      await assignDriver({
        orderNumber,
        data: {
          driverId: selectedDriverId,
          distanceKm: Number(distanceKm) || 3.5,
          isPriority,
          pickupAddress: pickupAddress || undefined,
        },
      }).unwrap();

      toast.success("Driver assigned successfully! Customer has been notified.");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to assign driver");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gray-900 px-6 py-4 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <MoreVertical className="h-5 w-5 text-gray-400" />
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Assign Driver</h2>
              <p className="text-xs text-gray-400">Order {orderNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 transition hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search + Refresh */}
        <div className="border-b bg-gray-50 px-6 py-3 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, phone or plate..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9 text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9 gap-1.5"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 gap-0 overflow-hidden">
          {/* Driver List */}
          <div className="flex w-full flex-col overflow-hidden md:w-[55%] md:border-r">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Available Drivers
              </span>
              {!isLoading && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  {drivers.length} online
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-3">
              {isLoading ? (
                <div className="flex flex-col gap-2 pt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
                  ))}
                </div>
              ) : drivers.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
                  <Truck className="h-8 w-8 text-gray-300" />
                  <p className="text-sm text-gray-500">No available drivers right now</p>
                  <p className="text-xs text-gray-400">Try refreshing or check back soon</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 pt-1">
                  {drivers.map((driver) => {
                    const VehicleIcon = vehicleIcons[driver.vehicleType] ?? Truck;
                    const iconStyle = vehicleColors[driver.vehicleType] ?? "text-gray-500 bg-gray-50";
                    const isSelected = selectedDriverId === driver._id;
                    const completionRate =
                      driver.totalDeliveries > 0
                        ? Math.round((driver.completedDeliveries / driver.totalDeliveries) * 100)
                        : 0;

                    return (
                      <button
                        key={driver._id}
                        onClick={() => setSelectedDriverId(driver._id)}
                        className={cn(
                          "group relative flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all",
                          isSelected
                            ? "border-purple-400 bg-purple-50 shadow-sm dark:border-purple-600 dark:bg-purple-950/20"
                            : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                        )}
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          {driver.avatar ? (
                            <img
                              src={driver.avatar}
                              alt={driver.fullName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-sm font-bold text-white">
                              {driver.fullName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          {/* Online indicator */}
                          <span
                            className={cn(
                              "absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white",
                              driver.isOnline ? "bg-green-500" : "bg-gray-300"
                            )}
                          />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                              {driver.fullName}
                            </p>
                            <div className="flex items-center gap-1 shrink-0">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {driver.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-1 flex items-center gap-2 flex-wrap">
                            <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium", iconStyle)}>
                              <VehicleIcon className="h-3 w-3" />
                              {driver.vehicleType}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {driver.vehiclePlateNumber}
                            </span>
                          </div>

                          <div className="mt-1.5 flex items-center gap-3">
                            <span className="text-xs text-gray-400">
                              {driver.completedDeliveries} deliveries
                            </span>
                            <div className="h-1 flex-1 rounded-full bg-gray-100 dark:bg-gray-700">
                              <div
                                className="h-1 rounded-full bg-green-400"
                                style={{ width: `${completionRate}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">{completionRate}%</span>
                          </div>
                        </div>

                        {/* Selected check */}
                        {isSelected && (
                          <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Assignment Config Panel */}
          <div className="hidden w-[45%] flex-col overflow-y-auto md:flex">
            {selectedDriver ? (
              <div className="flex flex-col gap-4 p-5">
                {/* Selected driver card */}
                <div className="rounded-lg border border-purple-100 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950/20">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Selected Driver
                  </p>
                  <div className="flex items-center gap-3">
                    {selectedDriver.avatar ? (
                      <img src={selectedDriver.avatar} className="h-10 w-10 rounded-full object-cover" alt="" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                        {selectedDriver.fullName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedDriver.fullName}</p>
                      <p className="text-xs text-gray-500">{selectedDriver.phone}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <MapPin className="h-3 w-3" />
                      {selectedDriver.region.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {selectedDriver.rating.toFixed(1)} rating
                    </div>
                  </div>
                </div>

                {/* Delivery config */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Delivery Details
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Pickup Address
                    </label>
                    <Input
                      placeholder={`${selectedDriver.region.name} Warehouse`}
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Estimated Distance (km)
                    </label>
                    <Input
                      type="number"
                      min="0.1"
                      step="0.1"
                      disabled={true}
                      value={distanceKm}
                      onChange={(e) => setDistanceKm(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800">
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Priority Delivery</p>
                      <p className="text-xs text-gray-400">+₦50 priority fee</p>
                    </div>
                    <button
                      onClick={() => setIsPriority((p) => !p)}
                      className={cn(
                        "relative h-5 w-9 rounded-full transition-colors",
                        isPriority ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                          isPriority ? "left-[calc(100%-18px)]" : "left-0.5"
                        )}
                      />
                    </button>
                  </div>

                  {/* Fare summary */}
                  <div className="rounded-lg border bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                    <p className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">Fare Breakdown</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Base fare</span>
                        <span>₦900</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Distance ({distanceKm}km × ₦89)</span>
                        <span>₦{Math.round(Number(distanceKm) * 89).toLocaleString()}</span>
                      </div>
                      {isPriority && (
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Priority fee</span>
                          <span>₦50</span>
                        </div>
                      )}
                      <div className="mt-2 flex justify-between border-t pt-2 font-semibold text-gray-800 dark:text-gray-200">
                        <span>Total earnings</span>
                        <span className="text-green-600">₦{estimatedFare.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <User className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Select a driver</p>
                <p className="text-xs text-gray-400">Choose an available driver from the list to configure assignment details</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4 dark:bg-gray-800">
          <div className="text-xs text-gray-500">
            {selectedDriver ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                {selectedDriver.fullName} selected
              </span>
            ) : (
              "No driver selected"
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isAssigning}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-purple-600 text-white hover:bg-purple-700"
              disabled={!selectedDriverId || isAssigning}
              onClick={handleAssign}
            >
              {isAssigning ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <Truck className="h-3.5 w-3.5" />
                  Assign Driver
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
