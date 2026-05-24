"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Settings,
  Car,
  CreditCard,
  ChevronDown,
  Tag,
  LogOut,
  Moon,
  Sun,
  BarChart3,
  Bell,
  UserCog,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/stores/hooks";
import { logout } from "@/stores/slices/authSlice";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";
import { updateThemeMode } from "@/lib/theme-utils";
import { setValueToCookie } from "@/server/server-actions";
import { APP_CONFIG } from "@/config/app-config";

interface NavSubItem {
  title: string;
  url: string;
}

interface NavMainItem {
  title: string;
  url: string;
  icon: React.ElementType;
  subItems?: NavSubItem[];
  action?: () => void;
  isThemeToggle?: boolean;
}

interface NavGroup {
  label?: string;
  items: NavMainItem[];
}

export function AppSidebar({ variant = "inset", collapsible = "icon" }: { variant?: any; collapsible?: any }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Auto-open dropdown if a sub-item is active
  useEffect(() => {
    const groups: Record<string, boolean> = {};
    navGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.subItems) {
          const isChildActive = item.subItems.some((sub) => pathname === sub.url || pathname.startsWith(sub.url));
          if (isChildActive) {
            groups[item.title] = true;
          }
        }
      });
    });
    setOpenGroups((prev) => ({ ...prev, ...groups }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleThemeToggle = async () => {
    const newMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newMode);
    updateThemeMode(newMode);
    await setValueToCookie("theme_mode", newMode);
  };

  const isActive = (url: string, subItems?: NavSubItem[]) => {
    if (subItems) {
      return subItems.some((sub) => pathname === sub.url || pathname.startsWith(sub.url + "/"));
    }
    if (url === "/dashboard") return pathname === "/dashboard";
    return pathname === url || pathname.startsWith(url + "/");
  };

  const navGroups: NavGroup[] = [
    {
      label: "Menu Items",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Products",
          url: "/dashboard/product-management",
          icon: Package,
        },
        {
          title: "Orders",
          url: "/dashboard/order-management",
          icon: ShoppingCart,
        },
        {
          title: "Customers",
          url: "/dashboard/customer-management",
          icon: Users,
        },
        {
          title: "Promotions",
          url: "/dashboard/promotion",
          icon: Tag,
        },
        {
          title: "Plans",
          url: "/dashboard/plans",
          icon: DollarSign,
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: Settings,
        },
      ],
    },
    {
      label: "Accounts",
      items: [
        {
          title: "Staff Management",
          url: "/dashboard/staff-management",
          icon: UserCog,
        },
        {
          title: "Driver Management",
          url: "/dashboard/driver-management",
          icon: Car,
        },
      ],
    },
    {
      label: "System",
      items: [
        {
          title: "Payment Config",
          url: "/dashboard/payment-configuration",
          icon: CreditCard,
        },
        {
          title: themeMode === "light" ? "Dark Mode" : "Light Mode",
          url: "#",
          icon: themeMode === "light" ? Moon : Sun,
          action: handleThemeToggle,
          isThemeToggle: true,
        },
        {
          title: "Log Out",
          url: "#",
          icon: LogOut,
          action: handleLogout,
        },
      ],
    },
  ];

  return (
    <Sidebar variant={variant} collapsible={collapsible}>
      {/* Header */}
      <SidebarHeader className="border-b border-white/10 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src={APP_CONFIG.icon}
            className="h-10 w-20 group-data-[collapsible=icon]:hidden"
            alt="GO-KART"
            width={900}
            height={900}
          />
          <Image
            src={APP_CONFIG.logo}
            className="hidden! h-6 w-16! group-data-[collapsible=icon]:block!"
            alt="GO-KART"
            width={900}
            height={900}
          />
        </Link>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-2 py-2 hide-sidebar 0overflow-hidden">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            {group.label && (
              <SidebarGroupLabel className="mb-1 px-2 text-[10px] tracking-widest text-white/30 uppercase">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarMenu>
              {group.items.map((item) => {
                const active = isActive(item.url, item.subItems);
                const isOpen = openGroups[item.title] ?? false;
                const Icon = item.icon;

                // Items with sub-menu
                if (item.subItems && item.subItems.length > 0) {
                  return (
                    <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleGroup(item.title)} asChild>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            isActive={active}
                            className={cn(
                              "group/btn w-full justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                              "text-white/60 hover:bg-white/8 hover:text-white",
                              active && "border border-[#5b2d90]/40 bg-[#5b2d90]/30 text-white",
                            )}
                            tooltip={item.title}
                          >
                            <span className="flex items-center gap-3">
                              <Icon
                                className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  active ? "text-[#e3bc5c]" : "text-white/40 group-hover/btn:text-white/70",
                                )}
                              />
                              <span>{item.title}</span>
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-3.5 w-3.5 shrink-0 text-white/30 transition-transform duration-200",
                                isOpen && "rotate-180",
                              )}
                            />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                          <SidebarMenuSub className="mt-0.5 ml-4 border-l border-white/10 pl-3">
                            {item.subItems.map((sub) => {
                              const subActive = pathname === sub.url || pathname.startsWith(sub.url + "/");
                              return (
                                <SidebarMenuSubItem key={sub.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={subActive}
                                    className={cn(
                                      "rounded-md py-1.5 text-sm transition-all duration-150",
                                      "text-white/50 hover:bg-white/5 hover:text-white",
                                      subActive && "bg-[#5b2d90]/20 font-medium text-white",
                                    )}
                                  >
                                    <Link href={sub.url}>
                                      <span
                                        className={cn(
                                          "mr-2 h-1 w-1 rounded-full bg-white/20",
                                          subActive && "bg-[#e3bc5c]",
                                        )}
                                      />
                                      {sub.title}
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // Action items (logout, theme toggle)
                if (item.action) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={item.action}
                        className={cn(
                          "w-full rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                          "text-white/60 hover:bg-white/8 hover:text-white",
                          item.title === "Log Out" && "hover:bg-red-500/10 hover:text-red-400",
                        )}
                        tooltip={item.title}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-white/40" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                // Regular nav items
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                        "text-white/60 hover:bg-white/8 hover:text-white",
                        active && "border border-[#5b2d90]/40 bg-[#5b2d90]/30 text-white",
                      )}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            active ? "text-[#e3bc5c]" : "text-white/40",
                          )}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-white/10 px-4 py-3">
        <div className="text-center text-[10px] text-white/20">© {new Date().getFullYear()} GoKart Admin</div>
      </SidebarFooter>
    </Sidebar>
  );
}
