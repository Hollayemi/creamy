"use client";

import { X, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import CancelOrderDialog from "./cancel-order-dialog";
import { useState } from "react";
import { useCancelOrderMutation, useTransferOrderMutation } from "@/stores/services/orderApi";
import type { Order } from "@/types/order";
import { toast } from "sonner";

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsDialog({ order, isOpen, onClose }: OrderDetailsDialogProps) {
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  if (!isOpen || !order) return null;

  const handleCancelConfirm = async (reason: string, note: string, password: string) => {
    try {
      await cancelOrder({
        orderNumber: order.orderId,
        data: { reason, note, password },
      }).unwrap();
      toast.success("Order cancelled successfully");
      setIsCancelOpen(false);
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel order");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(order.customerName);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: "bg-yellow-100 text-yellow-800",
      Processing: "bg-blue-100 text-blue-800",
      "En-Route": "bg-purple-100 text-purple-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || colors.Pending;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex w-96 items-center justify-center bg-black/50">
        <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-gray-900 p-6 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-3">
                <MoreVertical className="h-5 w-5 cursor-pointer text-gray-300 transition-colors hover:text-white" />
                <MoreVertical className="h-5 w-5 cursor-pointer text-gray-300 transition-colors hover:text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">{order.orderId}</h2>
            </div>

            <button onClick={onClose} className="text-white transition-colors hover:text-gray-300">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="border-b p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-400">
                <span className="text-lg font-bold text-gray-900">{initials}</span>
              </div>

              <div className="flex flex-col justify-between">
                <p className="text-lg font-bold text-gray-900 underline decoration-gray-600 decoration-2 underline-offset-4 dark:text-white">
                  {order.customerName}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400">{order.customerEmail}</p>

                <p className="text-sm text-gray-600 dark:text-gray-400">{order.customerPhone}</p>
              </div>
            </div>

            <div className="mt-2 ml-24">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-400">Delivery Address</p>

              <p className="text-base font-semibold text-gray-900 dark:text-white">{order.deliveryAddress}</p>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="max-h-[calc(90vh-250px)] overflow-y-auto">
            <Tabs defaultValue="items" className="w-full">
              <TabsList className="h-12 w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="items"
                  className="rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:bg-transparent data-[state=active]:text-purple-600 dark:text-gray-400 dark:data-[state=active]:text-purple-400"
                >
                  Ordered Items
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:bg-transparent data-[state=active]:text-purple-600 dark:text-gray-400 dark:data-[state=active]:text-purple-400"
                >
                  Activity Timeline
                </TabsTrigger>
                <TabsTrigger
                  value="delivery"
                  className="rounded-none border-b-2 border-transparent text-gray-600 data-[state=active]:border-purple-600 data-[state=active]:bg-transparent data-[state=active]:text-purple-600 dark:text-gray-400 dark:data-[state=active]:text-purple-400"
                >
                  Delivery Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="p-6">
                <div className="space-y-4">
                  {order.orderedItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 rounded-lg border p-4">
                      <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-200" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {item.quantity} x ₦{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-xl font-bold">₦{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="p-6">
                <div className="space-y-6">
                  {order.activityTimeline.map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-1/3 pr-4 text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.time}</p>
                      </div>

                      <div className="flex w-12 flex-col items-center">
                        <div className="h-3 w-3 rotate-45 bg-purple-600" />

                        {index < order.activityTimeline.length - 1 && (
                          <div className="h-12 w-0 border-l-[3px] border-dashed border-gray-400 dark:border-gray-500" />
                        )}
                      </div>

                      <div className="w-1/3 pl-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* <TabsContent value="delivery" className="p-6">*/}
              {/*  <div className="space-y-6">*/}
              {/*    <div>*/}
              {/*      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Courier Name</p>*/}
              {/*      <p className="text-base font-semibold text-gray-900 dark:text-white">{order.courierName}</p>*/}
              {/*    </div>*/}

              {/*    <div>*/}
              {/*      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Courier Phone</p>*/}
              {/*      <p className="text-base font-semibold text-gray-900 dark:text-white">{order.courierPhone}</p>*/}
              {/*    </div>*/}

              {/*    <div>*/}
              {/*      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vehicle Type</p>*/}
              {/*      <p className="text-base font-semibold text-gray-900 dark:text-white">{order.vehicleType}</p>*/}
              {/*    </div>*/}

              {/*    <div>*/}
              {/*      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Plate Number</p>*/}
              {/*      <p className="text-base font-semibold text-gray-900 dark:text-white">{order.plateNumber}</p>*/}
              {/*    </div>*/}

              {/*    <div>*/}
              {/*      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pickup Location</p>*/}
              {/*      <p className="text-base font-semibold text-gray-900 dark:text-white">{order.pickupLocation}</p>*/}
              {/*    </div>*/}

              {/*    <div>*/}
              {/*      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tracking Status</p>*/}
              {/*      <p className="text-base font-semibold text-gray-900 dark:text-white">{order.trackingStatus}</p>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/* </TabsContent>*/}

              <TabsContent value="delivery" className="p-6">
                <div className="space-y-2">
                  {[
                    { label: "Courier Name", value: order.courierName },
                    { label: "Courier Phone", value: order.courierPhone },
                    { label: "Vehicle Type", value: order.vehicleType },
                    { label: "Plate Number", value: order.plateNumber },
                    { label: "Pickup Location", value: order.pickupLocation },
                    { label: "Tracking Status", value: order.trackingStatus },
                  ].map((item, index) => (
                    <div key={index} className="grid grid-cols-[120px_1fr] items-center border-b pb-3">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.label}</p>

                      <p className="text-left text-base font-semibold text-gray-900 dark:text-white">
                        {item.value ?? "-"}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t bg-gray-50 p-6 dark:bg-gray-800">
            <Button variant="outline" className="border-purple-300 bg-purple-100 text-purple-700 hover:bg-purple-200">
              Transfer Order
            </Button>
            <Button
              variant="outline"
              className="border-red-300 bg-red-100 text-red-700 hover:bg-red-200"
              onClick={() => setIsCancelOpen(true)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <CancelOrderDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancelConfirm}
        isSubmitting={isCancelling}
      />
    </>
  );
}
