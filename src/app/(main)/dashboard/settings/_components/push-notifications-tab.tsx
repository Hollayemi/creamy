"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Bell,
  Send,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  useGetAllNotificationsQuery,
  useGetNotificationStatsQuery,
  useDeleteNotificationMutation,
  useSendNotificationMutation,
  type PushNotification,
} from "@/stores/services/notificationApi";
import CreateNotificationDialog from "./create-notification-dialog";
import ViewNotificationDialog from "./view-notification-dialog";

export default function PushNotificationsTab() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedNotification, setSelectedNotification] = useState<PushNotification | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);

  const { data: notificationsResponse, isLoading } = useGetAllNotificationsQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const { data: statsResponse } = useGetNotificationStatsQuery();

  const [deleteNotification, { isLoading: isDeleting }] = useDeleteNotificationMutation();
  const [sendNotification, { isLoading: isSending }] = useSendNotificationMutation();

  const notifications = notificationsResponse?.data || [];
  const stats = statsResponse?.data;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      draft: { variant: "secondary", icon: Edit, label: "Draft" },
      scheduled: { variant: "default", icon: Clock, label: "Scheduled" },
      sent: { variant: "default", icon: CheckCircle, label: "Sent" },
      failed: { variant: "destructive", icon: XCircle, label: "Failed" },
    };

    const config = variants[status] || variants.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="capitalize">
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getAudienceBadge = (audience: string) => {
    const labels: Record<string, string> = {
      all: "All Users",
      customers: "Customers",
      drivers: "Drivers",
      specific: "Specific Users",
    };

    return (
      <Badge variant="outline" className="capitalize">
        {labels[audience] || audience}
      </Badge>
    );
  };

  const handleView = (notification: PushNotification) => {
    setSelectedNotification(notification);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (notification: PushNotification) => {
    setSelectedNotification(notification);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setNotificationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!notificationToDelete) return;

    try {
      await deleteNotification(notificationToDelete).unwrap();
      toast.success("Notification deleted successfully");
      setDeleteDialogOpen(false);
      setNotificationToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete notification");
    }
  };

  const handleSendNow = async (id: string) => {
    try {
      await sendNotification(id).unwrap();
      toast.success("Notification sent successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send notification");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Delivered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.totalDelivered.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.deliveryRate.toFixed(1)}% delivery rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clicked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalClicked.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.clickRate.toFixed(1)}% click rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.totalFailed.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Push Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Send targeted push notifications to your users
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Notification
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground h-32">
                    <div className="flex flex-col items-center justify-center">
                      <Bell className="h-12 w-12 mb-2 opacity-50" />
                      <p>No notifications yet</p>
                      <Button
                        variant="link"
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="mt-2"
                      >
                        Create your first notification
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((notification) => (
                  <TableRow key={notification._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {notification.message}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getAudienceBadge(notification.targetAudience)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{notification.totalRecipients.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {notification.scheduleType === "scheduled" &&
                      notification.scheduledAt ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(notification.scheduledAt), "MMM dd, hh:mm a")}</span>
                        </div>
                      ) : (
                        <span className="text-sm">Immediate</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(notification.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(new Date(notification.createdAt), "MMM dd, yyyy")}</p>
                        <p className="text-muted-foreground text-xs">
                          {notification.createdByName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(notification)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>

                          {notification.status === "draft" && (
                            <>
                              <DropdownMenuItem onClick={() => handleEdit(notification)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSendNow(notification._id)}
                                disabled={isSending}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Send Now
                              </DropdownMenuItem>
                            </>
                          )}

                          {notification.status === "scheduled" && (
                            <DropdownMenuItem
                              onClick={() => handleSendNow(notification._id)}
                              disabled={isSending}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send Now
                            </DropdownMenuItem>
                          )}

                          {(notification.status === "draft" ||
                            notification.status === "failed") && (
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(notification._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateNotificationDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        notification={selectedNotification}
        onSuccess={() => {
          setIsCreateDialogOpen(false);
          setSelectedNotification(null);
        }}
      />

      {selectedNotification && (
        <ViewNotificationDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          notification={selectedNotification}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this notification? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
