"use client";

import { useGetUserProfileQuery } from "@/stores/services/usersApi";
import { useMemo } from "react";

export function useUserProfile() {
  const { data: profileResponse, isLoading, error, refetch } = useGetUserProfileQuery();

  const profile = useMemo(() => {
    if (!profileResponse?.data) return null;

    const data = profileResponse.data;
    return {
      ...data,
      fullName: `${data.first_name} ${data.last_name}`,
      initials: `${data.first_name[0]}${data.last_name[0]}`.toUpperCase(),
      isEmailVerified: !!data.email_verified_at,
      isActive: data.status === "Active",
    };
  }, [profileResponse]);

  return {
    profile,
    isLoading,
    error,
    refetch,
  };
}
