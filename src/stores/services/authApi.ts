import { User } from "../api/types";
import { baseApi } from "../baseApi";
import { ChangePasswordRequest, LoginResponse, ForgotPasswordResponse } from "./types";

// Extended Login Response with OTP support
export interface LoginResponseWithOTP {
  data: {
    user?: User;
    token?: string;
    refreshToken?: string;
    requiresOTP?: boolean;
    phoneNumber?: string;
    message?: string;
    otp?: string; // For development only
  };
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export interface ResendOtpRequest {
  phoneNumber: string;
}

export interface LoginOtpRequest {
  phoneNumber?: string;
  email?: string;
  password?: string; // Required for admin users
}

export interface SendOtpRequest {
  phoneNumber: string;
  residentArea?: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  data: {
    phoneNumber: string;
    message: string;
    otp?: string; // For development only
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Main login endpoint - handles both admin (password) and regular user (OTP) login
    login: builder.mutation<LoginResponseWithOTP, LoginOtpRequest>({
      query: (credentials) => ({
        url: "/staff/login",
        method: "POST",
        data: credentials,
        sendToken: false,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Verify OTP for regular user login
    verifyLoginOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/auth/verify-login-otp",
        method: "POST",
        data: body,
        sendToken: false,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Original OTP endpoints (for phone verification)
    sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
      query: (body) => ({
        url: "/auth/send-otp",
        method: "POST",
        data: body,
        sendToken: false,
      }),
    }),

    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        data: body,
        sendToken: false,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Resend OTP
    resendOtp: builder.mutation<{ success: boolean; message: string }, ResendOtpRequest>({
      query: (body) => ({
        url: "/auth/resend-otp",
        method: "POST",
        data: body,
        sendToken: false,
      }),
    }),

    // Complete user profile
    completeProfile: builder.mutation<{ success: boolean; message: string; data: { user: User } }, {
      name?: string;
      email?: string;
      referredBy?: string
    }>({
      query: (body) => ({
        url: "/auth/complete-profile",
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Update notification settings
    updateNotificationSettings: builder.mutation<{ success: boolean; message: string }, {
      enabled: boolean
    }>({
      query: (body) => ({
        url: "/auth/notifications",
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Update biometric settings
    updateBiometricSettings: builder.mutation<{ success: boolean; message: string }, {
      enabled: boolean
    }>({
      query: (body) => ({
        url: "/auth/biometrics",
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Password management
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
        url: "/staff/one",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    refreshToken: builder.mutation<{
      success: boolean;
      data: {
        token: string;
        refreshToken: string
      }
    }, { refreshToken: string }>({
      query: (body) => ({
        url: "/auth/refresh-token",
        method: "POST",
        data: body,
      }),
    }),

    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "PUT",
        data: body,
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
  useVerifyLoginOtpMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useCompleteProfileMutation,
  useUpdateNotificationSettingsMutation,
  useUpdateBiometricSettingsMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;