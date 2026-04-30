import { baseApi } from "../baseApi";
import type { BaseResponse } from "../api/types";
import {
  OrdersListResponse,
  Order,
  GetOrdersParams,
  CancelOrderInput,
  UpdateOrderStatusInput,
  TransferOrderInput,
} from "@/types/order";

export interface AssignDriverInput {
  driverId: string;
  distanceKm?: number;
  isPriority?: boolean;
  pickupAddress?: string;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query<OrdersListResponse, GetOrdersParams | undefined>({
      query: (params) => ({
        url: "/admin/orders",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.orders.map(({ orderId }) => ({ type: "Orders" as const, id: orderId })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    getOrderById: builder.query<BaseResponse<Order>, string>({
      query: (orderNumber) => ({
        url: `/admin/orders/${orderNumber}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),

    updateOrderStatus: builder.mutation<BaseResponse<Order>, { orderNumber: string; data: UpdateOrderStatusInput }>({
      query: ({ orderNumber, data }) => ({
        url: `/admin/orders/${orderNumber}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { orderNumber }) => [
        { type: "Orders", id: orderNumber },
        { type: "Orders", id: "LIST" },
      ],
    }),

    transferOrder: builder.mutation<BaseResponse<Order>, { orderNumber: string; data: TransferOrderInput }>({
      query: ({ orderNumber, data }) => ({
        url: `/admin/orders/${orderNumber}/transfer`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { orderNumber }) => [
        { type: "Orders", id: orderNumber },
        { type: "Orders", id: "LIST" },
      ],
    }),

    cancelOrder: builder.mutation<BaseResponse, { orderNumber: string; data: CancelOrderInput }>({
      query: ({ orderNumber, data }) => ({
        url: `/admin/orders/${orderNumber}/cancel`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { orderNumber }) => [
        { type: "Orders", id: orderNumber },
        { type: "Orders", id: "LIST" },
      ],
    }),

    assignDriverToOrder: builder.mutation<
      BaseResponse<{ delivery: any; driver: any; orderStatus: string }>,
      { orderNumber: string; data: AssignDriverInput }
    >({
      query: ({ orderNumber, data }) => ({
        url: `/admin/orders/${orderNumber}/assign-driver`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { orderNumber }) => [
        { type: "Orders", id: orderNumber },
        { type: "Orders", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useUpdateOrderStatusMutation,
  useTransferOrderMutation,
  useAssignDriverToOrderMutation,
} = orderApi;
