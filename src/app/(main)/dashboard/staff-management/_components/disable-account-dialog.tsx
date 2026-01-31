"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useDisableAccountMutation, type Staff } from "@/stores/services/staffApi";

interface DisableAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff;
}

export default function DisableAccountDialog({
  open,
  onOpenChange,
  staff,
}: DisableAccountDialogProps) {
  const [reason, setReason] = useState("");
  const [notifyUser, setNotifyUser] = useState(true);

  const [disableAccount, { isLoading }] = useDisableAccountMutation();

  const handleDisable = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for disabling the account");
      return;
    }

    try {
      await disableAccount({
        id: staff._id,
        data: {
          reason: reason.trim(),
          notifyUser,
        },
      }).unwrap();

      toast.success("Account disabled successfully");
      onOpenChange(false);
      setReason("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to disable account");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Disable Account</DialogTitle>
          <DialogDescription>
            You're about to disable {staff.fullName}'s account. This will permanently revoke their
            access and deactivate all linked sessions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>⚠️ Warning: This is a permanent action</strong>
            </p>
            <ul className="text-sm text-red-800 mt-2 space-y-1 list-disc list-inside">
              <li>User will be immediately logged out</li>
              <li>All access permissions will be revoked</li>
              <li>All active sessions will be terminated</li>
              <li>Account can be re-enabled by an administrator</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Disablement *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Type in the reason"
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This reason will be permanently logged for audit purposes
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifyUser"
              checked={notifyUser}
              onCheckedChange={(checked) => setNotifyUser(checked as boolean)}
            />
            <Label htmlFor="notifyUser" className="font-normal cursor-pointer">
              Notify User by Email
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setReason("");
            }}
          >
            Cancel Action
          </Button>
          <Button
            variant="destructive"
            onClick={handleDisable}
            disabled={isLoading}
          >
            {isLoading ? "Disabling..." : "Disable Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
