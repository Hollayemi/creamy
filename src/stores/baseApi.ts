import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQueryWithReauth } from "./api/baseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Departments",
    "Requests",
    "Approvals",
    "Procurement",
    "Finance",
    "Documents",
    "Reports",
    "Users",
    "Notifications",
    "Dashboard",
    "Vendors",
    "PurchaseOrders",
    "AuditLogs",
    "Authorization",
  ],
  endpoints: () => ({}),
});
