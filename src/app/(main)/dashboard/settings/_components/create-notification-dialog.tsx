"use client";

import { useState, useEffect } from "react";
import { Upload, X, Send, Save, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useTestNotificationMutation,
  useGetRecipientCountMutation,
  type PushNotification,
} from "@/stores/services/notificationApi";

interface CreateNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification?: PushNotification | null;
  onSuccess?: () => void;
}

export default function CreateNotificationDialog({
  open,
  onOpenChange,
  notification,
  onSuccess,
}: CreateNotificationDialogProps) {
  const isEditMode = !!notification;

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetAudience: "all" as "all" | "customers" | "drivers" | "specific",
    scheduleType: "immediate" as "immediate" | "scheduled",
    scheduledAt: "",
    deepLink: "",
    actionButtonText: "",
    actionButtonLink: "",
    // Filters
    regions: [] as string[],
    cities: [] as string[],
    orderHistory: "" as "" | "has-ordered" | "never-ordered" | "frequent-buyers",
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recipientCount, setRecipientCount] = useState<number | null>(null);

  const [createNotification, { isLoading: isCreating }] = useCreateNotificationMutation();
  const [updateNotification, { isLoading: isUpdating }] = useUpdateNotificationMutation();
  const [testNotification, { isLoading: isTesting }] = useTestNotificationMutation();
  const [getRecipientCount, { isLoading: isEstimating }] = useGetRecipientCountMutation();

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setFormData({
        title: "",
        message: "",
        targetAudience: "all",
        scheduleType: "immediate",
        scheduledAt: "",
        deepLink: "",
        actionButtonText: "",
        actionButtonLink: "",
        regions: [],
        cities: [],
        orderHistory: "",
      });
      setImage(null);
      setImagePreview(null);
      setRecipientCount(null);
    } else if (notification && isEditMode) {
      // Load existing notification data
      setFormData({
        title: notification.title,
        message: notification.message,
        targetAudience: notification.targetAudience,
        scheduleType: notification.scheduleType,
        scheduledAt: notification.scheduledAt || "",
        deepLink: notification.deepLink || "",
        actionButtonText: notification.actionButton?.text || "",
        actionButtonLink: notification.actionButton?.link || "",
        regions: notification.filters?.region || [],
        cities: notification.filters?.city || [],
        orderHistory: notification.filters?.orderHistory || "",
      });
      if (notification.image) {
        setImagePreview(notification.image);
      }
    }
  }, [open, notification, isEditMode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(file);
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleEstimateRecipients = async () => {
    try {
      const filters: any = {};
      if (formData.regions.length > 0) filters.region = formData.regions;
      if (formData.cities.length > 0) filters.city = formData.cities;
      if (formData.orderHistory) filters.orderHistory = formData.orderHistory;

      const result = await getRecipientCount({
        targetAudience: formData.targetAudience,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
      }).unwrap();

      if (result.data) {
        setRecipientCount(result.data.count);
        toast.success(`Estimated ${result.data.count} recipients`);
      }
    } catch (error: any) {
      toast.error("Failed to estimate recipients");
    }
  };

  const handleTest = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Title and message are required");
      return;
    }

    try {
      await testNotification({
        title: formData.title,
        message: formData.message,
        targetAudience: "all",
        scheduleType: "immediate",
        deepLink: formData.deepLink || undefined,
        actionButton:
          formData.actionButtonText && formData.actionButtonLink
            ? { text: formData.actionButtonText, link: formData.actionButtonLink }
            : undefined,
      }).unwrap();

      toast.success("Test notification sent to your device");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send test notification");
    }
  };

  const handleSubmit = async (saveAsDraft: boolean = false) => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Message is required");
      return;
    }

    if (
      formData.scheduleType === "scheduled" &&
      !formData.scheduledAt
    ) {
      toast.error("Please select a schedule time");
      return;
    }

    try {
      const submitFormData = new FormData();

      submitFormData.append("title", formData.title.trim());
      submitFormData.append("message", formData.message.trim());
      submitFormData.append("targetAudience", formData.targetAudience);
      submitFormData.append("scheduleType", formData.scheduleType);

      if (formData.scheduledAt) {
        submitFormData.append("scheduledAt", formData.scheduledAt);
      }

      if (formData.deepLink.trim()) {
        submitFormData.append("deepLink", formData.deepLink.trim());
      }

      if (formData.actionButtonText.trim() && formData.actionButtonLink.trim()) {
        submitFormData.append("actionButton", JSON.stringify({
          text: formData.actionButtonText.trim(),
          link: formData.actionButtonLink.trim(),
        }));
      }

      // Filters
      if (formData.regions.length > 0 || formData.cities.length > 0 || formData.orderHistory) {
        const filters: any = {};
        if (formData.regions.length > 0) filters.region = formData.regions;
        if (formData.cities.length > 0) filters.city = formData.cities;
        if (formData.orderHistory) filters.orderHistory = formData.orderHistory;
        submitFormData.append("filters", JSON.stringify(filters));
      }

      if (image) {
        submitFormData.append("image", image);
      }

      submitFormData.append("saveAsDraft", saveAsDraft.toString());

      if (isEditMode && notification) {
        await updateNotification({ id: notification._id, formData: submitFormData }).unwrap();
        toast.success("Notification updated successfully");
      } else {
        await createNotification(submitFormData).unwrap();
        toast.success(
          saveAsDraft
            ? "Notification saved as draft"
            : "Notification sent successfully"
        );
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save notification");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Notification" : "Create Push Notification"}
          </DialogTitle>
          <DialogDescription>
            Send targeted push notifications to your app users
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Flash Sale Alert!"
                maxLength={65}
              />
              <p className="text-xs text-muted-foreground">
                {formData.title.length}/65 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="e.g., Get 50% off on all groceries. Limited time only!"
                rows={3}
                maxLength={240}
              />
              <p className="text-xs text-muted-foreground">
                {formData.message.length}/240 characters
              </p>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Notification Image (Optional)</Label>
            {imagePreview ? (
              <div className="relative w-full h-48">
                <img
                  src={imagePreview}
                  alt="Notification"
                  className="w-full h-full object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload image</span>
                <span className="text-xs text-gray-400">Max 2MB, JPG/PNG</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {/* Target Audience */}
          <div className="space-y-4">
            <h3 className="font-semibold">Target Audience *</h3>
            <RadioGroup
              value={formData.targetAudience}
              onValueChange={(value: any) =>
                setFormData({ ...formData, targetAudience: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="font-normal cursor-pointer">
                  All Users (Customers + Drivers)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="customers" id="customers" />
                <Label htmlFor="customers" className="font-normal cursor-pointer">
                  Customers Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="drivers" id="drivers" />
                <Label htmlFor="drivers" className="font-normal cursor-pointer">
                  Drivers Only
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Advanced Filters */}
          {(formData.targetAudience === "customers" ||
            formData.targetAudience === "all") && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold text-sm">Advanced Filters (Optional)</h3>

              <div className="space-y-2">
                <Label htmlFor="orderHistory">Order History</Label>
                <Select
                  value={formData.orderHistory}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, orderHistory: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="has-ordered">Has Ordered Before</SelectItem>
                    <SelectItem value="never-ordered">Never Ordered</SelectItem>
                    <SelectItem value="frequent-buyers">Frequent Buyers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEstimateRecipients}
                disabled={isEstimating}
              >
                {isEstimating ? "Estimating..." : "Estimate Recipients"}
              </Button>

              {recipientCount !== null && (
                <p className="text-sm text-green-600 font-medium">
                  Estimated: {recipientCount.toLocaleString()} recipients
                </p>
              )}
            </div>
          )}

          {/* Scheduling */}
          <div className="space-y-4">
            <h3 className="font-semibold">Delivery Schedule *</h3>
            <RadioGroup
              value={formData.scheduleType}
              onValueChange={(value: any) =>
                setFormData({ ...formData, scheduleType: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="immediate" id="immediate" />
                <Label htmlFor="immediate" className="font-normal cursor-pointer">
                  Send Immediately
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scheduled" id="scheduled" />
                <Label htmlFor="scheduled" className="font-normal cursor-pointer">
                  Schedule for Later
                </Label>
              </div>
            </RadioGroup>

            {formData.scheduleType === "scheduled" && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="scheduledAt">Schedule Date & Time</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledAt: e.target.value })
                  }
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-sm">Action Button (Optional)</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actionButtonText">Button Text</Label>
                <Input
                  id="actionButtonText"
                  value={formData.actionButtonText}
                  onChange={(e) =>
                    setFormData({ ...formData, actionButtonText: e.target.value })
                  }
                  placeholder="e.g., Shop Now"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actionButtonLink">Deep Link</Label>
                <Input
                  id="actionButtonLink"
                  value={formData.actionButtonLink}
                  onChange={(e) =>
                    setFormData({ ...formData, actionButtonLink: e.target.value })
                  }
                  placeholder="e.g., /products/flash-sale"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleTest}
            disabled={isTesting}
          >
            <TestTube className="h-4 w-4 mr-2" />
            {isTesting ? "Sending..." : "Test"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={isCreating || isUpdating}
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isCreating || isUpdating}
          >
            <Send className="h-4 w-4 mr-2" />
            {isCreating || isUpdating
              ? "Sending..."
              : formData.scheduleType === "scheduled"
              ? "Schedule"
              : "Send Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
