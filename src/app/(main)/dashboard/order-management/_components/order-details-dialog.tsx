"use client";

import { X, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatDate } from "@/lib/utils";
import CancelOrderDialog from "./cancel-order-dialog";
import UpdateStatusDialog from "./update-status-dialog";
import AssignDriverDialog from "./assign-driver-dialog";
import { useState } from "react";
import {
  useCancelOrderMutation,
  useUpdateOrderStatusMutation
} from "@/stores/services/orderApi";
import type { Order } from "@/types/order";
import { toast } from "sonner";

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: () => void;
}

// Status display config
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  'paid': { label: 'Paid', color: 'bg-green-100 text-green-800' },
  'confirmed': { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  'processing': { label: 'Processing', color: 'bg-purple-100 text-purple-800' },
  'shipped': { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
  'delivered': { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  'returned': { label: 'Returned', color: 'bg-orange-100 text-orange-800' },
  'refunded': { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
};

export default function OrderDetailsDialog({
  order,
  isOpen,
  onClose,
  onStatusUpdate
}: OrderDetailsDialogProps) {
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isAssignDriverOpen, setIsAssignDriverOpen] = useState(false);

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();

  if (!isOpen || !order) return null;

  const isCancelled = order.status === 'cancelled';
  const canAccept = order.status === 'paid';
  const canUpdate = !isCancelled && order.status !== 'paid';

  const handleAccept = async () => {
    try {
      await updateOrderStatus({
        orderNumber: order.orderId,
        data: { status: "confirmed", note: "Order accepted by admin" },
      }).unwrap();
      toast.success("Order accepted successfully");
      onStatusUpdate?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to accept order");
    }
  };

  const handleStatusUpdate = async (status: string, note: string) => {
    try {
      await updateOrderStatus({
        orderNumber: order.orderId,
        data: { status, note },
      }).unwrap();

      const statusConfig = STATUS_CONFIG[status];
      toast.success(`Order ${statusConfig?.label || status} successfully`);

      setIsUpdateStatusOpen(false);
      onStatusUpdate?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to update order status`);
    }
  };

  const handleCancelConfirm = async (reason: string, note: string, password: string) => {
    try {
      await cancelOrder({
        orderNumber: order.orderId,
        data: { reason, note, password },
      }).unwrap();
      toast.success("Order cancelled successfully");
      setIsCancelOpen(false);
      onStatusUpdate?.();
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

  const currentStatusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];

  return (
    <>
      <div className="fixed left-68 inset-0 z-50 flex w-[410px] items-center justify-center pointer-events-none">
        <div className="relative max-h-[90vh] w-full max-w-3xl  rounded-lg bg-white shadow-xl dark:bg-gray-900 pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-gray-900 p-6 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-3">
                <MoreVertical className="h-5 w-5 cursor-pointer text-gray-300 transition-colors hover:text-white" />
                <MoreVertical className="h-5 w-5 cursor-pointer text-gray-300 transition-colors hover:text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">{order.orderId}</h2>
              <Badge className={cn("ml-3", currentStatusConfig.color)}>{currentStatusConfig.label}</Badge>
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
                      <img
                        src={item.image}
                        width={900}
                        height={900}
                        alt={item.name}
                        className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-200 object-cover"
                      />
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
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(activity.time)}</p>
                      </div>

                      <div className="flex w-12 flex-col items-center">
                        <div className="h-3 w-3 rotate-45 bg-purple-600" />

                        {index < order.activityTimeline.length - 1 && (
                          <div className="h-12 w-0 border-l-[3px] border-dashed border-gray-400 dark:border-gray-500" />
                        )}
                      </div>

                      <div className="w-1/3 pl-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.event}</p>
                        {activity.note && (
                          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{activity.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

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
          <div className="flex w-full items-center gap-2 border-t bg-gray-50 p-4 dark:bg-gray-800">
            {!isCancelled && (
              <>
                {canAccept ? (
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleAccept}
                    disabled={isUpdatingStatus}
                  >
                    {isUpdatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Accept Order
                  </Button>
                ) : canUpdate ? (
                  <Button
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => setIsUpdateStatusOpen(true)}
                  >
                    Update Status
                  </Button>
                ) : null}
                <Button onClick={() => setIsAssignDriverOpen(true)}>
                  Assign Driver
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 border-red-300 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800"
                  onClick={() => setIsCancelOpen(true)}
                  disabled={isUpdatingStatus}
                >
                  Cancel Order
                </Button>
              </>
            )}

            {isCancelled && (
              <Button variant="outline" className="w-full" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </div>

      <CancelOrderDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancelConfirm}
        isSubmitting={isCancelling}
      />

      <UpdateStatusDialog
        isOpen={isUpdateStatusOpen}
        onClose={() => setIsUpdateStatusOpen(false)}
        onConfirm={handleStatusUpdate}
        currentStatus={order.status}
        isSubmitting={isUpdatingStatus}
      />

      <AssignDriverDialog
        isOpen={isAssignDriverOpen}
        order={order}
        onClose={() => setIsAssignDriverOpen(false)}
        orderNumber={order.orderId}
        onSuccess={onStatusUpdate}
      />
    </>
  );
}
