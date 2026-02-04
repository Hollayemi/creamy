# Driver Management System - Complete Documentation

## 📋 Overview

A comprehensive driver onboarding and management system for delivery personnel with email-based password setup, verification workflow, and account management features.

## 🎯 Key Features

### Core Features
- ✅ **Driver Onboarding** - Multi-step registration process
- ✅ **Email-Based Password Setup** - No password collection during registration
- ✅ **Verification Workflow** - Approve or reject driver applications
- ✅ **Account Management**:
  - Suspend Driver (temporary block)
  - Disable Driver (permanent revocation)
  - Resend Password Setup Link
- ✅ **Activity Logging** - Track all driver actions
- ✅ **Document Upload** - Profile photo and driver's license
- ✅ **Vehicle Information** - Complete vehicle details
- ✅ **Emergency Contact** - Store emergency contact information
- ✅ **Search & Filter** - By status, region, vehicle type
- ✅ **Export Data** - Export driver list to CSV/Excel

## 📦 Files Included (10 files)

### API Service
1. **driverApi.ts** - Complete RTK Query API service

### Main Component  
2. **driver-management-page.tsx** - Main dashboard page

### Dialog Components
3. **create-driver-dialog.tsx** - 3-step onboarding form
4. **edit-driver-dialog.tsx** - Edit driver information
5. **driver-activity-logs-drawer.tsx** - Activity timeline
6. **resend-password-link-dialog.tsx** - Resend password setup email
7. **verify-driver-dialog.tsx** - Verify/Reject driver application
8. **suspend-driver-dialog.tsx** - Temporary suspension
9. **disable-driver-dialog.tsx** - Permanent disablement

### Configuration
10. **baseApi.ts** - Updated with Driver tags

## 🔌 API ENDPOINTS

### Driver CRUD
```
GET    /api/v1/drivers                    # Get all drivers (with filters)
GET    /api/v1/drivers/:id                # Get driver by ID
POST   /api/v1/drivers                    # Create new driver (FormData)
PUT    /api/v1/drivers/:id                # Update driver (FormData)
DELETE /api/v1/drivers/:id                # Delete driver
```

### Account Actions
```
POST   /api/v1/drivers/:id/suspend        # Suspend driver
POST   /api/v1/drivers/:id/unsuspend      # Unsuspend driver
POST   /api/v1/drivers/:id/disable        # Disable driver
POST   /api/v1/drivers/:id/enable         # Enable driver
```

### Password Setup
```
POST   /api/v1/drivers/:id/resend-password-link  # Resend setup link
```

### Verification
```
POST   /api/v1/drivers/:id/verify         # Verify driver
POST   /api/v1/drivers/:id/reject         # Reject driver
```

### Activity Logs
```
GET    /api/v1/driver-activity-logs       # Get all logs (filtered)
GET    /api/v1/drivers/:id/activity-logs  # Get driver's logs
```

## 📤 REQUEST FORMATS

### 1. Create Driver (Onboarding)
**Endpoint:** `POST /api/v1/drivers`  
**Content-Type:** `multipart/form-data`

```javascript
const formData = new FormData();

// Basic Information (Required)
formData.append("fullName", "Chukwuma Okafor");
formData.append("email", "driver@example.com");
formData.append("phone", "+234 800 123 4567");
formData.append("address", "15 Lagos Street, Ikeja");
formData.append("city", "Lagos");
formData.append("state", "Lagos");

// Optional Basic Info
formData.append("dateOfBirth", "1990-05-15");

// Vehicle Information (Required)
formData.append("vehicleType", "motorcycle"); // motorcycle, bicycle, car, van, truck
formData.append("vehiclePlateNumber", "ABC-123-XY");

// Optional Vehicle Info
formData.append("vehicleModel", "Honda CG 125");
formData.append("vehicleColor", "Black");

// Work Assignment (Required)
formData.append("region", "Lagos Mainland");
formData.append("employmentType", "full-time"); // full-time, part-time, contract

// Optional Work Info
formData.append("assignedBranch", "Ikeja Hub");

// Documents (Optional)
formData.append("licenseNumber", "ABC12345678");
formData.append("licenseExpiry", "2027-12-31");

// Emergency Contact (Optional)
formData.append("emergencyContactName", "Jane Doe");
formData.append("emergencyContactPhone", "+234 800 999 8888");
formData.append("emergencyContactRelationship", "Spouse");

// File Uploads (Optional)
formData.append("profilePhoto", profilePhotoFile); // File object
formData.append("driversLicense", licensePhotoFile); // File object
```

### 2. Update Driver
**Endpoint:** `PUT /api/v1/drivers/:id`  
**Content-Type:** `multipart/form-data`

Same format as create, but all fields are optional except those you want to update.

### 3. Suspend Driver
**Endpoint:** `POST /api/v1/drivers/:id/suspend`

```json
{
  "reason": "Safety violation - speeding complaints",
  "duration": 7,
  "notifyDriver": true
}
```

### 4. Disable Driver
**Endpoint:** `POST /api/v1/drivers/:id/disable`

```json
{
  "reason": "Contract terminated - performance issues",
  "notifyDriver": true
}
```

### 5. Verify Driver
**Endpoint:** `POST /api/v1/drivers/:id/verify`

```json
{
  "notes": "All documents verified. Ready to start deliveries."
}
```

### 6. Reject Driver
**Endpoint:** `POST /api/v1/drivers/:id/reject`

```json
{
  "reason": "Incomplete documentation - driver's license expired"
}
```

### 7. Resend Password Link
**Endpoint:** `POST /api/v1/drivers/:id/resend-password-link`

```json
{}
```

## 📥 RESPONSE FORMATS

### 1. Get All Drivers
**Endpoint:** `GET /api/v1/drivers?search=john&status=active&page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "message": "Drivers retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "Chukwuma Okafor",
      "email": "chukwuma.okafor@example.com",
      "phone": "+234 800 123 4567",
      
      "vehicleType": "motorcycle",
      "vehicleModel": "Honda CG 125",
      "vehiclePlateNumber": "ABC-123-XY",
      "vehicleColor": "Black",
      
      "address": "15 Lagos Street, Ikeja",
      "city": "Lagos",
      "state": "Lagos",
      
      "region": "Lagos Mainland",
      "assignedBranch": "Ikeja Hub",
      "employmentType": "full-time",
      
      "status": "active",
      "verificationStatus": "verified",
      "hasSetPassword": true,
      "isOnline": false,
      
      "profilePhoto": "https://api.gokart.ng/uploads/drivers/photo123.jpg",
      "driversLicense": "https://api.gokart.ng/uploads/drivers/license123.jpg",
      "licenseNumber": "ABC12345678",
      "licenseExpiry": "2027-12-31",
      
      "emergencyContact": {
        "name": "Jane Doe",
        "phone": "+234 800 999 8888",
        "relationship": "Spouse"
      },
      
      "totalDeliveries": 145,
      "completedDeliveries": 142,
      "rating": 4.8,
      
      "joinedDate": "2025-01-15T10:00:00Z",
      "lastActive": "2025-01-28T14:30:00Z",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-28T14:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 2. Create Driver Success
**Response:**
```json
{
  "success": true,
  "message": "Driver onboarded successfully. Password setup link sent to email.",
  "data": {
    "_id": "507f1f77bcf86cd799439030",
    "fullName": "Chukwuma Okafor",
    "email": "chukwuma.okafor@example.com",
    "phone": "+234 800 123 4567",
    "status": "pending",
    "verificationStatus": "pending",
    "hasSetPassword": false,
    "passwordSetupToken": "abc123xyz...",
    "passwordSetupExpiry": "2025-01-29T10:00:00Z",
    "joinedDate": "2025-01-28T10:00:00Z",
    "createdAt": "2025-01-28T10:00:00Z",
    "updatedAt": "2025-01-28T10:00:00Z"
  }
}
```

### 3. Resend Password Link Success
**Response:**
```json
{
  "success": true,
  "message": "Password setup link sent successfully",
  "data": {
    "email": "chukwuma.okafor@example.com",
    "tokenExpiry": "2025-01-29T15:00:00Z"
  }
}
```

### 4. Verify Driver Success
**Response:**
```json
{
  "success": true,
  "message": "Driver verified successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439030",
    "verificationStatus": "verified",
    "status": "active",
    "verifiedAt": "2025-01-28T16:00:00Z"
  }
}
```

## 📊 Driver Status Values

- `pending` - Awaiting verification
- `active` - Verified and can accept deliveries
- `suspended` - Temporarily blocked
- `disabled` - Permanently blocked
- `on-delivery` - Currently on a delivery

## 📊 Verification Status Values

- `pending` - Awaiting admin verification
- `verified` - Approved by admin
- `rejected` - Rejected by admin

## 🎯 Onboarding Flow

### Step 1: Admin Creates Driver Account
1. Admin fills out driver information (3-step form)
2. Admin uploads documents (optional)
3. System creates driver account with `status: pending`
4. System sends password setup email to driver

### Step 2: Driver Sets Password
1. Driver receives email with setup link
2. Driver clicks link (valid for 24 hours)
3. Driver creates password
4. `hasSetPassword` becomes `true`

### Step 3: Admin Verifies Driver
1. Admin reviews driver information
2. Admin checks uploaded documents
3. Admin either:
   - **Verifies**: `verificationStatus: verified`, `status: active`
   - **Rejects**: `verificationStatus: rejected`, email sent to driver

### Step 4: Driver Starts Working
1. Driver can now log in
2. Driver can accept deliveries
3. Activity is logged

## 🔐 Important Backend Rules

### 1. Password Handling
- **Never** collect password during registration
- Generate secure random token for password setup
- Token valid for 24 hours
- Send email with setup link: `https://driver.gokart.ng/setup-password?token=xxx`
- Hash password with bcrypt when driver sets it
- Invalidate token after password is set

### 2. Email Notifications
Send emails for:
- Password setup (on registration)
- Password setup resend (on request)
- Verification approved
- Verification rejected (with reason)
- Account suspended (with reason)
- Account disabled (with reason)

### 3. Session Management
- Invalidate all sessions on suspend/disable
- Log out driver immediately
- Clear JWT tokens

### 4. File Uploads
- Accept profile photo (max 5MB)
- Accept driver's license photo (max 5MB)
- Store in cloud storage (S3, Cloudinary, etc.)
- Return public URLs in response

### 5. Activity Logging
Log all driver actions:
- Registration
- Password setup
- Login/Logout
- Verification status changes
- Suspension/Disablement
- Information updates
- Deliveries (accepted, completed, cancelled)

## 📝 Database Schema Suggestion

```javascript
{
  _id: ObjectId,
  
  // Basic Information
  fullName: String,
  email: String (unique, indexed),
  phone: String,
  address: String,
  city: String,
  state: String,
  dateOfBirth: Date,
  
  // Vehicle Information
  vehicleType: Enum['motorcycle', 'bicycle', 'car', 'van', 'truck'],
  vehicleModel: String,
  vehiclePlateNumber: String (indexed),
  vehicleColor: String,
  
  // Documents
  profilePhoto: String (URL),
  driversLicense: String (URL),
  licenseNumber: String,
  licenseExpiry: Date,
  
  // Work Information
  region: String,
  assignedBranch: String,
  employmentType: Enum['full-time', 'part-time', 'contract'],
  
  // Status & Verification
  status: Enum['pending', 'active', 'suspended', 'disabled', 'on-delivery'],
  verificationStatus: Enum['pending', 'verified', 'rejected'],
  isOnline: Boolean,
  verifiedAt: Date,
  verifiedBy: ObjectId (ref: 'Staff'),
  rejectionReason: String,
  
  // Password Setup
  password: String (hashed),
  hasSetPassword: Boolean,
  passwordSetupToken: String,
  passwordSetupExpiry: Date,
  
  // Emergency Contact
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  
  // Suspension/Disablement
  suspendedAt: Date,
  suspendedUntil: Date,
  suspensionReason: String,
  disabledAt: Date,
  disablementReason: String,
  
  // Statistics
  totalDeliveries: Number,
  completedDeliveries: Number,
  cancelledDeliveries: Number,
  rating: Number,
  
  // Timestamps
  joinedDate: Date,
  lastActive: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Installation

Same as Staff Management system. See STAFF_README.md for details.

Additional shadcn/ui components needed:
```bash
npx shadcn-ui@latest add alert-dialog
```

## 🎨 Customization

### Change Vehicle Types
```typescript
// In create-driver-dialog.tsx
<SelectContent>
  <SelectItem value="motorcycle">Motorcycle</SelectItem>
  <SelectItem value="scooter">Scooter</SelectItem>
  <SelectItem value="bicycle">Bicycle</SelectItem>
  // Add more...
</SelectContent>
```

### Add Custom Fields
```typescript
// Add to create-driver-dialog.tsx
<div className="space-y-2">
  <Label htmlFor="idNumber">National ID Number</Label>
  <Input
    id="idNumber"
    value={formData.idNumber}
    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
  />
</div>
```

## 🆚 Differences from Staff Management

| Feature | Staff Management | Driver Management |
|---------|-----------------|-------------------|
| Password | Collected during registration | Email link for setup |
| Verification | None | Required approval workflow |
| Documents | None | License & photo uploads |
| Vehicle Info | None | Required |
| Emergency Contact | None | Optional |
| Onboarding Steps | 2 steps | 3 steps |
| Status Values | active, suspended, disabled, running | pending, active, suspended, disabled, on-delivery |

## 📧 Email Templates Needed

### 1. Password Setup Email
```
Subject: Set up your GoKart Driver account

Hi {fullName},

Welcome to GoKart! Your driver account has been created.

Please click the link below to set up your password:
{passwordSetupLink}

This link will expire in 24 hours.

If you didn't expect this email, please ignore it.

Best regards,
The GoKart Team
```

### 2. Verification Approved Email
```
Subject: Your driver account has been verified!

Hi {fullName},

Great news! Your driver account has been verified and approved.

You can now log in and start accepting deliveries.

Login here: https://driver.gokart.ng/login

Best regards,
The GoKart Team
```

### 3. Verification Rejected Email
```
Subject: Driver account verification update

Hi {fullName},

Unfortunately, we were unable to verify your driver account at this time.

Reason: {rejectionReason}

Please contact support if you have questions.

Best regards,
The GoKart Team
```

---

**This system provides a complete driver onboarding and management solution with email-based password setup and verification workflow.**
