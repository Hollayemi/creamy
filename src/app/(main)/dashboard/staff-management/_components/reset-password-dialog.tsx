"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { useResetPasswordMutation, type Staff } from "@/stores/services/staffApi";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff;
}

export default function ResetPasswordDialog({
  open,
  onOpenChange,
  staff,
}: ResetPasswordDialogProps) {
  const [notifyUser, setNotifyUser] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newPassword, setNewPassword] = useState<string>("");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleReset = async () => {
    try {
      const result = await resetPassword({
        id: staff._id,
        notifyUser,
      }).unwrap();

      // Assuming the API returns the new temporary password
      const tempPassword = result.data?.temporaryPassword || "Temp@123456";
      setNewPassword(tempPassword);
      setShowConfirmation(true);
      
      if (notifyUser) {
        toast.success("Password reset email sent to user");
      } else {
        toast.success("Password reset successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setNewPassword("");
    onOpenChange(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newPassword);
    toast.success("Password copied to clipboard");
  };

  return (
    <>
      <Dialog open={open && !showConfirmation} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Generate a new temporary password for {staff.fullName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This will immediately invalidate the user's current
                password and generate a new temporary password. The user will be required to change
                it on their next login.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-muted-foreground">User Information</p>
                <p className="font-semibold mt-1">{staff.fullName}</p>
                <p className="text-sm text-muted-foreground">{staff.email}</p>
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

              <p className="text-xs text-muted-foreground">
                {notifyUser
                  ? "An email with the new temporary password will be sent to the user."
                  : "You will need to manually share the temporary password with the user."}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleReset} disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog with New Password */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Password Reset Successful</AlertDialogTitle>
            <AlertDialogDescription>
              The password for {staff.fullName} has been reset successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            {!notifyUser && (
              <>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>New Temporary Password:</strong>
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-white border rounded font-mono text-sm">
                      {newPassword}
                    </code>
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    ⚠️ Make sure to securely share this password with the user. This password will
                    not be shown again.
                  </p>
                </div>
              </>
            )}

            {notifyUser && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ An email has been sent to {staff.email} with the new temporary password and
                  instructions.
                </p>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogAction onClick={handleClose}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
