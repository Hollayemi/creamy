"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useCreateStaffMutation,
  useGetRolesQuery,
  useGetPermissionsQuery,
  type CreateStaffInput,
} from "@/stores/services/staffApi";
import { useGetRegionsQuery } from "@/stores/services/config";
import { CategoriesRegionResponse } from "@/types/config";

interface CreateStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateStaffDialog({ open, onOpenChange }: CreateStaffDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<CreateStaffInput>({
    fullName: "",
    email: "",
    password: "",
    role: "",
    region: "",
    branch: "",
    phone: "",
    permissions: [],
  });
  const [manualPermissions, setManualPermissions] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const { data: rolesResponse } = useGetRolesQuery();
  const { data: defaultRegions, isLoading: regionLoading } = useGetRegionsQuery({})
  const [createStaff, { isLoading }] = useCreateStaffMutation();

  const roles = rolesResponse?.data || [];
  const availableRegions: CategoriesRegionResponse[] = Array.isArray(defaultRegions?.data) ? defaultRegions.data : []


  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setStep(1);
      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "",
        region: "",
        branch: "",
        phone: "",
        permissions: [],
      });
      setManualPermissions(false);
    }
  }, [open]);

  const handleNext = () => {
    // Validation for step 1
    if(manualPermissions){
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Valid email is required");
      return;
    }

    if (!formData.role) {
      toast.error("Please select a role");
      return;
    }

    setStep(2);
  }else{
    handleSubmit()
  }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handlePermissionToggle = (permissionId: string) => {
    const currentPermissions = formData.permissions || [];
    if (currentPermissions.includes(permissionId)) {
      setFormData({
        ...formData,
        permissions: currentPermissions.filter((id) => id !== permissionId),
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...currentPermissions, permissionId],
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const submitData = { ...formData };
      if (!manualPermissions) {
        delete submitData.permissions;
      }

      await createStaff(submitData).unwrap();
      toast.success("Staff member created successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create staff member");
    }
  };

  const selectedRole = roles.find((r) => r._id === formData.role);

  useEffect(() => {

    if (selectedRole) {
      const rolePermissions = roles.find(role => role._id === formData.role)?.permissions || [];
      setPermissions(rolePermissions);
      setFormData((prev) => ({
        ...prev,
        permissions: rolePermissions,
      }));
    }


  }, [roles, selectedRole, open]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step === 2 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <DialogTitle>Create New Admin User</DialogTitle>
              <DialogDescription className="mt-2">
                Add a new team member to the GoKart Admin system. Assign their role, set their
                permissions, and define their access region.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              {/* <h3 className="font-semibold text-lg">Basic Information</h3> */}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g., John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john.doe@gokart.ng"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 800 000 0000"
                  />
                </div>
              </div>
            </div>

            {/* Region Assignment */}
            <div className="space-y-4">
              {/* <h3 className="font-semibold text-lg">Region Assignment</h3> */}

              <div className=" gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select value={formData.region} onValueChange={(value: string) => setFormData({ ...formData, region: value })}>
                    <SelectTrigger id="region" className="bg-gray-50 w-full dark:bg-gray-900">
                      <SelectValue placeholder="Select the region" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRegions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              {/* <h3 className="font-semibold text-lg">Role Access</h3> */}

              <div className="space-y-2 w-full">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="bg-gray-50 w-full dark:bg-gray-900">
                    <SelectValue placeholder="Select the role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role._id} value={role._id}>
                        {role.displayName || role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manualPermissions"
                  checked={manualPermissions}
                  onCheckedChange={(checked) => setManualPermissions(checked as boolean)}
                />
                <Label htmlFor="manualPermissions" className="font-normal cursor-pointer">
                  Manually select permissions
                </Label>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleNext}>
                {manualPermissions ? "Next" : "Finish"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Permissions */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Role</h3>
                <div className="mt-2 p-4 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-900">
                    {selectedRole?.displayName || selectedRole?.name}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Permissions</h3>
                <div className="space-y-2 border rounded-lg p-4 max-h-[400px] overflow-y-auto">
                  {permissions.map((permission) => {
                    const isRolePermission = selectedRole?.permissions.includes(permission);
                    const isSelected = formData.permissions?.includes(permission);

                    return (
                      <div
                        key={permission}
                        className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                      >
                        <Checkbox
                          id={permission}
                          checked={isSelected}
                          // disabled={isRolePermission}
                          onCheckedChange={() => handlePermissionToggle(permission)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={permission}
                            className="font-medium cursor-pointer"
                          >
                            {permission}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {permission.split('_').join(' ')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="backToManual"
                  checked={!manualPermissions}
                  onCheckedChange={(checked) => setManualPermissions(!checked)}
                />
                <Label htmlFor="backToManual" className="font-normal cursor-pointer">
                  Use role default permissions
                </Label>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Creating..." : "Finish"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
