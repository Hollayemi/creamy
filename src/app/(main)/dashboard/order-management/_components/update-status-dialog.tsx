"use client";

import { X, Eye, EyeOff, MoreVertical, Loader2, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Define available statuses and their possible transitions
const STATUS_FLOW: Record<string, string[]> = {
  Pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: ["returned"],
  returned: ["refunded"],
  cancelled: [],
  refunded: [],
};

// Status display names and colors
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  Pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  processing: { label: "Processing", color: "bg-purple-100 text-purple-800" },
  shipped: { label: "Shipped", color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  returned: { label: "Returned", color: "bg-orange-100 text-orange-800" },
  refunded: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
};

// Status-specific note placeholders
const STATUS_NOTE_PLACEHOLDERS: Record<string, string> = {
  confirmed: "Add confirmation notes (e.g., payment verified, inventory allocated)...",
  processing: "Add processing notes (e.g., preparing order, quality check)...",
  shipped: "Add shipping details (e.g., tracking number, courier info)...",
  delivered: "Add delivery confirmation notes...",
  returned: "Add return reason and condition notes...",
  refunded: "Add refund reference and amount notes...",
  cancelled: "Add cancellation reason...",
};

interface UpdateStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: string, note: string) => void;
  currentStatus: string;
  isSubmitting?: boolean;
}

export default function UpdateStatusDialog({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  isSubmitting = false,
}: UpdateStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  // Reset when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedStatus("");
      setNote("");
      setShowNoteInput(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const availableStatuses = STATUS_FLOW[currentStatus] || [];
  const canConfirm = selectedStatus.trim() !== "";

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setShowNoteInput(true);
  };

  const currentStatusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG["Pending"];
  const selectedStatusConfig = STATUS_CONFIG[selectedStatus];

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex w-96 translate-x-170 items-center justify-center overflow-hidden bg-transparent">
      <div className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gray-900 p-6 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-3">
              <MoreVertical className="h-5 w-5 cursor-pointer text-gray-300 transition-colors hover:text-white" />
              <MoreVertical className="h-5 w-5 cursor-pointer text-gray-300 transition-colors hover:text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">Update Order Status</h2>
          </div>
          <button onClick={onClose} className="text-white transition-colors hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 bg-gray-50 p-6 dark:bg-gray-800">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Update the status of this order from{" "}
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${currentStatusConfig.color}`}>
                {currentStatusConfig.label}
              </span>{" "}
              to the next stage.
            </p>
          </div>

          {availableStatuses.length === 0 ? (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
              <p className="text-sm">This order has reached its final state and cannot be updated further.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Select New Status</label>
              {!showNoteInput ? (
                <div className="space-y-2">
                  {availableStatuses.map((status) => {
                    const config = STATUS_CONFIG[status];
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusSelect(status)}
                        className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left transition-all hover:border-purple-300 hover:bg-purple-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-purple-700 dark:hover:bg-purple-900/20"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{config?.label || status}</p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {STATUS_NOTE_PLACEHOLDERS[status]?.substring(0, 60)}...
                            </p>
                          </div>
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <>
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20">
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                      Changing from{" "}
                      <span className={`rounded px-1 py-0.5 text-xs ${currentStatusConfig.color}`}>
                        {currentStatusConfig.label}
                      </span>{" "}
                      to{" "}
                      <span className={`rounded px-1 py-0.5 text-xs ${selectedStatusConfig?.color}`}>
                        {selectedStatusConfig?.label || selectedStatus}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Status Note</label>
                    <textarea
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      placeholder={STATUS_NOTE_PLACEHOLDERS[selectedStatus] || "Add notes about this status update..."}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Optional but recommended for better tracking
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedStatus("");
                        setShowNoteInput(false);
                        setNote("");
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ← Back to status selection
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {availableStatuses.length > 0 && (
          <div className="flex justify-between gap-3 border-t bg-gray-50 p-6 dark:bg-gray-800">
            <Button
              variant="outline"
              className="w-1/2 border border-gray-300 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              disabled={!canConfirm || isSubmitting}
              onClick={() => onConfirm(selectedStatus, note)}
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Status
            </Button>

            <Button
              variant="outline"
              className="w-1/2 border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
