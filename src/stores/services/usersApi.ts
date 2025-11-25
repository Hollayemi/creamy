import { BaseResponse, User } from "../api/types";
import { baseApi } from "../baseApi";
import { UserInfo, CreateUserInput, GetUsersParams, UpdateUserInput, UsersListResponse } from "./types";


export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /users - List all users with pagination
    getUsers: builder.query<UsersListResponse, GetUsersParams | void>({
      query: (params?: GetUsersParams) => ({
        url: "/users",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.data.data.map(({ id }) => ({ type: "Users" as const, id })),
            { type: "Users", id: "LIST" },
          ]
          : [{ type: "Users", id: "LIST" }],
    }),

    // GET /users/:id - Get single user by ID
    getUserById: builder.query<BaseResponse<UserInfo>, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    // POST /users - Create new user
    createUser: builder.mutation<BaseResponse<UserInfo>, CreateUserInput>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    // PATCH /users/:id - Update existing user
    updateUser: builder.mutation<BaseResponse<UserInfo>, { id: number; data: UpdateUserInput }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    // DELETE /users/:id - Delete user (soft delete)
    deleteUser: builder.mutation<BaseResponse, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    // PATCH /users/:id/status - Toggle user active status
    toggleUserStatus: builder.mutation<BaseResponse<UserInfo>, { id: number; status: "Active" | "Inactive" }>({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
        data: { status },
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



    getUserProfile: builder.query<User, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: [{ type: "Users", id: "PROFILE" }],
    }),

  }),
});

export const {
  // Users CRUD
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  useGetUserProfileQuery,

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