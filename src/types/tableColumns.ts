export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[]; // Array of permission IDs
  userCount: number;
  created_at: string;
  updated_at: string;
}

export type RequestStatus =
  | "PENDING"
  | "CHECKED"
  | "REVIEWED"
  | "APPROVED"
  | "IN_PROCUREMENT"
  | "PROCURED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "REJECTED"
  | "RETURNED"
  | "SOURCED"
  | "DELIVERED"
  | "IN_PROGRESS"
  | "DRAFT"
  | "SENT"
  | "CONFIRMED"
  | "CANCELLED";

export interface ApprovalRequest {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  department: string;
  initiator: string;
  status: RequestStatus;
  submittedDate: string;
  currentStage: "CHECKER" | "REVIEWER" | "APPROVER";
  priority: "LOW" | "MEDIUM" | "HIGH";
}

export interface ApprovedRequest {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  department: string;
  initiator: string;
  approvedBy: string;
  approvedDate: string;
  procurementStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export interface CheckedRequest {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  department: string;
  initiator: string;
  checkedBy: string;
  checkedDate: string;
  submittedDate: string;
}

export interface ReviewedRequest {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  department: string;
  initiator: string;
  reviewedBy: string;
  reviewedDate: string;
  recommendation: "APPROVE" | "NEEDS_DISCUSSION";
}

export interface Request {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  department: string;
  status: RequestStatus;
  dateSubmitted: string;
  lastUpdated: string;
}

export interface ProcurementHistory {
  id: string;
  poNumber: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  vendorName: string;
  totalAmount: number;
  status: "DELIVERED" | "PENDING_DELIVERY" | "CANCELLED";
  orderedDate: string;
  deliveredDate?: string;
  department: string;
}

export type ProcurementStatus = "PENDING" | "IN_PROGRESS" | "SOURCED" | "DELIVERED";

export interface PendingRequest {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  department: string;
  approvedBy: string;
  approvedDate: string;
  status: ProcurementStatus;
  assignedTo?: string;
}

export type POStatus = "DRAFT" | "SENT" | "CONFIRMED" | "DELIVERED" | "CANCELLED";

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  requestId: string;
  vendorName: string;
  itemName: string;
  quantity: number;
  totalAmount: number;
  status: POStatus;
  createdDate: string;
  deliveryDate?: string;
  createdBy: string;
}
