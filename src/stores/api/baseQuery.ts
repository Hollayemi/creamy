"use client";

import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export type RequestConfig = {
  url: string;
  method?: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  skipSuccessToast?: boolean;
  isFormData?: boolean;
  sendToken?: boolean;
};

type BaseError = { status: number; data?: any; message?: string };

// Get token from localStorage
const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

// Set token to localStorage
export const setAccessToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

// Clear auth data
export const clearAuthData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
};

// Build URL with params
const buildUrl = (urlPath: string, params?: Record<string, any>) => {
  const url = new URL(`${BASE_URL}${urlPath}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        url.searchParams.append(k, String(v));
      }
    });
  }
  return url.toString();
};

export const fetchBaseQueryWithReauth: BaseQueryFn<RequestConfig, unknown, BaseError> = async (args) => {
  const {
    url,
    method = "GET",
    data,
    params,
    headers = {},
    skipSuccessToast = false,
    isFormData = false,
    sendToken = true,
  } = args;

  const makeRequest = async (token?: string) => {
    const fullUrl = buildUrl(url, params);

    // Build headers - DON'T set headers for FormData, let browser do it
    const mergedHeaders: HeadersInit = isFormData
      ? {
          ...headers,
          ...(token && sendToken ? { Authorization: `Bearer ${token}` } : {}),
        }
      : {
          "Content-Type": "application/json",
          ...headers,
          ...(token && sendToken ? { Authorization: `Bearer ${token}` } : {}),
        };

    const options: RequestInit = {
      method,
      headers: mergedHeaders,
      credentials: "include",
    };

    if (method !== "GET" && method !== "HEAD" && data !== undefined) {
      options.body = isFormData ? data : JSON.stringify(data);
    }

    console.log("🚀 API Request:", {
      url: fullUrl,
      method,
      headers: mergedHeaders,
      hasBody: !!options.body,
    });

    try {
      const response = await fetch(fullUrl, options);

      console.log("📥 API Response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      // Parse response
      const contentType = response.headers.get("content-type");
      let responseData: any;

      if (contentType?.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      return { response, responseData };
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      throw error;
    }
  };

  try {
    const token = getAccessToken() || undefined;
    const { response, responseData } = await makeRequest(token);

    // Handle successful response

    if (response.ok) {
      const body = responseData as any;

      // Show success toast if applicable
      if (!skipSuccessToast && body?.success && body?.message && body.message !== "success") {
        toast.success(body.message, {
          position: "top-right",
        });
      }

      return { data: responseData };
    }

    // Handle error responses
    const errorBody = responseData as any;
    const errorMessage = errorBody?.message || response.statusText || "Request failed";

    console.error("❌ API Error:", {
      status: response.status,
      message: errorMessage,
      body: errorBody,
    });

    // Show error toast
    toast.error(errorMessage, {
      position: "top-right",
    });

    // If 401, clear auth data and redirect to login
    if (response.status === 401) {
      clearAuthData();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }

    return {
      error: {
        status: response.status,
        data: errorBody,
        message: errorMessage,
      },
    };
  } catch (err: any) {
    console.error("💥 Network Error:", err);

    // Show network error toast
    toast.error(err?.message || "Network error - please check your connection", {
      position: "top-right",
    });

    return {
      error: {
        status: 0,
        data: { message: err?.message || "Network error" },
        message: err?.message || "Network error",
      },
    };
  }
};
