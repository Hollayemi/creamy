import { baseApi } from "../baseApi";
import type { BaseResponse } from "../api/types";

export interface PurchaseHistoryItem {
  orderId: string;
  date: string;
  items: number;
  amount: number;
  status: string;
}

export interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  cancelledOrders: number;
}

export interface Customer {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  dateJoined: string;
  lastActivity: string;
  status: string;
  badges: string[];
  avatar: string;
  avatarColor: string;
  purchaseHistory: PurchaseHistoryItem[];
  customerActivity: CustomerActivity[];
  loyaltyProgress: LoyaltyProgress[];
  totalLoyaltyPoints: number;
  stats: CustomerStats;
}

export interface CustomerActivity {
  id: string;
  date: string;
  activity: string;
  details: string;
  status: string;
}

export interface LoyaltyProgress {
  id: string;
  rawDate: Date;
  date: string;
  event: string;
  points: number;
}

export interface CustomerStat {
  label: string;
  value: string;
  color: "purple" | "orange" | "cyan" | "red" | "blue";
}

export interface CustomersListResponse {
  success: boolean;
  data: {
    customers: Customer[];
    stats: CustomerStat[];
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
  message: string;
}

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "inactive";
  badge?: "all" | "frequent_buyer" | "new_user";
  dateFrom?: string;
  dateTo?: string;
}

// API Endpoints
export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<CustomersListResponse, GetCustomersParams | void>({
      query: (params) => ({
        url: "/admin/customers",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.customers.map(({ id }) => ({ type: "Customers" as const, id })),
              { type: "Customers", id: "LIST" },
            ]
          : [{ type: "Customers", id: "LIST" }],
    }),

    getCustomerById: builder.query<BaseResponse<Customer>, string>({
      query: (id) => ({
        url: `/admin/customers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Customers", id }],
    }),

    getCustomerStats: builder.query<CustomerStat[], void>({
      query: () => ({
        url: "/admin/customers/stats",
        method: "GET",
      }),
      providesTags: [{ type: "Customers", id: "STATS" }],
    }),
  }),
});

export const { useGetCustomersQuery, useGetCustomerByIdQuery, useGetCustomerStatsQuery } = customerApi;
