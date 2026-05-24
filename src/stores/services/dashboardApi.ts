import { baseApi } from "../baseApi";
import type { BaseResponse } from "../api/types";
// import {
//     DashboardOverview,
//     DashboardStats,
//     RevenueChartData,
//     RecentOrdersResponse,
//     TopProductsResponse,
//     TopCustomersResponse,
//     RegionalPerformanceResponse,
// } from "@/types/dashboard";

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Complete dashboard overview (all data in one call)
        getDashboardOverview: builder.query<BaseResponse<any>, void>({
            query: () => ({
                url: "/dashboard/overview",
                method: "GET",
            }),
            providesTags: ["DashboardOverview"],
        }),

        // Granular endpoints for lazy loading
        getDashboardStats: builder.query<BaseResponse<any>, void>({
            query: () => ({
                url: "/dashboard/stats",
                method: "GET",
            }),
            providesTags: ["DashboardStats"],
        }),

        getRevenueChart: builder.query<BaseResponse<any>, { period?: 'daily' | 'weekly' | 'monthly' | 'yearly' }>({
            query: (params) => ({
                url: "/dashboard/revenue-chart",
                method: "GET",
                params,
            }),
            providesTags: ["RevenueChart"],
        }),

        getRecentOrders: builder.query<BaseResponse<any>, { limit?: number; status?: string }>({
            query: (params) => ({
                url: "/dashboard/recent-orders",
                method: "GET",
                params,
            }),
            providesTags: ["RecentOrders"],
        }),

        getTopProducts: builder.query<BaseResponse<any>, { limit?: number; period?: string }>({
            query: (params) => ({
                url: "/dashboard/top-products",
                method: "GET",
                params,
            }),
            providesTags: ["TopProducts"],
        }),

        getTopCustomers: builder.query<BaseResponse<any>, { limit?: number; period?: string }>({
            query: (params) => ({
                url: "/dashboard/top-customers",
                method: "GET",
                params,
            }),
            providesTags: ["TopCustomers"],
        }),

        getRegionalPerformance: builder.query<BaseResponse<any>, { region?: string; period?: string }>({
            query: (params) => ({
                url: "/dashboard/regional-performance",
                method: "GET",
                params,
            }),
            providesTags: ["RegionalPerformance"],
        }),
    }),
});

// Export all hooks
export const {
    useGetDashboardOverviewQuery,
    useGetDashboardStatsQuery,
    useGetRevenueChartQuery,
    useGetRecentOrdersQuery,
    useGetTopProductsQuery,
    useGetTopCustomersQuery,
    useGetRegionalPerformanceQuery,
} = dashboardApi;