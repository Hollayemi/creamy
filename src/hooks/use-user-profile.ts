
import { useGetUserProfileQuery } from "@/stores/services/usersApi";
import { useMemo } from "react";

export function useUserProfile() {
  const { data: profileResponse, isLoading, error, refetch } = useGetUserProfileQuery() as any;

  console.log({ profileResponse })

  const profile = useMemo(() => {
    if (!profileResponse?.data?.user?._id) return null;

    const data = profileResponse?.data?.user || {};
    return {
      ...data,
      fullName: `${data?.name}`,
      initials: `${data?.name?.split(" ")?.map((n: any) => n[0])?.join("")}`?.toUpperCase(),
      isPhoneVerified: !!data?.isPhoneVerified,
    };
  }, [profileResponse]);

  return {
    profile,
    isLoading,
    error,
    refetch,
  };
}
