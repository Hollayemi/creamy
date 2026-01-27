"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Receipt, CheckCircle2, Clock, TrendingUp, Wallet, AlertCircle, FileText, Calendar } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface FinanceSummary {
  pendingPayments: number;
  pendingAmount: number;
  processedPayments: number;
  processedAmount: number;
  totalBudget: number;
  budgetSpent: number;
  budgetRemaining: number;
}

interface RecentActivity {
  id: string;
  type: "PAYMENT" | "BUDGET";
  description: string;
  amount: number;
  date: string;
  status: "COMPLETED" | "PENDING";
}

const mockSummary: FinanceSummary = {
  pendingPayments: 3,
  pendingAmount: 880000,
  processedPayments: 5,
  processedAmount: 1920000,
  totalBudget: 12500000,
  budgetSpent: 7700000,
  budgetRemaining: 4800000,
};

const mockRecentActivity: RecentActivity[] = [
  {
    id: "1",
    type: "PAYMENT",
    description: "Payment processed for PO-2024-001 - Desktop Computers",
    amount: 450000,
    date: "2024-01-25",
    status: "COMPLETED",
  },
  {
    id: "2",
    type: "PAYMENT",
    description: "Payment processed for PO-2024-002 - Office Chairs",
    amount: 250000,
    date: "2024-01-24",
    status: "COMPLETED",
  },
  {
    id: "3",
    type: "PAYMENT",
    description: "Pending payment for PO-2024-005 - Printers",
    amount: 180000,
    date: "2024-01-23",
    status: "PENDING",
  },
  {
    id: "4",
    type: "BUDGET",
    description: "IT Equipment budget updated",
    amount: 0,
    date: "2024-01-22",
    status: "COMPLETED",
  },
];

export default function FinanceMainPage() {
  const router = useRouter();
  const [summary] = useState<FinanceSummary>(mockSummary);
  const [recentActivity] = useState<RecentActivity[]>(mockRecentActivity);

  const budgetPercentage = Math.round((summary.budgetSpent / summary.totalBudget) * 100);

  return (
    <div className="@container/main flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Finance & Admin Overview</h1>
          <p className="text-muted-foreground text-sm">Monitor payments and budget allocation</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pendingPayments}</div>
            <p className="text-muted-foreground mt-1 text-xs">₦{summary.pendingAmount.toLocaleString()} to pay</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Processed Payments</CardTitle>
            <CheckCircle2 className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.processedPayments}</div>
            <p className="text-muted-foreground mt-1 text-xs">₦{summary.processedAmount.toLocaleString()} paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Wallet className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{summary.totalBudget.toLocaleString()}</div>
            <p className="text-muted-foreground mt-1 text-xs">For current year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
            <TrendingUp className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{summary.budgetRemaining.toLocaleString()}</div>
            <p className="text-muted-foreground mt-1 text-xs">{100 - budgetPercentage}% available</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Budget Utilization</CardTitle>
              <CardDescription>Current year budget usage across all categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget Used</span>
                  <span className="font-medium">{budgetPercentage}%</span>
                </div>
                <Progress value={budgetPercentage} className="h-3" />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Spent: ₦{summary.budgetSpent.toLocaleString()}</span>
                  <span className="text-muted-foreground">Remaining: ₦{summary.budgetRemaining.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => router.push("/dashboard/finance/budget")}
                >
                  <Wallet className="mr-2 size-4" />
                  View Budget Tracker
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => router.push("/dashboard/finance/reports")}
                >
                  <FileText className="mr-2 size-4" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest payments and budget updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-3">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                        activity.status === "COMPLETED" ? "bg-green-100" : "bg-yellow-100"
                      }`}
                    >
                      {activity.type === "PAYMENT" ? (
                        <Receipt
                          className={`size-5 ${activity.status === "COMPLETED" ? "text-green-600" : "text-yellow-600"}`}
                        />
                      ) : (
                        <Wallet className="size-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm leading-none font-medium">{activity.description}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-muted-foreground text-xs">
                          {new Date(activity.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <Badge
                          variant="outline"
                          className={
                            activity.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </div>
                      {activity.amount > 0 && (
                        <p className="text-sm font-semibold">₦{activity.amount.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common finance and admin tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push("/dashboard/finance/pending")}
              >
                <Clock className="mr-2 size-4" />
                Process Pending Payments
                {summary.pendingPayments > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {summary.pendingPayments}
                  </Badge>
                )}
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push("/dashboard/finance/processed")}
              >
                <CheckCircle2 className="mr-2 size-4" />
                View Payment History
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push("/dashboard/finance/budget")}
              >
                <Wallet className="mr-2 size-4" />
                Budget Tracker
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push("/dashboard/finance/reports")}
              >
                <FileText className="mr-2 size-4" />
                Generate Reports
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alerts & Notices</CardTitle>
              <CardDescription>Important financial notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary.pendingPayments > 0 && (
                <div className="flex gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-900/20">
                  <AlertCircle className="size-5 shrink-0 text-yellow-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Pending Payments</p>
                    <p className="text-muted-foreground text-xs">
                      {summary.pendingPayments} payment{summary.pendingPayments > 1 ? "s" : ""} awaiting processing
                    </p>
                  </div>
                </div>
              )}

              {budgetPercentage > 80 && (
                <div className="flex gap-3 rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-900 dark:bg-orange-900/20">
                  <AlertCircle className="size-5 shrink-0 text-orange-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Budget Warning</p>
                    <p className="text-muted-foreground text-xs">Budget utilization at {budgetPercentage}%</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/20">
                <Calendar className="size-5 shrink-0 text-blue-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Monthly Report Due</p>
                  <p className="text-muted-foreground text-xs">Financial report due in 5 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
