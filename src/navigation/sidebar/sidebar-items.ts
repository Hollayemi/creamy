import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LucideIcon, LogOut, Moon } from "lucide-react";

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
        url: "/dashboard/products",
        icon: Package,
        subItems: [
          { title: "All Products", url: "/dashboard/products" },
          { title: "Add New Product", url: "/dashboard/products/new" },
          { title: "Categories", url: "/dashboard/products/categories" },
        ],
      },
      {
        title: "Orders",
        url: "/dashboard/orders",
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
    label: "Others",
    items: [
      {
        title: "Enable Dark Mode",
        url: "/dashboard",
        icon: Moon,
      },
      {
        title: "User Management",
        url: "/dashboard/products",
        icon: Users,

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
