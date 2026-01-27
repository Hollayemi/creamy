"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface ActivityTimelineItem {
    time: string;
    event: string;
}

interface Order {
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    region: string;
    totalAmount: number;
    items: number;
    status: string;
    dateOrdered: string;
    deliveryDate: string;
    courierName: string;
    courierPhone: string;
    vehicleType: string;
    plateNumber: string;
    pickupLocation: string;
    trackingStatus: string;
    orderedItems: OrderItem[];
    activityTimeline: ActivityTimelineItem[];
}

interface OrderDetailsDialogProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function OrderDetailsDialog({ order, isOpen, onClose }: OrderDetailsDialogProps) {
    if (!isOpen || !order) return null;

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
        <div className="fixed w-96 inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-6 bg-gray-900 dark:bg-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                            <span className="text-gray-900 font-bold text-lg">MA</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">{order.orderId}</h2>
                            <p className="text-sm text-gray-300">{order.customerName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Customer Info Section */}
                <div className="p-6 border-b">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.customerEmail}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.customerPhone}</p>
                        <div className="mt-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Delivery Address</p>
                            <p className="text-base text-gray-900 dark:text-white font-semibold">{order.deliveryAddress}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="overflow-y-auto max-h-[calc(90vh-250px)]">
                    <Tabs defaultValue="items" className="w-full">
                        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
                            <TabsTrigger
                                value="items"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent"
                            >
                                Ordered Items
                            </TabsTrigger>
                            <TabsTrigger
                                value="timeline"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent"
                            >
                                Activity Timeline
                            </TabsTrigger>
                            <TabsTrigger
                                value="delivery"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent"
                            >
                                Delivery Info
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="items" className="p-6">
                            <div className="space-y-4">
                                {order.orderedItems.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {item.quantity} x ₦{item.price.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-lg">Total Amount:</span>
                                        <span className="font-bold text-2xl">₦{order.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="timeline" className="p-6">
                            <div className="space-y-4">
                                {order.activityTimeline.map((activity, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-4 h-4 bg-purple-600 rounded-full" />
                                            {index < order.activityTimeline.length - 1 && (
                                                <div className="w-0.5 h-12 bg-gray-300 dark:bg-gray-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.time}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{activity.event}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="delivery" className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Courier Name</p>
                                    <p className="text-base font-semibold text-gray-900 dark:text-white">{order.courierName}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Courier Phone</p>
                                    <p className="text-base font-semibold text-gray-900 dark:text-white">{order.courierPhone}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vehicle Type</p>
                                    <p className="text-base font-semibold text-gray-900 dark:text-white">{order.vehicleType}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Plate Number</p>
                                    <p className="text-base font-semibold text-gray-900 dark:text-white">{order.plateNumber}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pickup Location</p>
                                    <p className="text-base font-semibold text-gray-900 dark:text-white">{order.pickupLocation}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tracking Status</p>
                                    <p className="text-base font-semibold text-gray-900 dark:text-white">{order.trackingStatus}</p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center p-6 border-t bg-gray-50 dark:bg-gray-800">
                    <Button
                        variant="outline"
                        className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300"
                    >
                        Transfer Order
                    </Button>
                    <Button
                        variant="outline"
                        className="bg-red-100 text-red-700 hover:bg-red-200 border-red-300"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}