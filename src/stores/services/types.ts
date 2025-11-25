import { BaseResponse } from "../api/types";
import { User } from "../types";


// Types for User Management
export interface UserInfo {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  role: string | null;
  email_verified_at: string | null;
  status: "Active" | "Inactive";
  state_office_department: {
    id: number;
    status: string;
    notes: string;
    state_office: {
      id: number;
      name: string;
      code: string;
      description: string;
      state_id: number;
      zone_id: number | null;
      status: string;
      office_manager_id: number | null;
      address: string;
      phone: string;
      email: string;
      website: string | null;
      state: {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
      };
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
    department: {
      id: number;
      name: string;
      code: string;
      description: string;
      status: string;
      head_of_department_id: number | null;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  can_load_more: boolean;
}

export interface UsersListResponse {
  message: string;
  data: {
    pagination_meta: PaginationMeta;
    data: User[];
  };
}

export interface CreateUserInput {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  state_office_department_id: number;
  user_access: string;
  password?: string;
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  state_office_department_id?: number;
  user_access?: string;
}

export interface GetUsersParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: "Active" | "Inactive";
  department_id?: number;
  state_office_id?: number;
}


export interface ApprovalAction {
  requestId: string;
  action: "APPROVE" | "REJECT" | "RETURN";
  comments?: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}

export type LoginResponse = BaseResponse<{
  user: User;
  token: string;
}>;

export type ForgotPasswordResponse = BaseResponse;

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UploadDocumentInput {
  requestId: string;
  file: File;
  category: "JUSTIFICATION" | "INVOICE" | "RECEIPT" | "PO" | "OTHER";
}

export interface CreateUserInput {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  state_office_department_id: number;
  user_access: string;
  password?: string;
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  state_office_department_id?: number;
  user_access?: string;
}

export interface GetUsersParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: "Active" | "Inactive";
  department_id?: number;
  state_office_id?: number;
}


export interface ProcessPaymentInput {
  requestId: string;
  purchaseOrderId: string;
  amount: number;
  paymentMethod: string;
  referenceNumber: string;
}

export interface BudgetData {
  totalBudget: number;
  spent: number;
  available: number;
  categoryBreakdown: Array<{
    category: string;
    allocated: number;
    spent: number;
  }>;
}

export interface CreatePOInput {
  requestId: string;
  vendorId: string;
  items: Array<{
    itemName: string;
    quantity: number;
    unitPrice: number;
  }>;
  deliveryDate?: string;
}

export interface ReportParams {
  startDate?: string;
  endDate?: string;
  department?: string;
  status?: string;
}

export interface ReportData {
  summary: {
    totalRequests: number;
    totalExpenditure: number;
    averageProcessingTime: number;
  };
  departmentBreakdown: Array<{
    department: string;
    requests: number;
    expenditure: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    requests: number;
    expenditure: number;
  }>;
}

export interface CreateRequestInput {
  itemName: string;
  quantity: number;
  department: string;
  purpose: string;
  justification?: string;
}

export interface UpdateRequestInput extends Partial<CreateRequestInput> {
  id: string;
}

export interface GetRequestsParams {
  status?: string;
  department?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
