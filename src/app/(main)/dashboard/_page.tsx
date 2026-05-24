// "use client";

// import { DollarSign, ShoppingCart, Users, RefreshCw } from "lucide-react";
// import StatsCard from "./_components/dashboard/StatsCard";
// import OverviewChart from "./_components/dashboard/OverviewChart";
// import RecentOrders from "./_components/dashboard/RecentOrders";
// import RegionalPerformance from "./_components/dashboard/RegionalPerformance";
// import TopSellingProducts from "./_components/dashboard/TopSellingProducts";
// import TopCustomers from "./_components/dashboard/TopCustomers";
// import DashboardAlertCard from "./_components/dashboard/DashboardAlertCard";
// import {
//   useGetDashboardStatsQuery,
//   useGetRevenueChartQuery,
//   useGetRecentOrdersQuery,
//   useGetTopProductsQuery,
//   useGetTopCustomersQuery,
//   useGetRegionalPerformanceQuery,
// } from "@/stores/services/dashboardApi";

// // ─── Skeleton ────────────────────────────────────────────────
// function Skeleton({ className = "" }: { className?: string }) {
//   return (
//     <div
//       className={`animate-pulse rounded-lg bg-gray-200 dark:bg-zinc-700 ${className}`}
//     />
//   );
// }

// // ─── Error banner ─────────────────────────────────────────────
// function SectionError({ refetch }: { refetch: () => void }) {
//   return (
//     <div className="flex h-full min-h-[80px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
//       <span>Failed to load</span>
//       <button
//         onClick={refetch}
//         className="flex items-center gap-1 underline underline-offset-2 hover:no-underline"
//       >
//         <RefreshCw className="h-3 w-3" /> Retry
//       </button>
//     </div>
//   );
// }

// export default function DashboardPage() {
//   // ── Data fetching ────────────────────────────────────────────
//   const {
//     data: statsRes,
//     isLoading: statsLoading,
//     isError: statsError,
//     refetch: refetchStats,
//   } = useGetDashboardStatsQuery();

//   const {
//     data: chartRes,
//     isLoading: chartLoading,
//     isError: chartError,
//     refetch: refetchChart,
//   } = useGetRevenueChartQuery({ period: "monthly" });

//   const {
//     data: ordersRes,
//     isLoading: ordersLoading,
//     isError: ordersError,
//     refetch: refetchOrders,
//   } = useGetRecentOrdersQuery({ limit: 10 });

//   const {
//     data: productsRes,
//     isLoading: productsLoading,
//     isError: productsError,
//     refetch: refetchProducts,
//   } = useGetTopProductsQuery({ limit: 10, period: "monthly" });

//   const {
//     data: customersRes,
//     isLoading: customersLoading,
//     isError: customersError,
//     refetch: refetchCustomers,
//   } = useGetTopCustomersQuery({ limit: 10 });

//   const {
//     data: regionalRes,
//     isLoading: regionalLoading,
//     isError: regionalError,
//     refetch: refetchRegional,
//   } = useGetRegionalPerformanceQuery({});

//   // ── Extracted payloads ───────────────────────────────────────
//   const stats = statsRes?.data;
//   const chart = chartRes?.data;
//   const recentOrders = ordersRes?.data?.orders ?? [];
//   const topProducts = productsRes?.data?.products ?? [];
//   const topCustomers = customersRes?.data?.customers ?? [];
//   const regionalData = regionalRes?.data?.regions ?? [];

//   console.log({chart})

//   // ── Stat card icon map ───────────────────────────────────────
//   const statIcons: Record<string, React.ReactNode> = {
//     totalSales: <DollarSign className="h-4 w-4" />,
//     completedOrders: <ShoppingCart className="h-4 w-4" />,
//     activeCustomers: <Users className="h-4 w-4" />,
//   };

//   return (
//     <div className="space-y-6 p-6">
//       {/* ── Page title ─────────────────────────────────────── */}
//       <h1 className="text-2xl font-bold">Dashboard Overview</h1>

//       {/* ── TOP SECTION: Alert card + Stats + Chart ─────────── */}
//       <div className="grid grid-cols-[327px_1fr] gap-6">
//         {/* Alert card (static — no API dependency) */}
//         <div className="h-[462px] w-[327px]">
//           <DashboardAlertCard />
//         </div>

//         {/* RIGHT — Stats row + Chart */}
//         <div className="flex flex-col gap-6">
//           {/* Stats row */}
//           <div className="grid h-[122px] grid-cols-4 gap-6">
//             {statsLoading ? (
//               <>
//                 <Skeleton className="h-full" />
//                 <Skeleton className="h-full" />
//                 <Skeleton className="h-full" />
//               </>
//             ) : statsError || !stats ? (
//               <div className="col-span-3">
//                 <SectionError refetch={refetchStats} />
//               </div>
//             ) : (
//               Object.entries(stats).map(([key, card]: [string, any]) => (
//                 <StatsCard
//                   key={key}
//                   title={card.title}
//                   value={card.value}
//                   change={card.change}
//                   data={card.data || []}
//                   icon={statIcons[key]}
//                 />
//               ))
//             )}
//           </div>

//           {/* Revenue chart */}
//           <div className="flex-1">
//             {chartLoading ? (
//               <Skeleton className="h-full min-h-[280px]" />
//             ) : chartError || !chart ? (
//               <SectionError refetch={refetchChart} />
//             ) : (
//               <OverviewChart
//                 change={chart.change}
//                 positive={chart.positive}
//                 data={chart.chart}
//               />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ── TOP PRODUCTS + TOP CUSTOMERS ────────────────────── */}
//       <div className="grid grid-cols-[3fr_2fr] gap-6">
//         {productsLoading ? (
//           <Skeleton className="h-80" />
//         ) : productsError ? (
//           <SectionError refetch={refetchProducts} />
//         ) : (
//           <TopSellingProducts products={topProducts} />
//         )}

//         {customersLoading ? (
//           <Skeleton className="h-80" />
//         ) : customersError ? (
//           <SectionError refetch={refetchCustomers} />
//         ) : (
//           <TopCustomers customers={topCustomers} />
//         )}
//       </div>

//       {/* ── RECENT ORDERS + REGIONAL PERFORMANCE ────────────── */}
//       <div className="grid grid-cols-[3fr_2fr] gap-6">
//         {ordersLoading ? (
//           <Skeleton className="h-96" />
//         ) : ordersError ? (
//           <SectionError refetch={refetchOrders} />
//         ) : (
//           <RecentOrders orders={recentOrders} />
//         )}

//         {regionalLoading ? (
//           <Skeleton className="h-96" />
//         ) : regionalError ? (
//           <SectionError refetch={refetchRegional} />
//         ) : (
//           <RegionalPerformance regions={regionalData} />
//           // <></>
//         )}
//       </div>
//     </div>
//   );
// }