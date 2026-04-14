"use client";
import { useUserProfile } from "@/hooks/use-user-profile";
import React from "react";

const Welcome = () => {
  const { profile, isLoading } = useUserProfile();
  return (
    <div className="flex items-center gap-4">
      <div>
        <p className="text-foreground text-base !font-bold">Good Morning, {profile?.fullName} 👋</p>
        <p className="text-muted-foreground text-xs">Here&apos;s what&apos;s happening with your store today</p>
      </div>
    </div>
  );
};

export default Welcome;
