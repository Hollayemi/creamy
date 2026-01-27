"use client";

export const server =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://erp.zojiedatahub.com/api/v1"
    : "https://erp.zojiedatahub.com/api/v1");

let accessTokenCache: string | null = null;
const ACCESS_TOKEN_KEY = "accessToken";

export const getAccessToken = (): string | null => {
  if (accessTokenCache) return accessTokenCache;
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  accessTokenCache = token;
  return token;
};

export const setAccessToken = (token: string | null) => {
  accessTokenCache = token;
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
  else localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const clearAuthData = () => {
  accessTokenCache = null;
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const refreshToken = async (): Promise<string> => {
  const url = `${server}/api/v1/auth/refresh`;
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const body = await res.json();
  if (!body?.accessToken) {
    throw new Error("Invalid refresh response");
  }

  setAccessToken(body.accessToken);
  return body.accessToken;
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const url = `${server}/api/v1/auth/verify`;
    const token = getAccessToken();
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) return false;
    const body = await res.json();
    // Expect { valid: true, user?: {...}, accessToken?: "..." }
    if (body?.accessToken) setAccessToken(body.accessToken);
    return !!body?.valid;
  } catch (err) {
    console.error("isAuthenticated check failed", err);
    return false;
  }
};
