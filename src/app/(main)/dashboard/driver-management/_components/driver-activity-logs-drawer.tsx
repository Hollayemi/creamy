"use client";

import { format } from "date-fns";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetDriverActivityLogsByIdQuery } from "@/stores/services/driverApi";

interface ActivityLogsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driverId: string;
  driverName: string;
}

export default function ActivityLogsDrawer({
  open,
  onOpenChange,
  driverId,
  driverName,
}: ActivityLogsDrawerProps) {
  const { data: logsResponse, isLoading } = useGetDriverActivityLogsByIdQuery(driverId, {
    skip: !open,
  });

  const logs = logsResponse?.data?.logs || [];

  const getActivityIcon = (action: string) => {
    const colors: Record<string, string> = {
      login: "bg-green-100 text-green-600",
      logout: "bg-gray-100 text-gray-600",
      create: "bg-blue-100 text-blue-600",
      update: "bg-yellow-100 text-yellow-600",
      delete: "bg-red-100 text-red-600",
      approved: "bg-purple-100 text-purple-600",
      cancelled: "bg-red-100 text-red-600",
      suspended: "bg-orange-100 text-orange-600",
    };

    const actionLower = action.toLowerCase();
    const colorClass = Object.keys(colors).find((key) => actionLower.includes(key))
      ? colors[Object.keys(colors).find((key) => actionLower.includes(key))!]
      : "bg-gray-100 text-gray-600";

    return (
      <div className={`w-3 h-3 rounded-full ${colorClass}`} />
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Activity Logs</SheetTitle>
              <SheetDescription>
                Last Login: {new Date().toLocaleString()}
              </SheetDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No activity logs found
            </div>
          ) : (
            <div className="space-y-6">
              {logs.map((log) => (
                <div key={log._id} className="flex gap-4">
                  {/* Timeline dot and line */}
                  <div className="flex flex-col items-center">
                    {getActivityIcon(log.action)}
                    <div className="w-0.5 h-full bg-gray-200 mt-2" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold">{log.action}</p>
                        <p className="text-sm text-muted-foreground">{log.description}</p>
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {format(new Date(log.timestamp), "dd MMM yyyy - hh:mm a")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
