"use client";

import { Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetCurrentUserQuery } from "@/stores/services/authApi";

interface Profile {
  fullName: string;
  initials: "AD"
}

export function ProfileCapsule(profile: any) {
 const { data: currentUser } = useGetCurrentUserQuery()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-between gap-3 border rounded-full p-px">
          <Avatar className="size-8 rounded-full">
            <AvatarImage src="" alt={profile?.fullName} />
            <AvatarFallback className="rounded-full">{profile?.initials}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="sm" className="flex justify-between ">
            <ChevronDown />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="min-h-80">
        <div className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <h4 className="text-sm leading-none font-medium">Profile</h4>
            <p className="text-muted-foreground text-xs">{currentUser?.fullname}</p>
          </div>
          {/* <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Mode</Label>
              <ToggleGroup
                className="w-full"
                size="sm"
                variant="outline"
                type="single"
                value={themeMode}
                onValueChange={(value) => handleValueChange("theme_mode", value)}
              >
                <ToggleGroupItem className="text-xs" value="light" aria-label="Toggle inset">
                  Light
                </ToggleGroupItem>
                <ToggleGroupItem className="text-xs" value="dark" aria-label="Toggle sidebar">
                  Dark
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Sidebar Variant</Label>
              <ToggleGroup
                className="w-full"
                size="sm"
                variant="outline"
                type="single"
                value={variant}
                onValueChange={(value) => handleValueChange("sidebar_variant", value)}
              >
                <ToggleGroupItem className="text-xs" value="inset" aria-label="Toggle inset">
                  Inset
                </ToggleGroupItem>
                <ToggleGroupItem className="text-xs" value="sidebar" aria-label="Toggle sidebar">
                  Sidebar
                </ToggleGroupItem>
                <ToggleGroupItem className="text-xs" value="floating" aria-label="Toggle floating">
                  Floating
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Navbar Style</Label>
              <ToggleGroup
                className="w-full"
                size="sm"
                variant="outline"
                type="single"
                value={navbarStyle}
                onValueChange={(value) => handleValueChange("navbar_style", value)}
              >
                <ToggleGroupItem className="text-xs" value="sticky" aria-label="Toggle sticky">
                  Sticky
                </ToggleGroupItem>
                <ToggleGroupItem className="text-xs" value="scroll" aria-label="Toggle scroll">
                  Scroll
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Sidebar Collapsible</Label>
              <ToggleGroup
                className="w-full"
                size="sm"
                variant="outline"
                type="single"
                value={collapsible}
                onValueChange={(value) => handleValueChange("sidebar_collapsible", value)}
              >
                <ToggleGroupItem className="text-xs" value="icon" aria-label="Toggle icon">
                  Icon
                </ToggleGroupItem>
                <ToggleGroupItem className="text-xs" value="offcanvas" aria-label="Toggle offcanvas">
                  OffCanvas
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Content Layout</Label>
              <ToggleGroup
                className="w-full"
                size="sm"
                variant="outline"
                type="single"
                value={contentLayout}
                onValueChange={(value) => handleValueChange("content_layout", value)}
              >
                <ToggleGroupItem className="text-xs" value="centered" aria-label="Toggle centered">
                  Centered
                </ToggleGroupItem>
                <ToggleGroupItem className="text-xs" value="full-width" aria-label="Toggle full-width">
                  Full Width
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div> */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
