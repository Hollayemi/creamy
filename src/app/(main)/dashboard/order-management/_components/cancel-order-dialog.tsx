"use client";

import { X, Eye, EyeOff, MoreVertical, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CancelOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, note: string, password: string) => void;
  isSubmitting?: boolean;
}

export default function CancelOrderDialog({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}: CancelOrderDialogProps) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Reset reason whenever the dialog opens or closes
  useEffect(() => {
    if (!isOpen) setReason("");
    setNote("");
    setPassword("");
    setShowPassword(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const canConfirm = reason.trim() !== "" && note.trim() !== "" && password.trim() !== "";

  return (
    <div className="fixed inset-0 z-50 flex w-96 translate-x-100 items-center justify-center overflow-hidden bg-black/50">
      <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gray-900 p-6 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-3">
              <MoreVertical className="h-5 w-5 cursor-pointer text-gray-300 transition-colors hover:text-white" />
              <MoreVertical className="h-5 w-5 cursor-pointer text-gray-300 transition-colors hover:text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">Cancel Order</h2>
          </div>
          <button onClick={onClose} className="text-white transition-colors hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 bg-gray-50 p-6 dark:bg-gray-800">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to cancel this order? Please select a reason and confirm.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">Reason for Canceling</label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Select reason</option>
              <option value="out_of_stock">Out of stock</option>
              <option value="wrong_order">Wrong order</option>
              <option value="payment_issue">Payment issue</option>
              <option value="customer_unreachable">Customer unreachable</option>
              <option value="system_error">System error</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">Additional Note</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              placeholder="Type in here"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>

          <div className="relative space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">Admin Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-lg border border-gray-300 bg-white p-2 pr-10 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              placeholder="Enter password to confirm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="absolute top-8 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div className="flex justify-between gap-3 border-t bg-gray-50 p-6 dark:bg-gray-800">
          <Button
            variant="outline"
            className="w-1/2 border border-gray-300 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-gray-100"
            disabled={!canConfirm || isSubmitting}
            onClick={() => onConfirm(reason, note, password)}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Confirm Cancel
          </Button>

          <Button
            variant="outline"
            className="w-1/2 border-red-300 bg-red-100 text-red-700 hover:bg-red-200"
            onClick={onClose}
          >
            No, keep the order
          </Button>
        </div>
      </div>
    </div>
  );
}
