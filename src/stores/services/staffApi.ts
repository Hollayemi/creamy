import { baseApi } from "../baseApi";
import type { BaseResponse } from "../api/types";
import { CategoriesRegionResponse } from "@/types/config";

// Types
export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  _id: string;
  name: string;
  displayName: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}



export interface Staff {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  roleName?: string;
  meta?: Record<string, any>;
  region?: CategoriesRegionResponse;
  branch?: string;
  status: "active" | "suspended" | "disabled" | "running";
  joinedDate: string;
  lastLogin?: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  _id: string;
  userId: string;
  userName: string;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}

export interface LogsResponse {
  logs: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateStaffInput {
  fullName: string;
  email: string;
  password: string;
  role: string;
  region?: string;
  branch?: string;
  phone?: string;
  permissions?: string[];
}

export interface UpdateStaffInput {
  fullName?: string;
  email?: string;
  role?: string;
  region?: string;
  branch?: string;
  phone?: string;
  permissions?: string[];
}

export interface SuspendAccountInput {
  reason: string;
  duration?: number; // in days
  notifyUser?: boolean;
}

export interface DisableAccountInput {
  reason: string;
  notifyUser?: boolean;
}

export interface StaffsResponse {
  staffList: Staff[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Endpoints
export const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ============ STAFF/USERS ============
    getAllStaff: builder.query<
      BaseResponse<StaffsResponse>,
      { status?: string; role?: string; search?: string; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/staff",
        method: "GET",
        params,
      }),
      providesTags: ["Staff"],
    }),

    getStaffById: builder.query<BaseResponse<Staff>, string>({
      query: (id) => ({
        url: `/staff/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Staff", id }],
    }),

    createStaff: builder.mutation<BaseResponse<Staff>, CreateStaffInput>({
      query: (data) => ({
        url: "/staff",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Staff", "ActivityLogs"],
    }),

    updateStaff: builder.mutation<BaseResponse<Staff>, { id: string; data: UpdateStaffInput }>({
      query: ({ id, data }) => ({
        url: `/staff/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Staff", id }, "Staff", "ActivityLogs"],
    }),

    deleteStaff: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/staff/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Staff", "ActivityLogs"],
    }),

    // ============ ACCOUNT ACTIONS ============
    suspendAccount: builder.mutation<
      BaseResponse,
      { id: string; data: SuspendAccountInput }
    >({
      query: ({ id, data }) => ({
        url: `/staff/${id}/suspend`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Staff", id }, "Staff", "ActivityLogs"],
    }),

    unsuspendAccount: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/staff/${id}/unsuspend`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Staff", id }, "Staff", "ActivityLogs"],
    }),

    disableAccount: builder.mutation<
      BaseResponse,
      { id: string; data: DisableAccountInput }
    >({
      query: ({ id, data }) => ({
        url: `/staff/${id}/disable`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Staff", id }, "Staff", "ActivityLogs"],
    }),

    enableAccount: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/staff/${id}/enable`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Staff", id }, "Staff", "ActivityLogs"],
    }),

    resetPassword: builder.mutation<BaseResponse, { id: string; notifyUser?: boolean }>({
      query: ({ id, notifyUser }) => ({
        url: `/staff/${id}/reset-password`,
        method: "POST",
        data: { notifyUser },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Staff", id }, "ActivityLogs"],
    }),

    // ============ ROLES & PERMISSIONS ============
    getRoles: builder.query<BaseResponse<Role[]>, void>({
      query: () => ({
        url: "/roles",
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

    getRoleById: builder.query<BaseResponse<Role>, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Roles", id }],
    }),

    getPermissions: builder.query<BaseResponse<Permission[]>, { roleId?: string }>({
      query: ({ roleId }) => ({
        url: `/roles/${roleId}/permissions`,
        method: "GET",
      }),
      providesTags: ["Permissions"],
    }),

    updateStaffRole: builder.mutation<
      BaseResponse<Staff>,
      { id: string; roleId: string; permissions?: string[] }
    >({
      query: ({ id, roleId, permissions }) => ({
        url: `/staff/${id}/role`,
        method: "PUT",
        data: { roleId, permissions },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Staff", id }, "Staff", "ActivityLogs"],
    }),

    // ============ ACTIVITY LOGS ============
    getActivityLogs: builder.query<
      BaseResponse<ActivityLog[]>,
      { userId?: string; action?: string; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/activity-logs",
        method: "GET",
        params,
      }),
      providesTags: ["ActivityLogs"],
    }),

    getUserActivityLogs: builder.query<BaseResponse<LogsResponse>, string>({
      query: (userId) => ({
        url: `/staff/${userId}/activity-logs`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [{ type: "ActivityLogs", id: userId }],
    }),

    // ============ BULK OPERATIONS ============
    bulkSuspendStaff: builder.mutation<BaseResponse, { ids: string[]; reason: string }>({
      query: (data) => ({
        url: "/staff/bulk/suspend",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Staff", "ActivityLogs"],
    }),

    bulkDeleteStaff: builder.mutation<BaseResponse, string[]>({
      query: (ids) => ({
        url: "/staff/bulk/delete",
        method: "DELETE",
        data: { ids },
      }),
      invalidatesTags: ["Staff", "ActivityLogs"],
    }),

    // ============ EXPORT ============
    exportStaff: builder.mutation<Blob, { format: "csv" | "excel"; filters?: any }>({
      query: ({ format, filters }) => ({
        url: `/staff/export/${format}`,
        method: "POST",
        data: filters,
        responseType: "blob",
      }),
    }),
  }),
});

export const {
  // Staff CRUD
  useGetAllStaffQuery,
  useGetStaffByIdQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,

  // Account Actions
  useSuspendAccountMutation,
  useUnsuspendAccountMutation,
  useDisableAccountMutation,
  useEnableAccountMutation,
  useResetPasswordMutation,

  // Roles & Permissions
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useGetPermissionsQuery,
  useUpdateStaffRoleMutation,

  // Activity Logs
  useGetActivityLogsQuery,
  useGetUserActivityLogsQuery,

  // Bulk Operations
  useBulkSuspendStaffMutation,
  useBulkDeleteStaffMutation,

  // Export
  useExportStaffMutation,
} = staffApi;
