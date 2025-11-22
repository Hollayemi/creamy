import { baseApi } from "../baseApi";
import type { DashboardStats } from "../types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, { period?: "week" | "month" | "year" }>({
      query: (params) => ({
        url: "/dashboard/stats",
        params,
      }),
      providesTags: ["Dashboard"],
    }),

    getRecentActivity: builder.query<any[], { limit?: number }>({
      query: (params) => ({
        url: "/dashboard/recent-activity",
        params,
      }),
      providesTags: ["Dashboard"],
    }),

    getMyDashboard: builder.query<any, void>({
      query: () => ({ url: "/dashboard/my-dashboard" }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetRecentActivityQuery, useGetMyDashboardQuery } = dashboardApi;
