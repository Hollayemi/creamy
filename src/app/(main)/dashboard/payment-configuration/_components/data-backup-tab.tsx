"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function DataBackupTab() {
  const [autoBackup, setAutoBackup] = useState(true);
  const [frequency, setFrequency] = useState("Daily");
  const [confirmReset, setConfirmReset] = useState(false);

  const backupHistory = [
    {
      date: "Feb 10, 2026 - 02:00 AM",
      type: "Automatic",
      size: "24MB",
      status: "Success",
    },
    {
      date: "Feb 08, 2026 - 05:45 PM",
      type: "Manual",
      size: "22MB",
      status: "Success",
    },
    {
      date: "Feb 05, 2026 - 02:00 AM",
      type: "Automatic",
      size: "21MB",
      status: "Failed",
    },
  ];

  const handleResetData = () => {
    // Your reset logic goes here
    console.log("Data has been reset!");
    setConfirmReset(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Data & Backup</h2>
        <p className="text-muted-foreground">
          Manage your system backups, restore data, and configure automatic backup schedules.
        </p>
      </div>

      {/* Manual Backup Section */}
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h3 className="mb-4 font-semibold">Manual Backup</h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Last Backup: Feb 08, 2026 - 05:45 PM</p>
            <p className="text-sm text-green-600">Status: Successful</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">Download Latest</Button>
            <Button>Backup Now</Button>
          </div>
        </div>
      </div>

      {/* Automatic Backup */}
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h3 className="mb-4 font-semibold">Automatic Backup Settings</h3>

        <div className="space-y-4">
          {/* Toggle */}
          <div className="flex items-center justify-between">
            <span>Enable Automatic Backups</span>

            <Button
              onClick={() => setAutoBackup(!autoBackup)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                autoBackup ? "default" : "g-gray-300 dark:bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                  autoBackup ? "translate-x-5" : ""
                }`}
              />
            </Button>
          </div>

          {/* Frequency */}
          <div className="flex items-center justify-between">
            <span>Backup Frequency</span>

            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="rounded-md border px-3 py-1 text-sm"
              disabled={!autoBackup}
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          {/* Time */}
          <div className="flex items-center justify-between">
            <span>Backup Time</span>

            <input type="time" className="rounded-md border px-3 py-1 text-sm" disabled={!autoBackup} />
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h3 className="mb-4 font-semibold">Backup History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground border-b">
              <tr>
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">Type</th>
                <th className="py-2 text-left">Size</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {backupHistory.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3">{item.date}</td>
                  <td>{item.type}</td>
                  <td>{item.size}</td>
                  <td>
                    <span className={`${item.status === "Success" ? "text-green-600" : "text-red-500"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <Button size="sm" variant="outline">
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:bg-red-950">
        <h3 className="mb-4 font-semibold text-red-600">Danger Zone</h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Reset System Data</p>
            <p className="text-muted-foreground text-sm">
              This will permanently delete all store data. This action cannot be undone.
            </p>
          </div>

          <Button variant="destructive" onClick={() => setConfirmReset(true)}>
            Reset Data
          </Button>
        </div>
      </div>
      {/* Confirmation Modal */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-[500px] rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <Button variant="ghost" onClick={() => setConfirmReset(false)} className="absolute top-3 right-3">
              <X className="h-6 w-6" />
            </Button>

            <h3 className="mb-4 text-lg font-semibold">Are you sure you want to reset all your data?</h3>

            <p className="text-muted-foreground mb-6 text-sm">
              This will permanently delete all store data. This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button variant="destructive" onClick={handleResetData}>
                Yes, Reset
              </Button>
              <Button onClick={() => setConfirmReset(false)}>No, Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
