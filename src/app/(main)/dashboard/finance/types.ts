interface BudgetCategory {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
}

interface MonthlyExpenditure {
  month: string;
  amount: number;
}

interface PendingPayment {
  id: string;
  poNumber: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  vendorName: string;
  totalAmount: number;
  department: string;
  procuredDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  daysWaiting: number;
}

interface ProcessedPayment {
  id: string;
  poNumber: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  vendorName: string;
  totalAmount: number;
  department: string;
  procuredDate: string;
  paidDate: string;
  processedBy: string;
  paymentMethod: "BANK_TRANSFER" | "CHEQUE" | "CASH";
  referenceNumber: string;
}
