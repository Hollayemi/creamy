import { baseApi } from "../baseApi";
import type { BaseResponse } from "../api/types";
import { CategoriesRegionResponse } from "@/types/config";

export interface Region {
    _id: string;
    name: string;
  }; 
export interface AvailableDriver {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string | null;
  vehicleType: string;
  vehiclePlateNumber: string;
  vehicleModel?: string;
  region: Region;
  rating: number;
  totalDeliveries: number;
  completedDeliveries: number;
  isOnline: boolean;
  status: string;
}

// Types
export interface Driver {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  vehicleType: "motorcycle" | "bicycle" | "car" | "van" | "truck";
  vehicleModel?: string;
  vehiclePlateNumber: string;
  vehicleColor?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  driversLicense?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  profilePhoto?: string;
  region: Region;
  assignedBranch?: string;
  employmentType: "full-time" | "part-time" | "contract";
  status: "active" | "suspended" | "disabled" | "pending" | "on-delivery";
  verificationStatus: "pending" | "verified" | "rejected";
  isOnline?: boolean;
  hasSetPassword: boolean;
  passwordSetupToken?: string;
  passwordSetupExpiry?: string;
  joinedDate: string;
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
  totalDeliveries?: number;
  completedDeliveries?: number;
  rating?: number;
}

export interface AllDriversResponse {
  drivers: Driver[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DriverActivityLog {
  _id: string;
  driverId: string;
  driverName: string;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
}

export interface CreateDriverInput {
  fullName: string;
  email: string;
  phone: string;
  vehicleType: "motorcycle" | "bicycle" | "car" | "van" | "truck";
  vehicleModel?: string;
  vehiclePlateNumber: string;
  vehicleColor?: string;
  address: string;
  city: string;
  state: string;
  dateOfBirth?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  region: string;
  assignedBranch?: string;
  employmentType: "full-time" | "part-time" | "contract";
}

export interface UpdateDriverInput {
  fullName?: string;
  phone?: string;
  vehicleType?: "motorcycle" | "bicycle" | "car" | "van" | "truck";
  vehicleModel?: string;
  vehiclePlateNumber?: string;
  vehicleColor?: string;
  address?: string;
  city?: string;
  state?: string;
  region?: string;
  assignedBranch?: string;
  employmentType?: "full-time" | "part-time" | "contract";
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
}

export interface SuspendDriverInput {
  reason: string;
  duration?: number;
  notifyDriver?: boolean;
}

export interface DisableDriverInput {
  reason: string;
  notifyDriver?: boolean;
}

export interface PickupLocation {
  address: string;
  lat: number;
  lng: number;
  contactName?: string;
  contactPhone?: string;
}

export interface DeliveryLocation {
  address: string;
  lat: number;
  lng: number;
  contactName: string;
  contactPhone: string;
}

export interface Pickup {
  _id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicleType: string;
  vehiclePlateNumber: string;
  pickupLocation: PickupLocation;
  deliveryLocation: DeliveryLocation;
  distance?: number;
  scheduledPickupTime?: string;
  actualPickupTime?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  duration?: number;
  status: "pending" | "assigned" | "picked-up" | "in-transit" | "delivered" | "cancelled" | "failed";
  priority: "low" | "normal" | "high" | "urgent";
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "cod";
  currentLocation?: {
    lat: number;
    lng: number;
    timestamp: string;
  };
  trackingHistory: Array<{
    status: string;
    location?: { lat: number; lng: number };
    timestamp: string;
    note?: string;
  }>;
  deliveryInstructions?: string;
  proofOfDelivery?: {
    signature?: string;
    photo?: string;
    recipientName?: string;
    timestamp?: string;
  };
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverPickupsResponse {
  pickups: Pickup[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DriverPickupStats {
  driverId: string;
  driverName: string;
  ongoing: number;
  completed: number;
  cancelled: number;
  totalDistance: number;
  averageRating: number;
  totalEarnings: number;
}

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get available drivers for assignment
    getAvailableDrivers: builder.query<
      BaseResponse<{ drivers: AvailableDriver[]; total: number }>,
      { region?: string; search?: string } | void
    >({
      query: (params) => ({
        url: "/drivers/available",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: [{ type: "Drivers", id: "AVAILABLE" }],
    }),

    getAllDrivers: builder.query<
      BaseResponse<AllDriversResponse>,
      {
        status?: string;
        region?: string;
        search?: string;
        page?: number;
        limit?: number;
        vehicleType?: string;
        employmentType?: string;
      }
    >({
      query: (params) => ({
        url: "/drivers",
        method: "GET",
        params,
      }),
      providesTags: ["Drivers"],
    }),

    getDriverById: builder.query<BaseResponse<Driver>, string>({
      query: (id) => ({
        url: `/drivers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Drivers", id }],
    }),

    createDriver: builder.mutation<BaseResponse<Driver>, FormData>({
      query: (formData) => ({
        url: "/drivers",
        method: "POST",
        data: formData,
        isFormData: true,
      }),
      invalidatesTags: ["Drivers", "DriverActivityLogs"],
    }),

    updateDriver: builder.mutation<BaseResponse<Driver>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/drivers/${id}`,
        method: "PUT",
        data: formData,
        isFormData: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Drivers", id }, "Drivers", "DriverActivityLogs"],
    }),

    deleteDriver: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/drivers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Drivers", "DriverActivityLogs"],
    }),

    suspendDriver: builder.mutation<BaseResponse, { id: string; data: SuspendDriverInput }>({
      query: ({ id, data }) => ({
        url: `/drivers/${id}/suspend`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Drivers", id }, "Drivers", "DriverActivityLogs"],
    }),

    unsuspendDriver: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/drivers/${id}/unsuspend`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Drivers", id }, "Drivers", "DriverActivityLogs"],
    }),

    disableDriver: builder.mutation<BaseResponse, { id: string; data: DisableDriverInput }>({
      query: ({ id, data }) => ({
        url: `/drivers/${id}/disable`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Drivers", id }, "Drivers", "DriverActivityLogs"],
    }),

    enableDriver: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/drivers/${id}/enable`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Drivers", id }, "Drivers", "DriverActivityLogs"],
    }),

    resendPasswordSetupLink: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/drivers/${id}/resend-password-link`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Drivers", id }, "DriverActivityLogs"],
    }),

    verifyDriver: builder.mutation<BaseResponse, { id: string; notes?: string }>({
      query: ({ id, notes }) => ({
        url: `/drivers/${id}/verify`,
        method: "POST",
        data: { notes },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Drivers", id }, "Drivers", "DriverActivityLogs"],
    }),

    rejectDriver: builder.mutation<BaseResponse, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/drivers/${id}/reject`,
        method: "POST",
        data: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Drivers", id }, "Drivers", "DriverActivityLogs"],
    }),

    getDriverActivityLogs: builder.query<
      BaseResponse<{ logs: DriverActivityLog[]; pagination: any }>,
      { driverId?: string; action?: string; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/driver-activity-logs",
        method: "GET",
        params,
      }),
      providesTags: ["DriverActivityLogs"],
    }),

    getDriverActivityLogsById: builder.query<BaseResponse<{ logs: DriverActivityLog[]; pagination: any }>, string>({
      query: (driverId) => ({
        url: `/drivers/${driverId}/activity-logs`,
        method: "GET",
      }),
      providesTags: (result, error, driverId) => [{ type: "DriverActivityLogs", id: driverId }],
    }),

    bulkSuspendDrivers: builder.mutation<BaseResponse, { ids: string[]; reason: string; notifyUser: boolean }>({
      query: (data) => ({
        url: "/drivers/bulk/suspend",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Drivers", "DriverActivityLogs"],
    }),

    bulkDeleteDrivers: builder.mutation<BaseResponse, string[]>({
      query: (ids) => ({
        url: "/drivers/bulk/delete",
        method: "DELETE",
        data: { ids },
      }),
      invalidatesTags: ["Drivers", "DriverActivityLogs"],
    }),

    exportDrivers: builder.mutation<Blob, { format: "csv" | "excel"; filters?: any }>({
      query: ({ format, filters }) => ({
        url: `/drivers/export/${format}`,
        method: "POST",
        data: filters,
        responseType: "blob",
      }),
    }),

    getDriverPickups: builder.query<
      BaseResponse<Pickup[]>,
      { driverId: string; status?: string; page?: number; limit?: number }
    >({
      query: ({ driverId, ...params }) => ({
        url: `/drivers/${driverId}/pickups`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { driverId }) => [{ type: "DriverPickups", id: driverId }],
    }),

    getDriverOngoingPickups: builder.query<BaseResponse<Pickup[]>, string>({
      query: (driverId) => ({
        url: `/drivers/orders/active`,
        method: "GET",
      }),
      providesTags: (result, error, driverId) => [{ type: "DriverPickups", id: `${driverId}-ongoing` }],
    }),

    getDriverPickupHistory: builder.query<
      BaseResponse<DriverPickupsResponse>,
      { driverId: string; page?: number; limit?: number }
    >({
      query: ({ driverId, page = 1, limit = 20 }) => ({
        url: `/drivers/${driverId}/pickups/history`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result, error, { driverId }) => [{ type: "DriverPickups", id: `${driverId}-history` }],
    }),

    getDriverPickupStats: builder.query<BaseResponse<DriverPickupStats>, string>({
      query: (driverId) => ({
        url: `/drivers/${driverId}/pickups/stats`,
        method: "GET",
      }),
      providesTags: (result, error, driverId) => [{ type: "DriverPickups", id: `${driverId}-stats` }],
    }),

    getPickupById: builder.query<BaseResponse<Pickup>, string>({
      query: (pickupId) => ({
        url: `/pickups/${pickupId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Pickups", id }],
    }),

    reassignPickup: builder.mutation<BaseResponse<Pickup>, { pickupId: string; newDriverId: string; reason?: string }>({
      query: ({ pickupId, newDriverId, reason }) => ({
        url: `/pickups/${pickupId}/reassign`,
        method: "POST",
        data: { newDriverId, reason },
      }),
      invalidatesTags: ["DriverPickups", "Pickups"],
    }),

    cancelPickup: builder.mutation<BaseResponse, { pickupId: string; reason: string }>({
      query: ({ pickupId, reason }) => ({
        url: `/pickups/${pickupId}/cancel`,
        method: "POST",
        data: { reason },
      }),
      invalidatesTags: ["DriverPickups", "Pickups"],
    }),
  }),
});

export const {
  useGetAvailableDriversQuery,
  useGetAllDriversQuery,
  useGetDriverByIdQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
  useSuspendDriverMutation,
  useUnsuspendDriverMutation,
  useDisableDriverMutation,
  useEnableDriverMutation,
  useResendPasswordSetupLinkMutation,
  useVerifyDriverMutation,
  useRejectDriverMutation,
  useGetDriverActivityLogsQuery,
  useGetDriverActivityLogsByIdQuery,
  useBulkSuspendDriversMutation,
  useBulkDeleteDriversMutation,
  useExportDriversMutation,
  useGetDriverPickupsQuery,
  useGetDriverOngoingPickupsQuery,
  useGetDriverPickupHistoryQuery,
  useGetDriverPickupStatsQuery,
  useGetPickupByIdQuery,
  useReassignPickupMutation,
  useCancelPickupMutation,
} = driverApi;
