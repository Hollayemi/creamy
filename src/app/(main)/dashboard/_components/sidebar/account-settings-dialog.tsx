"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useGetCurrentUserQuery } from "@/stores/services/authApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AccountSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function getInitials(name?: string) {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function AccountSettingsDialog({ isOpen, onClose }: AccountSettingsDialogProps) {
  const { data: currentUser } = useGetCurrentUserQuery();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  const initials = getInitials(currentUser?.fullName);

  const canManageRoles =
    currentUser?.permissions?.includes("manage_roles") || currentUser?.permissions?.includes("system_settings");

  const handleSaveProfile = () => {
    const payload = {
      fullName,
      email,
      avatar: avatarFile,
    };
  };

  const handlePasswordUpdate = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b p-5">
          <h2 className="text-lg font-semibold">Account Settings</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Profile Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Profile</h3>

            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarImage src={currentUser?.avatar || ""} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div>
                <label className="text-sm font-medium">Change Avatar</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <Button onClick={handleSaveProfile}>Save Profile</Button>
          </div>

          {/* Role & Status (Admin Only) */}
          {canManageRoles && (
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="font-semibold">Account Control</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Input value={currentUser.roleName} disabled />
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Input value={currentUser.status} disabled />
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold">Security</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">New Password</label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Confirm Password</label>

                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button onClick={handlePasswordUpdate}>Update Password</Button>
          </div>

          {/* Permissions */}
          {currentUser?.permissions?.length > 0 && (
            <div className="rounded-lg border p-4">
              <h3 className="mb-3 font-semibold">Permissions</h3>

              <div className="flex flex-wrap gap-2">
                {currentUser.permissions.map((perm: string) => (
                  <span key={perm} className="bg-muted rounded-md px-2 py-1 text-xs">
                    {perm.replaceAll("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
