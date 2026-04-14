"use client";

import { format } from "date-fns";
import { X, Users, Send, Eye, MousePointer, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import type { PushNotification } from "@/stores/services/notificationApi";

interface ViewNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: PushNotification;
}

export default function ViewNotificationDialog({ open, onOpenChange, notification }: ViewNotificationDialogProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      draft: { color: "bg-gray-100 text-gray-700", label: "Draft" },
      scheduled: { color: "bg-blue-100 text-blue-700", label: "Scheduled" },
      sent: { color: "bg-green-100 text-green-700", label: "Sent" },
      failed: { color: "bg-red-100 text-red-700", label: "Failed" },
    };

    const config = variants[status] || variants.draft;
    return <span className={`rounded-full px-2 py-1 text-xs ${config.color}`}>{config.label}</span>;
  };

  const deliveryRate =
    notification.totalRecipients > 0 ? (notification.deliveredCount / notification.totalRecipients) * 100 : 0;

  const clickRate =
    notification.deliveredCount > 0 ? (notification.clickedCount / notification.deliveredCount) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Notification Details</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preview */}
          <div className="space-y-2">
            <h3 className="text-muted-foreground text-sm font-semibold">Preview</h3>
            <Card className="bg-gray-50 dark:bg-gray-800">
              <CardContent className="p-4">
                {notification.image && (
                  <img
                    src={notification.image}
                    alt="Notification"
                    className="mb-3 h-48 w-full rounded-lg object-cover"
                  />
                )}
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                    <span className="text-xs font-bold text-white">GK</span>
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-lg font-semibold">{notification.title}</p>
                    <p className="text-muted-foreground text-sm">{notification.message}</p>
                    {notification.actionButton && (
                      <Button size="sm" className="mt-3">
                        {notification.actionButton.text}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status & Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground mb-1 text-sm">Status</p>
              <div>{getStatusBadge(notification.status)}</div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-sm">Target Audience</p>
              <Badge variant="outline" className="capitalize">
                {notification.targetAudience === "all" ? "All Users" : notification.targetAudience}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Analytics (only if sent) */}
          {notification.status === "sent" && (
            <>
              <div>
                <h3 className="text-muted-foreground mb-3 text-sm font-semibold">Performance</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-muted-foreground mb-1 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="text-xs">Sent</span>
                      </div>
                      <p className="text-2xl font-bold">{notification.sentCount.toLocaleString()}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="mb-1 flex items-center gap-2 text-green-600">
                        <Send className="h-4 w-4" />
                        <span className="text-xs">Delivered</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {notification.deliveredCount.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">{deliveryRate.toFixed(1)}% rate</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="mb-1 flex items-center gap-2 text-blue-600">
                        <MousePointer className="h-4 w-4" />
                        <span className="text-xs">Clicked</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{notification.clickedCount.toLocaleString()}</p>
                      <p className="text-muted-foreground mt-1 text-xs">{clickRate.toFixed(1)}% rate</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="mb-1 flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs">Failed</span>
                      </div>
                      <p className="text-2xl font-bold text-red-600">{notification.failedCount.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Details */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold">Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground mb-1 text-sm">Created By</p>
                <p className="text-sm font-medium">{notification.createdByName}</p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1 text-sm">Created At</p>
                <p className="text-sm font-medium">
                  {format(new Date(notification.createdAt), "MMM dd, yyyy • hh:mm a")}
                </p>
              </div>

              {notification.scheduledAt && (
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Scheduled For</p>
                  <p className="text-sm font-medium">
                    {format(new Date(notification.scheduledAt), "MMM dd, yyyy • hh:mm a")}
                  </p>
                </div>
              )}

              {notification.sentAt && (
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Sent At</p>
                  <p className="text-sm font-medium">
                    {format(new Date(notification.sentAt), "MMM dd, yyyy • hh:mm a")}
                  </p>
                </div>
              )}

              <div>
                <p className="text-muted-foreground mb-1 text-sm">Total Recipients</p>
                <p className="text-sm font-medium">{notification.totalRecipients.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1 text-sm">Delivery Type</p>
                <p className="text-sm font-medium capitalize">{notification.scheduleType}</p>
              </div>
            </div>

            {notification.deepLink && (
              <div>
                <p className="text-muted-foreground mb-1 text-sm">Deep Link</p>
                <p className="rounded bg-gray-50 p-2 font-mono text-sm">{notification.deepLink}</p>
              </div>
            )}

            {notification.actionButton && (
              <div>
                <p className="text-muted-foreground mb-1 text-sm">Action Button</p>
                <div className="flex items-center gap-2 rounded bg-gray-50 p-2">
                  <Badge variant="outline">{notification.actionButton.text}</Badge>
                  <span className="text-muted-foreground text-xs">→</span>
                  <span className="font-mono text-xs">{notification.actionButton.link}</span>
                </div>
              </div>
            )}

            {notification.filters && Object.keys(notification.filters).length > 0 && (
              <div>
                <p className="text-muted-foreground mb-2 text-sm">Applied Filters</p>
                <div className="space-y-2 rounded bg-gray-50 p-3 dark:bg-gray-800">
                  {notification.filters.region && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Regions:</span>
                      <div className="flex flex-wrap gap-1">
                        {notification.filters.region.map((region, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {notification.filters.city && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Cities:</span>
                      <div className="flex flex-wrap gap-1">
                        {notification.filters.city.map((city, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {city}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {notification.filters.orderHistory && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Order History:</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {notification.filters.orderHistory.replace("-", " ")}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
