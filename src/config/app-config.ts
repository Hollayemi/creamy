import { RequestStatus } from "@/types/tableColumns";
import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "GO-KART Dashboard",
  version: packageJson.version,
  icon: "/images/logo/logo2x.png",
  copyright: `© ${currentYear}, GO-KART ADMIN DASHBOARD.`,
  meta: {
    title: "GO-KART | ADMIN DASHBOARD",
    description:
      "A centralized platform for the GO-KART ADMIN DASHBOARD that Maintain and Manage all product and order activities efficiently.",
  },
};

export const statusColors: Record<RequestStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CHECKED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  REVIEWED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  IN_PROCUREMENT: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PROCURED: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  PAYMENT_PENDING: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  PAID: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  RETURNED: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
  SOURCED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  SENT: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  CONFIRMED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export const statusLabels: Record<RequestStatus, string> = {
  PENDING: "Pending",
  CHECKED: "Checked",
  REVIEWED: "Reviewed",
  APPROVED: "Approved",
  IN_PROCUREMENT: "In Procurement",
  PROCURED: "Procured",
  PAYMENT_PENDING: "Payment Pending",
  PAID: "Paid",
  REJECTED: "Rejected",
  RETURNED: "Returned",
  SOURCED: "Sourced",
  DELIVERED: "Delivered",
  IN_PROGRESS: "In Progress",
  DRAFT: "Draft",
  SENT: "Sent",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
};
