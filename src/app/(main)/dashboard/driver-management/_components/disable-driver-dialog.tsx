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
import { useDisableDriverMutation, type Driver } from "@/stores/services/driverApi";

interface DisableAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Driver;
}

export default function DisableAccountDialog({ open, onOpenChange, driver }: DisableAccountDialogProps) {
  const [reason, setReason] = useState("");
  const [notifyDriver, setNotifyDriver] = useState(true);

  const [disableAccount, { isLoading }] = useDisableDriverMutation();

  const handleDisable = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for disabling the account");
      return;
    }

    try {
      await disableAccount({
        id: driver._id,
        data: {
          reason: reason.trim(),
          notifyDriver,
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
            You&apos;re about to disable {driver.fullName}&apos;saccount. This will permanently revoke their access and
            deactivate all linked sessions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">
              <strong>⚠️ Warning: This is a permanent action</strong>
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-800">
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
            <p className="text-muted-foreground text-xs">This reason will be permanently logged for audit purposes</p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifyDriver"
              checked={notifyDriver}
              onCheckedChange={(checked) => setNotifyDriver(checked as boolean)}
            />
            <Label htmlFor="notifyDriver" className="cursor-pointer font-normal">
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
          <Button variant="destructive" onClick={handleDisable} disabled={isLoading}>
            {isLoading ? "Disabling..." : "Disable Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
