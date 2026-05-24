import { baseApi } from "../baseApi";
import type { BaseResponse } from "../api/types";
import {
    CouponsListResponse,
    GetCouponsParams,
    SingleCouponResponse,
} from "@/types/promotion";
import { PaymentMethod } from "@/types/payment";

export const promotionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPaymentMethods: builder.query<BaseResponse<PaymentMethod[]>, void>({
            query: () => ({
                url: "/payment",
                method: "GET",
            }),
            providesTags: ["PaymentMethods"],
        }),

        togglePayment: builder.mutation<BaseResponse<SingleCouponResponse>, string>({
            query: (id) => ({
                url: `/payment/${id}/toggle`,
                method: "PATCH",
            }),
           invalidatesTags: ["PaymentMethods"],
        }),
    }),
});

export const {
    useGetAllPaymentMethodsQuery,
    useTogglePaymentMutation,
} = promotionApi;
