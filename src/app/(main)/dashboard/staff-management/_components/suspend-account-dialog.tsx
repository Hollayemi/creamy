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
import { useSuspendAccountMutation, type Staff } from "@/stores/services/staffApi";

interface SuspendAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff;
}

export default function SuspendAccountDialog({
  open,
  onOpenChange,
  staff,
}: SuspendAccountDialogProps) {
  const [reason, setReason] = useState("");
  const [notifyUser, setNotifyUser] = useState(true);

  const [suspendAccount, { isLoading }] = useSuspendAccountMutation();

  const handleSuspend = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for suspension");
      return;
    }

    try {
      await suspendAccount({
        id: staff._id,
        data: {
          reason: reason.trim(),
          notifyUser,
        },
      }).unwrap();

      toast.success("Account suspended successfully");
      onOpenChange(false);
      setReason("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to suspend account");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Suspend Account</DialogTitle>
          <DialogDescription>
            You're about to temporarily suspend {staff.fullName}'s account. This will temporarily
            block their access to the system.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>What happens when you suspend an account?</strong>
            </p>
            <ul className="text-sm text-orange-800 mt-2 space-y-1 list-disc list-inside">
              <li>User will be immediately logged out</li>
              <li>Cannot log back in until unsuspended</li>
              <li>All active sessions will be terminated</li>
              <li>Can be reversed at any time</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Suspension *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Type in the reason"
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This reason will be logged and visible to administrators
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
            variant="default"
            className="bg-orange-600 hover:bg-orange-700"
            onClick={handleSuspend}
            disabled={isLoading}
          >
            {staff.status === "suspended" ? "Unsuspend" : isLoading ? "Suspending..." : "Suspend Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
