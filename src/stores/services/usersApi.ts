import { BaseResponse } from "../api/types";
import { baseApi } from "../baseApi";
import type { User, UserRole } from "../types";
import { CreateUserInput, UpdateUserInput } from "./types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], { role?: UserRole; department?: string; isActive?: boolean }>({
      query: (params) => ({
        url: "/users",
        params,
      }),
      providesTags: [{ type: "Users", id: "LIST" }],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => ({ url: `/users/${id}` }),
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    createUser: builder.mutation<BaseResponse<User>, FormData>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        data: body,
        isFormData: true,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    updateUser: builder.mutation<User, UpdateUserInput>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    toggleUserStatus: builder.mutation<User, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    // ROLES MANAGEMENT

    getRoles: builder.query<BaseResponse, void>({
      query: () => ({
        url: "/authorization/roles",
        method: "GET",
      }),
      providesTags: [{ type: "Authorization", id: "ROLES" }],
    }),

    createRole: builder.mutation<BaseResponse, { name: string }>({
      query: (body) => ({
        url: "/authorization/roles",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "Authorization", id: "ROLES" }],
    }),

    updateRole: builder.mutation<BaseResponse, { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `/authorization/roles/${id}`,
        method: "PATCH",
        data: { name },
      }),
      invalidatesTags: [{ type: "Authorization", id: "ROLES" }],
    }),

    // PERMISSIONS MANAGEMENT

    getPermissions: builder.query<BaseResponse, void>({
      query: () => ({
        url: "/authorization/permissions",
        method: "GET",
      }),
      providesTags: [{ type: "Authorization", id: "PERMISSIONS" }],
    }),

    createPermission: builder.mutation<BaseResponse, { name: string }>({
      query: (body) => ({
        url: "/authorization/permissions",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "Authorization", id: "PERMISSIONS" }],
    }),

    updatePermission: builder.mutation<BaseResponse, { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `/authorization/permissions/${id}`,
        method: "PATCH",
        data: { name },
      }),
      invalidatesTags: [{ type: "Authorization", id: "PERMISSIONS" }],
    }),

    // ROLE-PERMISSION ASSIGNMENT

    assignPermissions: builder.mutation<BaseResponse, { role_id: number; permissions: number[] }>({
      query: (body) => ({
        url: "/authorization/assign-permissions",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [
        { type: "Authorization", id: "ROLES" },
        { type: "Authorization", id: "PERMISSIONS" },
      ],
    }),

    revokePermissions: builder.mutation<BaseResponse, { role_id: number; permissions: number[] }>({
      query: (body) => ({
        url: "/authorization/revoke-permissions",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [
        { type: "Authorization", id: "ROLES" },
        { type: "Authorization", id: "PERMISSIONS" },
      ],
    }),

    // USER-ROLE ASSIGNMENT

    assignRole: builder.mutation<BaseResponse, { user_id: number; role: number[] }>({
      query: (body) => ({
        url: "/authorization/assign-role",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [
        { type: "Users", id: "LIST" },
        { type: "Authorization", id: "ROLES" },
      ],
    }),

    getUserProfile: builder.query<BaseResponse, void>({
      query: () => ({
        url: "/user-profile",
        method: "GET",
      }),
      providesTags: [{ type: "Users", id: "PROFILE" }],
    }),
  }),
});

export const {
  // Users
  useGetUsersQuery,
  useGetUserProfileQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useToggleUserStatusMutation,

  // Roles
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,

  // Permissions
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,

  // Role-Permission Assignment
  useAssignPermissionsMutation,
  useRevokePermissionsMutation,

  // User-Role Assignment
  useAssignRoleMutation,
} = usersApi;
