import { BaseResponse } from "../api/types";
import { User } from "../types";

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


export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
