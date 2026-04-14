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

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /admin/orders — paginated list + stats
    getAllOrders: builder.query<OrdersListResponse, GetOrdersParams | undefined>({
      query: (params) => ({
        url: "/admin/orders",
        method: "GET",
        params: params || undefined,
      }),
      //   providesTags: [{ type: "Orders", id: "LIST" }],
      // }),

      providesTags: (result) =>
        result
          ? [
              ...result.data.orders.map(({ orderId }) => ({ type: "Orders" as const, id: orderId })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    // GET /admin/orders/:orderNumber — single order detail
    getOrderById: builder.query<BaseResponse<Order>, string>({
      query: (orderNumber) => ({
        url: `/admin/orders/${orderNumber}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),

    // PATCH /admin/orders/:orderNumber/status
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

    // PATCH /admin/orders/:orderNumber/transfer
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

    // PATCH /admin/orders/:orderNumber/cancel
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
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useUpdateOrderStatusMutation,
  useTransferOrderMutation,
} = orderApi;
