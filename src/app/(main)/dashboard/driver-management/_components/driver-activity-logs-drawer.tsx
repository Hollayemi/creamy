"use client";

import { format } from "date-fns";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetDriverActivityLogsByIdQuery } from "@/stores/services/driverApi";

interface ActivityLogsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driverId: string;
  driverName: string;
}

export default function ActivityLogsDrawer({ open, onOpenChange, driverId, driverName }: ActivityLogsDrawerProps) {
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

    return <div className={`h-3 w-3 rounded-full ${colorClass}`} />;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Activity Logs</SheetTitle>
              <SheetDescription>Last Login: {new Date().toLocaleString()}</SheetDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="mt-6 h-[calc(100vh-120px)]">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-muted-foreground flex h-32 items-center justify-center">No activity logs found</div>
          ) : (
            <div className="space-y-6">
              {logs.map((log) => (
                <div key={log._id} className="flex gap-4">
                  {/* Timeline dot and line */}
                  <div className="flex flex-col items-center">
                    {getActivityIcon(log.action)}
                    <div className="mt-2 h-full w-0.5 bg-gray-200" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold">{log.action}</p>
                        <p className="text-muted-foreground text-sm">{log.description}</p>
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <div className="mt-2 rounded bg-gray-50 p-2 text-xs dark:bg-gray-700">
                            <pre className="whitespace-pre-wrap">{JSON.stringify(log.metadata, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                      <span className="text-muted-foreground ml-4 text-xs whitespace-nowrap">
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
