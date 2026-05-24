"use client";

import { format } from "date-fns";
import { X, Clock, Calendar, Shield, Activity, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActivityLog, useGetUserActivityLogsQuery } from "@/stores/services/staffApi";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ActivityLogsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  avatar?: string;
  joinedDate?: string;
}

export default function ActivityLogsDrawer({
  open,
  onOpenChange,
  userId,
  userName,
  avatar,
  joinedDate,
}: ActivityLogsDrawerProps) {
  const { data: logsResponse, isLoading } = useGetUserActivityLogsQuery(userId, {
    skip: !open,
  });

  const apiLogs = logsResponse?.data?.logs || [];

  // Dummy data for demonstration as requested
  const dummyLogs: ActivityLog[] = [
    {
      _id: "dummy-1",
      userId,
      userName,
      action: "Add Driver",
      description: `Added a new driver "John Doe" to the system for Ikeja region.`,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
      metadata: {
        driver_details: {
          name: "John Doe",
          phone: "+234 801 234 5678",
          vehicle: "TVS HLX (KJA-203BY)",
          region: "Ikeja",
        },
        action_by: userName,
        approval_status: "Pending Verification",
      },
    },
    {
      _id: "dummy-2",
      userId,
      userName,
      action: "Update Order",
      description: "Changed status of Order #ORD-2456 from Pending to Processing.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      metadata: {
        order_id: "ORD-2456",
        previous_status: "Pending",
        new_status: "Processing",
        reason: "Inventory confirmed",
        estimated_delivery: "2026-04-23T14:00:00Z",
      },
    },
    {
      _id: "dummy-4",
      userId,
      userName,
      action: "Product Update",
      description: "Updated price and stock for 'Dettol Antibacterial Liquid Hand Wash'.",
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
      metadata: {
        product: "Dettol Hand Wash (200ml)",
        sku: "DET-001-L",
        changes: {
          price: "₦7,200 -> ₦7,500",
          stock: "45 -> 120",
        },
      },
    },
    {
      _id: "dummy-5",
      userId,
      userName,
      action: "Customer Support",
      description: "Resolved dispute for Order #ORD-2411 regarding damaged items.",
      timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(), // 12 hours ago
      metadata: {
        customer: "Sarah Johnson",
        ticket_id: "SUP-9901",
        resolution: "Refund Processed",
        amount: "₦2,500",
      },
    },
    {
      _id: "dummy-3",
      userId,
      userName,
      action: "Login",
      description: "Staff logged into the admin dashboard.",
      timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 24 hours ago
      metadata: {
        device: "Chrome on Windows 11",
        ip_address: "192.168.1.1",
        location: "Lagos, Nigeria",
        session_id: "sess_49201938",
      },
    },
  ];

  const logs = [...dummyLogs, ...apiLogs];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getActivityConfig = (action: string) => {
    const actionLower = action.toLowerCase();

    if (actionLower.includes("login")) return { color: "bg-green-500", icon: Shield, variant: "default" as const };
    if (actionLower.includes("logout")) return { color: "bg-gray-500", icon: Clock, variant: "secondary" as const };
    if (actionLower.includes("create") || actionLower.includes("add"))
      return { color: "bg-blue-500", icon: Activity, variant: "default" as const };
    if (actionLower.includes("update") || actionLower.includes("edit") || actionLower.includes("change"))
      return { color: "bg-yellow-500", icon: Activity, variant: "outline" as const };
    if (actionLower.includes("delete") || actionLower.includes("remove"))
      return { color: "bg-red-500", icon: X, variant: "destructive" as const };
    if (actionLower.includes("suspend") || actionLower.includes("cancelled") || actionLower.includes("reject"))
      return { color: "bg-orange-500", icon: Shield, variant: "destructive" as const };
    if (actionLower.includes("approve") || actionLower.includes("accept"))
      return { color: "bg-emerald-500", icon: Shield, variant: "default" as const };
    if (actionLower.includes("order")) return { color: "bg-indigo-500", icon: Activity, variant: "default" as const };
    if (actionLower.includes("driver")) return { color: "bg-cyan-500", icon: Activity, variant: "default" as const };

    return { color: "bg-purple-500", icon: Activity, variant: "outline" as const };
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <SheetHeader className="shrink-0 p-6 pb-2">
          <div className="mb-4 flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold">Staff Activity</SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="bg-muted/30 flex items-center gap-4 rounded-xl border p-4">
            <Avatar className="border-primary/20 h-14 w-14 border-2">
              <AvatarImage src={avatar} alt={userName} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="text-lg leading-none font-semibold">{userName}</h3>
              <p className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                <User className="h-3 w-3" /> ID: {userId.slice(-8).toUpperCase()}
              </p>
              {joinedDate && (
                <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" /> Joined: {format(new Date(joinedDate), "dd MMM yyyy")}
                </p>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="flex shrink-0 items-center justify-between px-6 py-2">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
            <Activity className="h-4 w-4" /> Recent Activities
          </h4>
          <Badge variant="secondary" className="font-mono">
            {logs.length} Total
          </Badge>
        </div>

        <Separator className="mx-6 w-auto shrink-0" />

        <ScrollArea className="min-h-0 flex-1 px-6">
          <div className="py-6">
            {isLoading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3">
                <div className="border-primary h-10 w-10 animate-spin rounded-full border-b-2" />
                <p className="text-muted-foreground animate-pulse text-sm">Loading activity logs...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
                <div className="bg-muted rounded-full p-4">
                  <Activity className="text-muted-foreground h-8 w-8" />
                </div>
                <div>
                  <p className="font-semibold">No activities found</p>
                  <p className="text-muted-foreground text-sm">This user hasn&#39;t performed any actions yet.</p>
                </div>
              </div>
            ) : (
              <div className="relative space-y-0 pb-8">
                {/* Vertical line for timeline */}
                <div className="bg-border absolute top-2 bottom-0 left-4 w-px" />

                {logs.map((log: ActivityLog, index: number) => {
                  const config = getActivityConfig(log.action);
                  return (
                    <div key={log._id} className="relative pb-8 pl-10 last:pb-0">
                      {/* Timeline Connector */}
                      <div
                        className={cn(
                          "border-background absolute top-1.5 left-2.5 z-10 h-3 w-3 rounded-full border-2",
                          config.color,
                        )}
                      />

                      <div className="bg-card flex flex-col gap-2 rounded-lg border p-4 transition-shadow hover:shadow-md">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={config.variant}
                                className="h-5 px-2 py-0 text-[10px] font-bold tracking-wider uppercase"
                              >
                                {log.action}
                              </Badge>
                              <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
                                <Clock className="h-3 w-3" />
                                {format(new Date(log.timestamp), "hh:mm a")}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed font-medium">{log.description}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-muted-foreground text-[10px] font-bold uppercase">
                              {format(new Date(log.timestamp), "dd MMM")}
                            </p>
                          </div>
                        </div>

                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <div className="mt-2">
                            <details className="group">
                              <summary className="text-primary flex cursor-pointer list-none items-center gap-1 text-[10px] font-semibold hover:underline">
                                View Details
                              </summary>
                              <div className="bg-muted/50 mt-2 overflow-hidden rounded-lg border">
                                <div className="divide-border/50 grid grid-cols-1 divide-y">
                                  {Object.entries(log.metadata).map(([key, value]) => (
                                    <div key={key} className="flex flex-col gap-1 p-2.5">
                                      <span className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
                                        {key.replace(/_/g, " ")}
                                      </span>
                                      <div className="text-[11px] font-medium">
                                        {typeof value === "object" ? (
                                          <div className="bg-background/50 border-border/50 mt-1 grid grid-cols-2 gap-2 rounded border p-2">
                                            {Object.entries(value ?? {}).map(([subKey, subValue]) => (
                                              <div key={subKey}>
                                                <p className="text-muted-foreground text-[8px] uppercase">
                                                  {subKey.replace(/_/g, " ")}
                                                </p>
                                                <p className="truncate">{String(subValue)}</p>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <span className="text-foreground">{String(value)}</span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="bg-muted/10 shrink-0 border-t p-6">
          <p className="text-muted-foreground text-center text-[10px] font-bold tracking-widest uppercase">
            End of Activity History
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
