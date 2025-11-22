import {
  LayoutDashboard,
  FilePlus2,
  ClipboardCheck,
  CheckCircle2,
  FileSearch,
  ShoppingCart,
  Receipt,
  FileBadge2,
  Users,
  UserCog,
  FileText,
  BarChart3,
  Bell,
  Settings,
  History,
  FolderOpen,
  LucideIcon,
  SaveOff,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Requests",
        url: "/dashboard/requests",
        icon: FilePlus2,
        subItems: [
          { title: "Create New Request", url: "/dashboard/requests/new" },
          { title: "My Requests", url: "/dashboard/requests/mine" },
          { title: "All Requests", url: "/dashboard/requests" },
        ],
      },
      {
        title: "Approvals",
        url: "/dashboard/approvals",
        icon: ClipboardCheck,
        subItems: [
          { title: "Pending Approvals", url: "/dashboard/approvals/pending" },
          { title: "Checked Requests", url: "/dashboard/approvals/checked" },
          { title: "Reviewed Requests", url: "/dashboard/approvals/reviewed" },
          { title: "Approved by DG", url: "/dashboard/approvals/approved" },
        ],
      },
      {
        title: "Procurement",
        url: "/dashboard/procurement",
        icon: ShoppingCart,
        subItems: [
          { title: "Pending Procurement", url: "/dashboard/procurement/pending" },
          { title: "Vendor Database", url: "/dashboard/procurement/vendor" },
          { title: "Purchase Orders", url: "/dashboard/procurement/purchase-orders" },
          { title: "Procurement History", url: "/dashboard/procurement/history" },
        ],
      },
      {
        title: "Finance & Admin",
        url: "/dashboard/finance",
        icon: Receipt,
        subItems: [
          { title: "Pending Payments", url: "/dashboard/finance/pending" },
          { title: "Processed Payments", url: "/dashboard/finance/processed" },
          { title: "Budget Tracker", url: "/dashboard/finance/budget" },
          { title: "Expenditure Reports", url: "/dashboard/finance/reports" },
        ],
      },
      {
        title: "Documents",
        url: "/dashboard/documents",
        icon: FolderOpen,
        subItems: [
          { title: "Upload Documents", url: "/dashboard/documents/upload" },
          { title: "Manage Documents", url: "/dashboard/documents/manage" },
        ],
      },
      {
        title: "Reports & Analytics",
        url: "/dashboard/reports",
        icon: BarChart3,
        subItems: [
          { title: "Request Reports", url: "/dashboard/reports/requests" },
          { title: "Procurement Reports", url: "/dashboard/reports/procurement" },
          { title: "Finance Reports", url: "/dashboard/reports/finance" },
          { title: "Department Analysis", url: "/dashboard/reports/departments" },
        ],
      },
      {
        title: "Audit Trail",
        url: "/dashboard/audit-trail",
        icon: History,
      },
      {
        title: "User Management",
        url: "/dashboard/users",
        icon: Users,
        subItems: [
          { title: "All Users", url: "/dashboard/users" },
          { title: "Add New User", url: "/dashboard/users/new" },
        ],
      },
      {
        title: "Authorization",
        url: "/dashboard/users/roles",
        icon: SaveOff,
        // subItems: [
        //   { title: "All Users", url: "/dashboard/users" },
        //   { title: "Roles & Permissions", url: "/dashboard/users/roles" },
        //   { title: "Add New User", url: "/dashboard/users/new" },
        // ],
      },
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: Bell,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
        subItems: [
          { title: "Profile Settings", url: "/dashboard/settings/profile" },
          { title: "System Preferences", url: "/dashboard/settings/system" },
          { title: "Security", url: "/dashboard/settings/security" },
        ],
      },
    ],
  },
];
