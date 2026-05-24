import { baseApi } from "../baseApi";
import type { BaseResponse } from "../api/types";
import {
    Plan,
    CreatePlanPayload,
    UpdatePlanPayload,
    PaginatePlans,
} from "@/types/payment";

export const subscriptionPlanApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Subscriptions
        // getAllSubscriptions: builder.query<BaseResponse<GetAllSubscriptionsResponse>, void>({
        //     query: () => ({
        //         url: "/subscription-plans/subscriptions",
        //         method: "GET",
        //     }),
        //     providesTags: ["Subscriptions"],
        // }),

        // Plans
        getAllPlans: builder.query<BaseResponse<PaginatePlans<Plan[]>>, {search: string; page: number; limit: number;}>({
            query: () => ({
                url: "/admin/subscription-plans/",
                method: "GET",
            }),
            providesTags: ["Plans"],
        }),

        getPlan: builder.query<BaseResponse<Plan>, string>({
            query: (id) => ({
                url: `/admin/subscription-plans/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Plans", id }],
        }),

        createPlan: builder.mutation<BaseResponse<Plan>, CreatePlanPayload>({
            query: (data) => ({
                url: "/admin/subscription-plans/",
                method: "POST",
                data,
            }),
            invalidatesTags: ["Plans"],
        }),

        updatePlan: builder.mutation<BaseResponse<Plan>, { id: string; data: UpdatePlanPayload }>({
            query: ({ id, data }) => ({
                url: `/admin/subscription-plans/${id}`,
                method: "PUT",
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Plans", id }, "Plans"],
        }),

        togglePlan: builder.mutation<BaseResponse<Plan>, string>({
            query: (id) => ({
                url: `/admin/subscription-plans/${id}/toggle`,
                method: "PATCH",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Plans", id }, "Plans"],
        }),

        deletePlan: builder.mutation<BaseResponse<null>, string>({
            query: (id) => ({
                url: `/admin/subscription-plans/plans/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Plans", id }, "Plans"],
        }),
    }),
});

// Export hooks
export const {
    // useGetAllSubscriptionsQuery,
    useGetAllPlansQuery,
    useGetPlanQuery,
    useCreatePlanMutation,
    useUpdatePlanMutation,
    useTogglePlanMutation,
    useDeletePlanMutation,
} = subscriptionPlanApi;