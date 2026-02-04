"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useUpdateDriverMutation, type Driver } from "@/stores/services/driverApi";

interface EditDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Driver;
}

export default function EditDriverDialog({ open, onOpenChange, driver }: EditDriverDialogProps) {
  const [formData, setFormData] = useState({
    fullName: driver.fullName,
    phone: driver.phone,
    address: driver.address,
    city: driver.city,
    state: driver.state,
    vehicleType: driver.vehicleType,
    vehicleModel: driver.vehicleModel || "",
    vehiclePlateNumber: driver.vehiclePlateNumber,
    vehicleColor: driver.vehicleColor || "",
    region: driver.region,
    assignedBranch: driver.assignedBranch || "",
    employmentType: driver.employmentType,
    emergencyContactName: driver.emergencyContact?.name || "",
    emergencyContactPhone: driver.emergencyContact?.phone || "",
    emergencyContactRelationship: driver.emergencyContact?.relationship || "",
  });

  const [updateDriver, { isLoading }] = useUpdateDriverMutation();

  useEffect(() => {
    if (open) {
      setFormData({
        fullName: driver.fullName,
        phone: driver.phone,
        address: driver.address,
        city: driver.city,
        state: driver.state,
        vehicleType: driver.vehicleType,
        vehicleModel: driver.vehicleModel || "",
        vehiclePlateNumber: driver.vehiclePlateNumber,
        vehicleColor: driver.vehicleColor || "",
        region: driver.region,
        assignedBranch: driver.assignedBranch || "",
        employmentType: driver.employmentType,
        emergencyContactName: driver.emergencyContact?.name || "",
        emergencyContactPhone: driver.emergencyContact?.phone || "",
        emergencyContactRelationship: driver.emergencyContact?.relationship || "",
      });
    }
  }, [open, driver]);

  const handleSubmit = async () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    try {
      const submitFormData = new FormData();
      
      submitFormData.append("fullName", formData.fullName.trim());
      submitFormData.append("phone", formData.phone.trim());
      submitFormData.append("address", formData.address.trim());
      submitFormData.append("city", formData.city.trim());
      submitFormData.append("state", formData.state.trim());
      submitFormData.append("vehicleType", formData.vehicleType);
      submitFormData.append("vehiclePlateNumber", formData.vehiclePlateNumber.trim());
      submitFormData.append("region", formData.region.trim());
      submitFormData.append("employmentType", formData.employmentType);
      
      if (formData.vehicleModel.trim()) {
        submitFormData.append("vehicleModel", formData.vehicleModel.trim());
      }
      if (formData.vehicleColor.trim()) {
        submitFormData.append("vehicleColor", formData.vehicleColor.trim());
      }
      if (formData.assignedBranch.trim()) {
        submitFormData.append("assignedBranch", formData.assignedBranch.trim());
      }
      if (formData.emergencyContactName.trim()) {
        submitFormData.append("emergencyContactName", formData.emergencyContactName.trim());
        submitFormData.append("emergencyContactPhone", formData.emergencyContactPhone.trim());
        submitFormData.append("emergencyContactRelationship", formData.emergencyContactRelationship.trim());
      }

      await updateDriver({ id: driver._id, formData: submitFormData }).unwrap();
      toast.success("Driver information updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update driver");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Driver Information</DialogTitle>
          <DialogDescription>Update {driver.fullName}'s details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Email Address</Label>
                <Input value={driver.email} disabled className="bg-gray-50" />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select
                  value={formData.vehicleType}
                  onValueChange={(value: any) => setFormData({ ...formData, vehicleType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="bicycle">Bicycle</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehiclePlateNumber">Plate Number</Label>
                <Input
                  id="vehiclePlateNumber"
                  value={formData.vehiclePlateNumber}
                  onChange={(e) => setFormData({ ...formData, vehiclePlateNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleModel">Model</Label>
                <Input
                  id="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleColor">Color</Label>
                <Input
                  id="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Work Assignment */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Work Assignment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedBranch">Assigned Branch</Label>
                <Input
                  id="assignedBranch"
                  value={formData.assignedBranch}
                  onChange={(e) => setFormData({ ...formData, assignedBranch: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value: any) => setFormData({ ...formData, employmentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Emergency Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                <Input
                  id="emergencyContactRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                />
              </div>
            </div>
          </div>
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
