import { baseApi } from "../baseApi";
import type { BaseResponse } from "../api/types";
import {
    CouponsListResponse,
    Coupon,
    GetCouponsParams,
    CreateCouponInput,
    UpdateCouponInput,
    UpdateCouponStatusInput,
    ToggleStatusResponse,
    SingleCouponResponse
} from "@/types/promotion";

export const promotionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCoupons: builder.query<BaseResponse<CouponsListResponse>, GetCouponsParams | undefined>({
            query: (params) => ({
                url: "/admin/coupons",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...(result.data?.coupons?.map(({ _id }) => ({
                            type: "Coupons" as const,
                            id: _id
                        })) ?? []),
                        { type: "Coupons", id: "LIST" },
                        { type: "Coupons", id: "STATS" },
                    ]
                    : [
                        { type: "Coupons", id: "LIST" },
                        { type: "Coupons", id: "STATS" },
                    ],
        }),

        getCoupon: builder.query<BaseResponse<SingleCouponResponse>, string>({
            query: (id) => ({
                url: `/admin/coupons/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Coupons", id }],
        }),

        createCoupon: builder.mutation<BaseResponse<Coupon>, CreateCouponInput>({
            query: (data) => ({
                url: "/admin/coupons",
                method: "POST",
                data,
            }),
            invalidatesTags: [
                { type: "Coupons", id: "LIST" },
                { type: "Coupons", id: "STATS" }
            ],
        }),

        updateCoupon: builder.mutation<BaseResponse<Coupon>, UpdateCouponInput>({
            query: ({ _id, ...data }) => ({
                url: `/admin/coupons/${_id}`,
                method: "PUT",
                data,
            }),
            invalidatesTags: (result, error, { _id }) => [
                { type: "Coupons", id: _id },
                { type: "Coupons", id: "LIST" },
                { type: "Coupons", id: "STATS" },
            ],
        }),

        // bulkUpdateCoupons: builder.mutation<BaseResponse, BulkUpdateCouponInput>({
        //     query: (data) => ({
        //         url: "/admin/coupons/bulk-update",
        //         method: "PATCH",
        //         data,
        //     }),
        //     invalidatesTags: (result, error, { ids }) => [
        //         ...ids.map(id => ({ type: "Coupons", id })),
        //         { type: "Coupons", id: "LIST" },
        //         { type: "Coupons", id: "STATS" },
        //     ],
        // }),

        deleteCoupon: builder.mutation<BaseResponse, string>({
            query: (id) => ({
                url: `/admin/coupons/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [
                { type: "Coupons", id: "LIST" },
                { type: "Coupons", id: "STATS" }
            ],
        }),

        toggleCouponStatus: builder.mutation<BaseResponse<ToggleStatusResponse>, string>({
            query: (id) => ({
                url: `/admin/coupons/${id}/toggle-status`,
                method: "PATCH",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Coupons", id },
                { type: "Coupons", id: "LIST" },
                { type: "Coupons", id: "STATS" },
            ],
        }),

        changeCouponStatus: builder.mutation<BaseResponse<Coupon>, { id: string; data: UpdateCouponStatusInput }>({
            query: ({ id, data }) => ({
                url: `/admin/coupons/${id}/status`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Coupons", id },
                { type: "Coupons", id: "LIST" },
                { type: "Coupons", id: "STATS" },
            ],
        }),
    }),
});

export const {
    useGetCouponsQuery,
    useGetCouponQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useToggleCouponStatusMutation,
    useChangeCouponStatusMutation,
} = promotionApi;