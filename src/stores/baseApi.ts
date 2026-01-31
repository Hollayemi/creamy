import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQueryWithReauth } from "./api/baseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Users",
    "Products",
    "Coupons",
    "Authorization",
    "Categories",
    "Regions",
    "Deals",
    "Adverts",
    "Staff",
        "Roles",
        "Permissions",
        "ActivityLogs",
  ],
  endpoints: () => ({}),
});
