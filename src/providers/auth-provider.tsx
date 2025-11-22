"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken } from "@/stores/api/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();

    // Protected routes that require authentication
    const isProtectedRoute = pathname.startsWith("/dashboard");

    // Auth routes that should redirect if already logged in
    const isAuthRoute = pathname.startsWith("/auth/login") || pathname === "/auth/register";

    if (isProtectedRoute && !token) {
      // Save the attempted URL for redirect after login
      sessionStorage.setItem("redirectAfterLogin", pathname);
      router.push("/auth/login");
    } else if (isAuthRoute && token) {
      // If user is already logged in and trying to access login, redirect to dashboard
      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/dashboard";
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
    }
  }, [pathname, router]);

  return <>{children}</>;
}
