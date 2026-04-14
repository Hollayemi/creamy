"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useVerifyDriverMutation, useRejectDriverMutation, type Driver } from "@/stores/services/driverApi";

interface VerifyDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Driver;
}

export default function VerifyDriverDialog({ open, onOpenChange, driver }: VerifyDriverDialogProps) {
  const [notes, setNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const [verifyDriver, { isLoading: isVerifying }] = useVerifyDriverMutation();
  const [rejectDriver, { isLoading: isRejecting }] = useRejectDriverMutation();

  const handleVerify = async () => {
    try {
      await verifyDriver({ id: driver._id, notes: notes.trim() || undefined }).unwrap();
      toast.success("Driver verified successfully");
      onOpenChange(false);
      setNotes("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to verify driver");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      await rejectDriver({ id: driver._id, reason: rejectReason.trim() }).unwrap();
      toast.success("Driver verification rejected");
      setShowRejectDialog(false);
      onOpenChange(false);
      setNotes("");
      setRejectReason("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject driver");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verify Driver</DialogTitle>
            <DialogDescription>Review and verify {driver.fullName}&apos;sregistration details</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Driver Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Driver Information</h3>
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <div>
                  <p className="text-muted-foreground text-sm">Full Name</p>
                  <p className="font-medium">{driver.fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <p className="font-medium">{driver.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Phone</p>
                  <p className="font-medium">{driver.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Region</p>
                  <p className="font-medium">{driver.region}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vehicle Information</h3>
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <div>
                  <p className="text-muted-foreground text-sm">Vehicle Type</p>
                  <p className="font-medium capitalize">{driver.vehicleType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Plate Number</p>
                  <p className="font-medium">{driver.vehiclePlateNumber}</p>
                </div>
                {driver.vehicleModel && (
                  <div>
                    <p className="text-muted-foreground text-sm">Model</p>
                    <p className="font-medium">{driver.vehicleModel}</p>
                  </div>
                )}
                {driver.vehicleColor && (
                  <div>
                    <p className="text-muted-foreground text-sm">Color</p>
                    <p className="font-medium">{driver.vehicleColor}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            {driver.driversLicense && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Documents</h3>
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">Driver&apos;sLicense</p>
                  <img
                    src={driver.driversLicense}
                    alt="Driver&apos;sLicense"
                    className="h-48 w-full max-w-md rounded-lg border object-contain"
                  />
                  {driver.licenseNumber && (
                    <p className="text-sm">
                      <strong>License No:</strong> {driver.licenseNumber}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Verification Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Verification Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this verification..."
                rows={3}
              />
            </div>

            {/* Info Box */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-800">
                <strong>Verification will:</strong>
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-green-800">
                <li>Mark the driver as verified</li>
                <li>Allow them to start accepting deliveries</li>
                <li>Send a confirmation email to the driver</li>
                <li>Update their status to &apos;active&apos;</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(true);
              }}
              className="text-red-600 hover:text-red-700"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerify} disabled={isVerifying} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              {isVerifying ? "Verifying..." : "Verify Driver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Driver Verification</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting {driver.fullName}&apos;sverification.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectReason">Rejection Reason *</Label>
              <Textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={4}
              />
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-800">
                The driver will be notified via email about the rejection and the reason provided.
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} disabled={isRejecting} className="bg-red-600 hover:bg-red-700">
              {isRejecting ? "Rejecting..." : "Confirm Rejection"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
