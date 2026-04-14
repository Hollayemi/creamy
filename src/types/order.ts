// Order Types

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface TimelineItem {
  time: string;
  event: string;
}

export interface Order {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  region: string;
  totalAmount: number;
  items: number;
  status: string; // orderStatus (formatted: Pending | Processing | En-Route | Delivered | Cancelled)
  dateOrdered: string;
  deliveryDate: string;
  courierName: string;
  courierPhone?: string;
  vehicleType?: string;
  plateNumber?: string;
  pickupLocation?: string;
  trackingStatus?: string;
  orderedItems: OrderItem[];
  activityTimeline: TimelineItem[];
}

export interface OrderStats {
  label: string;
  value: string;
  color: "purple" | "orange" | "green" | "red" | "blue";
}

export interface OrderPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface OrdersListResponse {
  success: boolean;
  data: {
    orders: Order[];
    stats: OrderStats[];
    pagination: OrderPagination;
  };
  message: string;
}

// export interface SingleOrderResponse {
//   success: boolean;
//   data: {
//     order: Order;
//   };
//   message: string;
// }

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  search?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  region?: string;
}

export interface CancelOrderInput {
  reason: string;
  note: string;
  password: string;
}

export interface UpdateOrderStatusInput {
  status: string;
  note?: string;
}

export interface TransferOrderInput {
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
}
