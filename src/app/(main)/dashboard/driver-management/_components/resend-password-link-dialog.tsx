"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useResendPasswordSetupLinkMutation, type Driver } from "@/stores/services/driverApi";

interface ResendPasswordLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Driver;
}

export default function ResendPasswordLinkDialog({
  open,
  onOpenChange,
  driver,
}: ResendPasswordLinkDialogProps) {
  const [resendPasswordLink, { isLoading }] = useResendPasswordSetupLinkMutation();

  const handleResend = async () => {
    try {
      await resendPasswordLink(driver._id).unwrap();
      toast.success(`Password setup link sent to ${driver.email}`);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resend password link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Resend Password Setup Link</DialogTitle>
          <DialogDescription>
            Send a new password setup link to {driver.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Driver Information:</strong>
            </p>
            <p className="text-sm text-blue-800 mt-2">
              <strong>Name:</strong> {driver.fullName}
            </p>
            <p className="text-sm text-blue-800">
              <strong>Email:</strong> {driver.email}
            </p>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>What will happen:</strong>
            </p>
            <ul className="text-sm text-orange-800 mt-2 space-y-1 list-disc list-inside">
              <li>A new password setup link will be sent to the driver's email</li>
              <li>The link will be valid for 24 hours</li>
              <li>Driver must use this link to create their password</li>
              <li>Previous password setup links will be invalidated</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            The driver will receive an email with instructions on how to set up their password and
            access their account.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleResend} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Password Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
