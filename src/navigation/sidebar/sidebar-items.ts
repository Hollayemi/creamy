import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LucideIcon, LogOut, Moon, Car } from "lucide-react";

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
    label: "Menu Items",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Products",
        url: "/dashboard/product-management",
        icon: Package,
        subItems: [
          { title: "All Products", url: "/dashboard/product-management" },
          { title: "Add New Product", url: "/dashboard/product-management/create" },
          { title: "Categories", url: "/dashboard/product-management/categories" },
        ],
      },
      {
        title: "Orders",
        url: "/dashboard/order-management",
        icon: ShoppingCart,
      },
      {
        title: "Customers",
        url: "/dashboard/customers",
        icon: Users,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
  {
    id: 1,
    label: "Accounts",
    items: [
       {
        title: "Staff Management",
        url: "/dashboard/staff-management",
        icon: Users,

      },
       {
        title: "Driver Management",
        url: "/dashboard/driver-management",
        icon: Car

      },
       {
        title: "Customer Management",
        url: "/dashboard/customer-management",
        icon: Users,

      },
      {
        title: "Enable Dark Mode",
        url: "/dashboard",
        icon: Moon,
      },
      {
        title: "Log Out",
        url: "/dashboard/orders",
        icon: LogOut,
      },
    ],
  },
  {
    id: 1,
    label: `Today: ${new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`,
    items: [],
  },
];
