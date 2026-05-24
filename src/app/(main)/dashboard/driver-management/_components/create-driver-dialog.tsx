"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateDriverMutation, useUpdateDriverMutation } from "@/stores/services/driverApi";
import { useGetRegionsQuery } from "@/stores/services/config";
import { CategoriesRegionResponse } from "@/types/config";

interface Driver {
  _id?: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
  };
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehiclePlateNumber?: string;
  vehicleColor?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  region?: string | { _id: string; name: string };
  assignedBranch?: string;
  employmentType?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  profilePhoto?: string;
  vehiclePhoto?: string;
  driversLicense?: string;
}

interface CreateDriverDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  driver?: Driver | null;
}

export default function CreateDriverDialog({ open, onOpenChange, driver }: CreateDriverDialogProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { data: defaultRegions, isLoading: regionLoading } = useGetRegionsQuery({});
  const availableRegions: CategoriesRegionResponse[] = Array.isArray(defaultRegions?.data) ? defaultRegions.data : [];
  
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",

    // Vehicle Information
    vehicleType: "",
    vehicleModel: "",
    vehiclePlateNumber: "",
    vehicleColor: "",

    // Documents
    licenseNumber: "",
    licenseExpiry: "",

    // Work Information
    region: "",
    assignedBranch: "",
    employmentType: "",

    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [vehiclePhoto, setVehiclePhoto] = useState<File | null>(null);
  const [vehiclePhotoPreview, setVehiclePhotoPreview] = useState<string | null>(null);
  const [driversLicense, setDriversLicense] = useState<File | null>(null);
  const [driversLicensePreview, setDriversLicensePreview] = useState<string | null>(null);

  const [createDriver, { isLoading: isCreating }] = useCreateDriverMutation();
  const [updateDriver, { isLoading: isUpdating }] = useUpdateDriverMutation();

  const isLoading = isCreating || isUpdating;
  const isEditMode = !!driver?._id;

  // Populate form when editing
  useEffect(() => {
    if (driver && open) {
      const regionId = typeof driver.region === 'object' && driver.region?._id 
        ? driver.region._id 
        : typeof driver.region === 'string' 
          ? driver.region 
          : "";

      setFormData({
        fullName: driver.fullName || driver.name || driver.userId?.name || "",
        email: driver.email || driver.userId?.email || "",
        phone: driver.phone || "",
        address: driver.address || "",
        city: driver.city || "",
        state: driver.state || "",
        vehicleType: driver.vehicleType || "",
        vehicleModel: driver.vehicleModel || "",
        vehiclePlateNumber: driver.vehiclePlateNumber || "",
        vehicleColor: driver.vehicleColor || "",
        licenseNumber: driver.licenseNumber || "",
        licenseExpiry: driver.licenseExpiry ? new Date(driver.licenseExpiry).toISOString().split('T')[0] : "",
        region: regionId,
        assignedBranch: driver.assignedBranch || "",
        employmentType: driver.employmentType || "",
        emergencyContactName: driver.emergencyContact?.name || "",
        emergencyContactPhone: driver.emergencyContact?.phone || "",
        emergencyContactRelationship: driver.emergencyContact?.relationship || "",
      });

      // Set existing image previews
      if (driver.profilePhoto) setProfilePhotoPreview(driver.profilePhoto);
      if (driver.vehiclePhoto) setVehiclePhotoPreview(driver.vehiclePhoto);
      if (driver.driversLicense) setDriversLicensePreview(driver.driversLicense);
    }
  }, [driver, open]);

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setStep(1);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        vehicleType: "",
        vehicleModel: "",
        vehiclePlateNumber: "",
        vehicleColor: "",
        licenseNumber: "",
        licenseExpiry: "",
        region: "",
        assignedBranch: "",
        employmentType: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",
      });
      setProfilePhoto(null);
      setProfilePhotoPreview(null);
      setVehiclePhoto(null);
      setVehiclePhotoPreview(null);
      setDriversLicense(null);
      setDriversLicensePreview(null);
    }
  }, [open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "license" | "vehicle") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "profile") {
        setProfilePhoto(file);
        setProfilePhotoPreview(reader.result as string);
      } else if (type === "vehicle") {
        setVehiclePhoto(file);
        setVehiclePhotoPreview(reader.result as string);
      } else {
        setDriversLicense(file);
        setDriversLicensePreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type: "profile" | "license" | "vehicle") => {
    if (type === "profile") {
      setProfilePhoto(null);
      setProfilePhotoPreview(null);
    } else if (type === "vehicle") {
      setVehiclePhoto(null);
      setVehiclePhotoPreview(null);
    } else {
      setDriversLicense(null);
      setDriversLicensePreview(null);
    }
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Valid email is required");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return false;
    }
    if (!formData.city.trim()) {
      toast.error("City is required");
      return false;
    }
    if (!formData.state.trim()) {
      toast.error("State is required");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.vehicleType) {
      toast.error("Vehicle type is required");
      return false;
    }
    if (!formData.vehiclePlateNumber.trim()) {
      toast.error("Vehicle plate number is required");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((step + 1) as 1 | 2 | 3);
  };

  const handleBack = () => {
    setStep((step - 1) as 1 | 2 | 3);
  };

  const handleSubmit = async () => {
    if (!formData.region.trim()) {
      toast.error("Region is required");
      return;
    }
    if (!formData.employmentType) {
      toast.error("Employment type is required");
      return;
    }

    try {
      const submitFormData = new FormData();

      // If updating, add driver ID
      if (isEditMode && driver?._id) {
        submitFormData.append("driverId", driver._id);
      }

      // Basic Information
      submitFormData.append("fullName", formData.fullName.trim());
      submitFormData.append("email", formData.email.trim());
      submitFormData.append("phone", formData.phone.trim());
      submitFormData.append("address", formData.address.trim());
      submitFormData.append("city", formData.city.trim());
      submitFormData.append("state", formData.state.trim());

      // Vehicle Information
      submitFormData.append("vehicleType", formData.vehicleType);
      submitFormData.append("vehiclePlateNumber", formData.vehiclePlateNumber.trim());
      if (formData.vehicleModel.trim()) {
        submitFormData.append("vehicleModel", formData.vehicleModel.trim());
      }
      if (formData.vehicleColor.trim()) {
        submitFormData.append("vehicleColor", formData.vehicleColor.trim());
      }

      // Documents
      if (formData.licenseNumber.trim()) {
        submitFormData.append("licenseNumber", formData.licenseNumber.trim());
      }
      if (formData.licenseExpiry) {
        submitFormData.append("licenseExpiry", formData.licenseExpiry);
      }

      // Work Information
      submitFormData.append("region", formData.region.trim());
      submitFormData.append("employmentType", formData.employmentType);
      if (formData.assignedBranch.trim()) {
        submitFormData.append("assignedBranch", formData.assignedBranch.trim());
      }

      // Emergency Contact
      if (formData.emergencyContactName.trim()) {
        submitFormData.append("emergencyContactName", formData.emergencyContactName.trim());
        submitFormData.append("emergencyContactPhone", formData.emergencyContactPhone.trim());
        submitFormData.append("emergencyContactRelationship", formData.emergencyContactRelationship.trim());
      }

      // Files - Only append if new files are selected (for updates)
      if (profilePhoto) {
        submitFormData.append("profilePhoto", profilePhoto);
      }
      if (vehiclePhoto) {
        submitFormData.append("vehiclePhoto", vehiclePhoto);
      }
      if (driversLicense) {
        submitFormData.append("driversLicense", driversLicense);
      }

      if (isEditMode  && driver?._id) {
        await updateDriver({id: driver?._id, formData:submitFormData}).unwrap();
        toast.success("Driver updated successfully.");
      } else {
        await createDriver(submitFormData).unwrap();
        toast.success("Driver onboarded successfully.");
      }
      onOpenChange();
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'onboard'} driver`);
    }
  };

  const dialogTitle = isEditMode ? "Update Driver" : "Onboard New Driver";
  const submitButtonText = isLoading 
    ? (isEditMode ? "Updating..." : "Onboarding...") 
    : (isEditMode ? "Update Driver" : "Complete Onboarding");
  const stepDescription = isEditMode ? `Step ${step} of 3` : `Step ${step} of 3`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <DialogTitle>{dialogTitle} - {stepDescription}</DialogTitle>
              <DialogDescription>
                {step === 1 && "Enter driver's personal information"}
                {step === 2 && "Enter vehicle and license details"}
                {step === 3 && "Work assignment and emergency contact"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g., Chukwuma Okafor"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="driver@example.com"
                      disabled={isEditMode}
                    />
                    {isEditMode && (
                      <p className="text-xs text-muted-foreground">Email cannot be changed after creation</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 800 000 0000"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Home Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter full address"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g., Lagos"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="e.g., Lagos"
                    />
                  </div>
                </div>

                {/* Profile Photo */}
                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  {profilePhotoPreview ? (
                    <div className="relative h-32 w-32">
                      <img src={profilePhotoPreview} alt="Profile" className="h-full w-full rounded-lg object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => removeImage("profile")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-gray-50">
                      <Upload className="mb-2 h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-500">Click to upload</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "profile")}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleNext}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle & License */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vehicle Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type *</Label>
                    <Select
                      value={formData.vehicleType}
                      onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
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
                    <Label htmlFor="vehiclePlateNumber">Plate Number *</Label>
                    <Input
                      id="vehiclePlateNumber"
                      value={formData.vehiclePlateNumber}
                      onChange={(e) => setFormData({ ...formData, vehiclePlateNumber: e.target.value })}
                      placeholder="e.g., ABC-123-XY"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Model/Brand</Label>
                    <Input
                      id="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                      placeholder="e.g., Honda CG 125"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleColor">Color</Label>
                    <Input
                      id="vehicleColor"
                      value={formData.vehicleColor}
                      onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
                      placeholder="e.g., Black"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Driver's License</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      placeholder="e.g., ABC12345678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseExpiry">Expiry Date</Label>
                    <Input
                      id="licenseExpiry"
                      type="date"
                      value={formData.licenseExpiry}
                      onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>License Document</Label>
                    {driversLicensePreview ? (
                      <div className="relative h-48 w-full">
                        <img
                          src={driversLicensePreview}
                          alt="License"
                          className="h-full w-full rounded-lg border object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => removeImage("license")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-gray-50">
                        <Upload className="mb-2 h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-500">Upload driver's license</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "license")}
                        />
                      </label>
                    )}
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>Vehicle Photo</Label>
                    {vehiclePhotoPreview ? (
                      <div className="relative h-48 w-full">
                        <img
                          src={vehiclePhotoPreview}
                          alt="vehicle"
                          className="h-full w-full rounded-lg border object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => removeImage("vehicle")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-gray-50">
                        <Upload className="mb-2 h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-500">Upload vehicle photo</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "vehicle")}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 3: Work Assignment & Emergency Contact */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Work Assignment</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">Region *</Label>
                    <Select value={formData.region} onValueChange={(e) => setFormData({ ...formData, region: e })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRegions.map((e, i) => (
                          <SelectItem key={i} value={e.id || ""}>
                            {e.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employmentType">Employment Type *</Label>
                    <Select
                      value={formData.employmentType}
                      onValueChange={(value) => setFormData({ ...formData, employmentType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
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

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Emergency Contact</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      placeholder="e.g., Jane Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      placeholder="+234 800 000 0000"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                    <Input
                      id="emergencyContactRelationship"
                      value={formData.emergencyContactRelationship}
                      onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                      placeholder="e.g., Spouse, Sibling, Parent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {submitButtonText}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}