"use client";

import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export const server =
  process.env.NODE_ENV === "production" ? "https://" : "http://localhost:5001";

export interface RequestConfig {
  url: string;
  method?: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  actor?: string;
  skipSuccessToast?: boolean;
}

const getAuthHeaders = (by: string = "user") => {
  if (typeof window === "undefined") {
    return {
      "Content-Type": "application/json",
    };
  }

  const token = localStorage.getItem("accessToken") || "";

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const showSuccessToast = (data: any) => {
  const { type, message } = data || {};
  if (type === "success" && message && message !== "success") {
    toast.success(message);
  }
};

export const axiosBaseQuery = (
  { baseUrl }: { baseUrl: string } = { baseUrl: "" },
): BaseQueryFn<RequestConfig, unknown, { status: number; data: any; message?: string }> => {
  return async (requestConfig) => {
    const { url, method = "GET", data, params, headers = {}, actor = "user", skipSuccessToast = false } = requestConfig;

    try {
      const authHeaders = getAuthHeaders(actor);
      const mergedHeaders = { ...authHeaders, ...headers };

      const fullUrl = new URL(`${server}/api/v1${url}`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            fullUrl.searchParams.append(key, String(value));
          }
        });
      }

      const fetchOptions: RequestInit = {
        method,
        headers: mergedHeaders,
        credentials: "include",
      };

      if (method !== "GET" && method !== "HEAD" && data) {
        fetchOptions.body = JSON.stringify(data);
      }

      const response = await fetch(fullUrl.toString(), fetchOptions);

      let responseData: any;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        return {
          error: {
            status: response.status,
            data: responseData,
            message: response.statusText,
          },
        };
      }

      if (!skipSuccessToast) {
        showSuccessToast(responseData);
      }

      return { data: responseData };
    } catch (error: any) {
      console.error("Request failed:", error);

      toast.error(error?.message || "Network error - please check your connection");

      return {
        error: {
          status: error?.status || 0,
          data: error?.data || { message: error?.message || "Network error" },
          message: error?.message || "Network error",
        },
      };
    }
  };
};

interface TokenStatus {
  isValid: boolean;
  needsRefresh: boolean;
}

const checkTokenStatus = (): TokenStatus => {
  if (typeof window === "undefined") {
    return { isValid: false, needsRefresh: false };
  }

  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return { isValid: false, needsRefresh: false };

    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const bufferTime = 5 * 60;

    if (typeof decodedToken.exp === "number") {
      const isValid = decodedToken.exp > currentTime;
      const needsRefresh = decodedToken.exp < currentTime + bufferTime;
      return { isValid, needsRefresh };
    }

    return { isValid: false, needsRefresh: false };
  } catch (error) {
    console.error("Token validation error:", error);
    return { isValid: false, needsRefresh: false };
  }
};

export const isAuthenticated = (): boolean => {
  const { isValid } = checkTokenStatus();
  return isValid;
};

export const needsTokenRefresh = (): boolean => {
  const { needsRefresh } = checkTokenStatus();
  return needsRefresh;
};

export const clearAuthData = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
};
