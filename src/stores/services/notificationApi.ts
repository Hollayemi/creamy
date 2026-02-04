import { baseApi } from "../baseApi";
import type { BaseResponse } from "../api/types";

// Types
export interface PushNotification {
  _id: string;
  title: string;
  message: string;
  
  // Targeting
  targetAudience: "all" | "customers" | "drivers" | "specific";
  specificUserIds?: string[];
  specificDriverIds?: string[];
  
  // Filters
  filters?: {
    region?: string[];
    city?: string[];
    userStatus?: ("active" | "inactive")[];
    orderHistory?: "has-ordered" | "never-ordered" | "frequent-buyers";
  };
  
  // Delivery
  scheduleType: "immediate" | "scheduled";
  scheduledAt?: string;
  
  // Content
  image?: string;
  deepLink?: string; // e.g., /products/123, /orders/456
  actionButton?: {
    text: string;
    link: string;
  };
  
  // Status
  status: "draft" | "scheduled" | "sent" | "failed";
  
  // Analytics
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  clickedCount: number;
  failedCount: number;
  
  // Metadata
  createdBy: string;
  createdByName: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationInput {
  title: string;
  message: string;
  targetAudience: "all" | "customers" | "drivers" | "specific";
  specificUserIds?: string[];
  specificDriverIds?: string[];
  filters?: {
    region?: string[];
    city?: string[];
    userStatus?: ("active" | "inactive")[];
    orderHistory?: "has-ordered" | "never-ordered" | "frequent-buyers";
  };
  scheduleType: "immediate" | "scheduled";
  scheduledAt?: string;
  image?: string;
  deepLink?: string;
  actionButton?: {
    text: string;
    link: string;
  };
}

export interface NotificationStats {
  totalSent: number;
  totalDelivered: number;
  totalClicked: number;
  totalFailed: number;
  clickRate: number;
  deliveryRate: number;
}

// API Endpoints
export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all notifications
    getAllNotifications: builder.query<
      BaseResponse<PushNotification[]>,
      { status?: string; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/push-notifications",
        method: "GET",
        params,
      }),
      providesTags: ["PushNotifications"],
    }),

    // Get notification by ID
    getNotificationById: builder.query<BaseResponse<PushNotification>, string>({
      query: (id) => ({
        url: `/push-notifications/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "PushNotifications", id }],
    }),

    // Create notification (draft or send)
    createNotification: builder.mutation<
      BaseResponse<PushNotification>,
      FormData
    >({
      query: (formData) => ({
        url: "/push-notifications",
        method: "POST",
        data: formData,
        isFormData: true,
      }),
      invalidatesTags: ["PushNotifications"],
    }),

    // Update notification (only drafts)
    updateNotification: builder.mutation<
      BaseResponse<PushNotification>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/push-notifications/${id}`,
        method: "PUT",
        data: formData,
        isFormData: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PushNotifications", id },
        "PushNotifications",
      ],
    }),

    // Send notification (drafts or scheduled)
    sendNotification: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/push-notifications/${id}/send`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "PushNotifications", id },
        "PushNotifications",
      ],
    }),

    // Delete notification (only drafts)
    deleteNotification: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/push-notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PushNotifications"],
    }),

    // Get notification statistics
    getNotificationStats: builder.query<BaseResponse<NotificationStats>, void>({
      query: () => ({
        url: "/push-notifications/stats",
        method: "GET",
      }),
      providesTags: ["NotificationStats"],
    }),

    // Test notification (send to admin only)
    testNotification: builder.mutation<
      BaseResponse,
      CreateNotificationInput
    >({
      query: (data) => ({
        url: "/push-notifications/test",
        method: "POST",
        data,
      }),
    }),

    // Get recipient count estimate
    getRecipientCount: builder.mutation<
      BaseResponse<{ count: number; users: string[] }>,
      Partial<CreateNotificationInput>
    >({
      query: (data) => ({
        url: "/push-notifications/estimate-recipients",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useGetNotificationByIdQuery,
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useSendNotificationMutation,
  useDeleteNotificationMutation,
  useGetNotificationStatsQuery,
  useTestNotificationMutation,
  useGetRecipientCountMutation,
} = notificationApi;
