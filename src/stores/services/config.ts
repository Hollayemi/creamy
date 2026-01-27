import { baseApi } from "../baseApi";
import type { BaseResponse } from "../api/types";
import { CategoriesRegionResponse } from "@/types/config";

export const configApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<BaseResponse<CategoriesRegionResponse>, any>({
            query: (params) => ({
                url: "/categories",
                method: "GET",
                params: params || undefined,
            }),
        }),

        getRegions: builder.query<BaseResponse<CategoriesRegionResponse>, any>({
            query: (params) => ({
                url: "/regions",
                method: "GET",
                params: params || undefined,
            }),
        }),


    }),
});

export const {
    useGetCategoriesQuery,
    useGetRegionsQuery,
} = configApi;