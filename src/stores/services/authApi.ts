import { baseApi } from "../baseApi";
import type { User } from "../types";
import { ChangePasswordRequest, LoginRequest, LoginResponse, ForgotPasswordResponse } from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, FormData>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
        isFormData: true,
        sendToken: false,
      }),
      invalidatesTags: ["Auth"],
    }),

    forgotPassword: builder.mutation<ForgotPasswordResponse, { email: string }>({
      query: (body) => ({
        url: "/auth/password/forgot",
        method: "POST",
        data: body,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    refreshToken: builder.mutation<{ token: string }, { refreshToken: string }>({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
    }),

    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "PUT",
        body,
      }),
    }),

    resetPassword: builder.mutation<LoginResponse, FormData>({
      query: (credentials) => ({
        url: "/auth/password/reset",
        method: "POST",
        data: credentials,
        isFormData: true,
        sendToken: false,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
