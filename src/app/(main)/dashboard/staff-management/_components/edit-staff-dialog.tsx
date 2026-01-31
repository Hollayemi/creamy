"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  useUpdateStaffRoleMutation,
  useGetRolesQuery,
  type Staff,
} from "@/stores/services/staffApi";

interface EditStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff;
}

export default function EditStaffDialog({ open, onOpenChange, staff }: EditStaffDialogProps) {
  const [selectedRole, setSelectedRole] = useState(staff.role);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [manualPermissions, setManualPermissions] = useState(false);

  const { data: rolesResponse } = useGetRolesQuery();
  const [updateStaffRole, { isLoading }] = useUpdateStaffRoleMutation();

  const roles = rolesResponse?.data || [];

  const currentRole = roles.find((r) => r._id === selectedRole);

  useEffect(() => {

    if(selectedRole){
      const rolePermissions = roles.find(role => role._id === selectedRole)?.permissions || [];
      setPermissions(rolePermissions);
    }
   
  }, [roles, selectedRole]);

  useEffect(() => {
    if (open) {
      setSelectedRole(staff.role);
      setSelectedPermissions([]);
      setManualPermissions(false);
    }
    
      const rolePermissions = roles.find(role => role._id === staff.role)?.permissions || [];
      setPermissions(rolePermissions);
      setSelectedPermissions(rolePermissions);
      
    }, [open, staff, roles, selectedRole]);
    
    console.log( {permissions});
  const handlePermissionToggle = (permissionId: string) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    try {
      await updateStaffRole({
        id: staff._id,
        roleId: selectedRole,
        permissions: manualPermissions ? selectedPermissions : undefined,
      }).unwrap();

      toast.success("Staff role and permissions updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update staff role");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role & Permissions</DialogTitle>
          <DialogDescription>
            Update {staff.fullName}'s role and permissions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current User Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-muted-foreground">Editing permissions for</p>
            <p className="font-semibold text-lg">{staff.fullName}</p>
            <p className="text-sm text-muted-foreground">{staff.email}</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
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

          {/* Manual Permissions Toggle */}
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

          {/* Permissions List */}
          {manualPermissions && (
            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto space-y-2">
                {permissions.map((permission) => {
                  const isRolePermission = currentRole?.permissions.includes(permission);
                  const isSelected = selectedPermissions.includes(permission);

                  return (
                    <div
                      key={permission}
                      className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <Checkbox
                        id={`edit-${permission}`}
                        checked={isSelected}
                        // disabled={isRolePermission}
                        onCheckedChange={() => handlePermissionToggle(permission)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={`edit-${permission}`}
                          className="font-medium cursor-pointer"
                        >
                          {permission}
                          {isRolePermission && (
                            <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                              From Role
                            </span>
                          )}
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
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
