"use client";

import { Bell, ChevronDown, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetCurrentUserQuery } from "@/stores/services/authApi";
import { useState } from "react";
import AccountSettingsDialog from "./account-settings-dialog";

function getInitials(name?: string) {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function ProfileCapsule(profile: any) {
  const { data: currentUser } = useGetCurrentUserQuery();

  const [openSettings, setOpenSettings] = useState(false);

  const initials = getInitials(currentUser?.fullName);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center justify-between gap-3 rounded-full border p-px">
            <Avatar className="size-10 rounded-full">
              <AvatarImage src={currentUser?.avatar || ""} alt={currentUser?.fullName} />
              <AvatarFallback className="rounded-full">{initials}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" className="flex justify-between">
              <ChevronDown />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent align="end" className="min-h-80">
          <div className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <h4 className="text-sm leading-none font-medium">Profile</h4>
              <div className="flex justify-center">
                <Avatar className="size-20 rounded-full">
                  <AvatarImage src={currentUser?.avatar || ""} alt={currentUser?.fullName} />
                  <AvatarFallback className="rounded-full">{initials}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col items-center justify-center gap-5 text-center">
                <p className="text-muted-foreground text-lg">{currentUser?.fullName}</p>
              </div>
            </div>

            {/* Role */}
            <div className="rounded-md border p-3">
              <div className="mb-3">
                <p className="text-muted-foreground text-xs">Role</p>
                <p className="text-sm font-medium">{currentUser?.roleName}</p>
              </div>

              <div className="mb-3">
                <p className="text-muted-foreground text-xs">Status</p>
                <p className="text-sm font-medium capitalize">{currentUser?.status}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Joined</p>
                <p className="text-sm font-medium">
                  {currentUser?.joinedDate ? new Date(currentUser.joinedDate).toLocaleDateString() : ""}
                </p>
              </div>
            </div>

            <div
              onClick={() => setOpenSettings(true)}
              className="text-primary mt-3 flex cursor-pointer items-center gap-2 text-sm font-medium hover:underline"
            >
              <Settings className="h-4 w-4" />
              <span>Account Settings</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <AccountSettingsDialog isOpen={openSettings} onClose={() => setOpenSettings(false)} />
    </>
  );
}
