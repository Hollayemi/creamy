export enum UserRole {
  INITIATOR = "INITIATOR",
  CHECKER = "CHECKER",
  REVIEWER = "REVIEWER",
  APPROVER = "APPROVER",
  PROCUREMENT = "PROCUREMENT",
  FINANCE_ADMIN = "FINANCE_ADMIN",
  ADMIN = "ADMIN",
}

export enum RequestStatus {
  PENDING = "PENDING",
  CHECKED = "CHECKED",
  REVIEWED = "REVIEWED",
  APPROVED = "APPROVED",
  IN_PROCUREMENT = "IN_PROCUREMENT",
  PROCURED = "PROCURED",
  PAYMENT_PENDING = "PAYMENT_PENDING",
  PAID = "PAID",
  REJECTED = "REJECTED",
  RETURNED = "RETURNED",
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Request {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  department: string;
  purpose: string;
  justification?: string;
  status: RequestStatus;
  initiatorId: string;
  initiator: User;
  checkerId?: string;
  checker?: User;
  reviewerId?: string;
  reviewer?: User;
  approverId?: string;
  approver?: User;
  documents: Document[];
  comments: Comment[];
  auditTrail: AuditLog[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  requestId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  category: "JUSTIFICATION" | "INVOICE" | "RECEIPT" | "PO" | "OTHER";
  createdAt: string;
}

export interface Comment {
  id: string;
  requestId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  requestId?: string;
  userId: string;
  user: User;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  requestId: string;
  request: Request;
  vendorId: string;
  vendor: Vendor;
  items: POItem[];
  totalAmount: number;
  status: "DRAFT" | "SENT" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
  deliveryDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface POItem {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  productCategories: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  requestId: string;
  purchaseOrderId: string;
  amount: number;
  paymentMethod: string;
  referenceNumber: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  inProcurement: number;
  paidRequests: number;
  totalExpenditure: number;
  monthlyExpenditure: number;
  budgetUtilization: number;
  requestsByDepartment: DepartmentStat[];
  monthlyTrends: MonthlyTrend[];
}

export interface DepartmentStat {
  department: string;
  count: number;
  totalAmount: number;
}

export interface MonthlyTrend {
  month: string;
  requests: number;
  expenditure: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  isRead: boolean;
  relatedRequestId?: string;
  createdAt: string;
}
