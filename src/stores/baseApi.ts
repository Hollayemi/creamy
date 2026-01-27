import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQueryWithReauth } from "./api/baseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Products",
    "Coupons",
    "Authorization",
  ],
  endpoints: () => ({}),
});
