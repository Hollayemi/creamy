import { baseApi } from "../baseApi";
import type { BaseResponse } from "../api/types";
import { Product } from "@/types/product";

// Types
export interface Category {
  _id: string;
  id?: string;
  name: string;
  displayName: string;
  icon: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface Region {
  _id: string;
  name: string;
  displayName: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface DealOfTheDay {
  _id: string;
  productId: string;
  productName?: string;
  percentage: number;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface Advert {
  _id: string;
  title: string;
  description: string;
  image: string;
  targetUrl: string;
  position: "top" | "middle" | "bottom";
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// API Endpoints
export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ============ CATEGORIES ============
    getCategories: builder.query<BaseResponse<Category[]>, void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    createCategory: builder.mutation<BaseResponse<Category>, FormData>({
      query: (formData) => ({
        url: "/categories",
        method: "POST",
        data: formData,
        isFormData: true,
      }),
      invalidatesTags: ["Categories"],
    }),

    updateCategory: builder.mutation<BaseResponse<Category>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        data: formData,
        isFormData: true,
      }),
      invalidatesTags: ["Categories"],
    }),

    deleteCategory: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

    // ============ REGIONS ============
    getRegions: builder.query<BaseResponse<Region[]>, void>({
      query: () => ({
        url: "/regions",
        method: "GET",
      }),
      providesTags: ["Regions"],
    }),

    createRegion: builder.mutation<BaseResponse<Region>, { name: string; displayName: string }>({
      query: (data) => ({
        url: "/regions",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Regions"],
    }),

    updateRegion: builder.mutation<BaseResponse<Region>, { id: string; data: { name: string; displayName: string } }>({
      query: ({ id, data }) => ({
        url: `/regions/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Regions"],
    }),

    deleteRegion: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/regions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Regions"],
    }),

    // ============ DEALS OF THE DAY ============
    getDeals: builder.query<BaseResponse<{ deals: Product[], count: number }>, void>({
      query: () => ({
        url: "/product/deals/deals-of-the-day",
        method: "GET",
      }),
      providesTags: ["Deals"],
    }),

    createDeal: builder.mutation<
      BaseResponse<DealOfTheDay>,
      { productId: string; percentage: number; startDate: string; endDate: string }
    >({
      query: (data) => ({
        url: "/product/deals-of-the-day",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Deals"],
    }),

    updateDeal: builder.mutation<
      BaseResponse<DealOfTheDay>,
      { id: string; data: { productId: string; percentage: number; startDate: string; endDate: string } }
    >({
      query: ({ id, data }) => ({
        url: `/deals/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Deals"],
    }),

    deleteDeal: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/products/${id}/deals`,
        method: "DELETE",
      }),
      invalidatesTags: ["Deals"],
    }),

    // ============ ADVERTS ============
    getAdverts: builder.query<BaseResponse<Advert[]>, void>({
      query: () => ({
        url: "/adverts",
        method: "GET",
      }),
      providesTags: ["Adverts"],
    }),

    createAdvert: builder.mutation<BaseResponse<Advert>, FormData>({
      query: (formData) => ({
        url: "/adverts",
        method: "POST",
        data: formData,
        isFormData: true,
      }),
      invalidatesTags: ["Adverts"],
    }),

    updateAdvert: builder.mutation<BaseResponse<Advert>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/adverts/${id}`,
        method: "PUT",
        data: formData,
        isFormData: true,
      }),
      invalidatesTags: ["Adverts"],
    }),

    deleteAdvert: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/adverts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Adverts"],
    }),
  }),
});

export const {
  // Categories
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  // Regions
  useGetRegionsQuery,
  useCreateRegionMutation,
  useUpdateRegionMutation,
  useDeleteRegionMutation,

  // Deals
  useGetDealsQuery,
  useCreateDealMutation,
  useUpdateDealMutation,
  useDeleteDealMutation,

  // Adverts
  useGetAdvertsQuery,
  useCreateAdvertMutation,
  useUpdateAdvertMutation,
  useDeleteAdvertMutation,
} = settingsApi;