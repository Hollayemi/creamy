"use client";

import { useState } from "react";
import { Download, FileText, TrendingUp, Calendar, Filter } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface DepartmentExpenditure {
  department: string;
  totalSpent: number;
  itemCount: number;
  averageTransaction: number;
  percentageOfTotal: number;
}

interface CategoryExpenditure {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

interface QuarterlyReport {
  quarter: string;
  amount: number;
  transactions: number;
}

const mockDepartmentData: DepartmentExpenditure[] = [
  {
    department: "IT Department",
    totalSpent: 2450000,
    itemCount: 15,
    averageTransaction: 163333,
    percentageOfTotal: 32,
  },
  {
    department: "Administration",
    totalSpent: 1920000,
    itemCount: 22,
    averageTransaction: 87273,
    percentageOfTotal: 25,
  },
  {
    department: "Finance",
    totalSpent: 950000,
    itemCount: 8,
    averageTransaction: 118750,
    percentageOfTotal: 12,
  },
  {
    department: "Operations",
    totalSpent: 1580000,
    itemCount: 12,
    averageTransaction: 131667,
    percentageOfTotal: 21,
  },
  {
    department: "Training",
    totalSpent: 800000,
    itemCount: 6,
    averageTransaction: 133333,
    percentageOfTotal: 10,
  },
];

const mockCategoryData: CategoryExpenditure[] = [
  { category: "IT Equipment", amount: 2450000, count: 15, percentage: 32 },
  { category: "Office Furniture", amount: 1600000, count: 18, percentage: 21 },
  { category: "Office Supplies", amount: 950000, count: 25, percentage: 13 },
  { category: "Training Materials", amount: 800000, count: 8, percentage: 11 },
  { category: "Maintenance", amount: 450000, count: 12, percentage: 6 },
  { category: "Others", amount: 1450000, count: 20, percentage: 17 },
];

const mockQuarterlyData: QuarterlyReport[] = [
  { quarter: "Q1 2024", amount: 3200000, transactions: 28 },
  { quarter: "Q2 2024", amount: 4100000, transactions: 35 },
  { quarter: "Q3 2024", amount: 0, transactions: 0 },
  { quarter: "Q4 2024", amount: 0, transactions: 0 },
];

export default function ExpenditureReportsPage() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const totalExpenditure = mockDepartmentData.reduce((sum, dept) => sum + dept.totalSpent, 0);
  const totalTransactions = mockDepartmentData.reduce((sum, dept) => sum + dept.itemCount, 0);

  return (
    <div className="@container/main flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Expenditure Reports</h1>
          <p className="text-muted-foreground text-sm">Comprehensive spending analysis and financial reports</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="year-select">Year:</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger id="year-select" className="w-32">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="period-select">Period:</Label>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger id="period-select" className="w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="q1">Q1 (Jan-Mar)</SelectItem>
              <SelectItem value="q2">Q2 (Apr-Jun)</SelectItem>
              <SelectItem value="q3">Q3 (Jul-Sep)</SelectItem>
              <SelectItem value="q4">Q4 (Oct-Dec)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="ml-auto">
          <Download className="mr-2" />
          Export PDF
        </Button>
        <Button variant="outline">
          <Download className="mr-2" />
          Export Excel
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenditure</CardTitle>
            <TrendingUp className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalExpenditure.toLocaleString()}</div>
            <p className="text-muted-foreground mt-1 text-xs">For {selectedYear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <FileText className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-muted-foreground mt-1 text-xs">Completed purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            <TrendingUp className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{Math.round(totalExpenditure / totalTransactions).toLocaleString()}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">Per purchase</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Calendar className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDepartmentData.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Active departments</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="departments">By Department</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Departmental Expenditure Report</CardTitle>
              <CardDescription>Breakdown of spending across all departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockDepartmentData.map((dept, index) => (
                  <div key={dept.department} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{dept.department}</div>
                          <div className="text-muted-foreground text-sm">{dept.itemCount} transactions</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">₦{dept.totalSpent.toLocaleString()}</div>
                        <Badge variant="outline">{dept.percentageOfTotal}% of total</Badge>
                      </div>
                    </div>

                    <div className="bg-muted/50 grid grid-cols-2 gap-4 rounded-lg p-4 text-sm">
                      <div>
                        <div className="text-muted-foreground text-xs">Average per Transaction</div>
                        <div className="mt-1 font-medium">₦{dept.averageTransaction.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Total Items</div>
                        <div className="mt-1 font-medium">{dept.itemCount} items</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category-wise Expenditure</CardTitle>
              <CardDescription>Spending distribution by item category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCategoryData.map((category) => (
                  <div key={category.category} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{category.category}</div>
                        <div className="text-lg font-bold">₦{category.amount.toLocaleString()}</div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{category.count} items purchased</span>
                        <Badge variant="outline">{category.percentage}% of total</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border p-4">
                <div className="text-sm font-medium">Total Spending by Category</div>
                <div className="mt-2 text-2xl font-bold">
                  ₦{mockCategoryData.reduce((sum, cat) => sum + cat.amount, 0).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quarterly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Performance</CardTitle>
              <CardDescription>Expenditure trend across quarters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockQuarterlyData.map((quarter) => (
                  <div key={quarter.quarter} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{quarter.quarter}</div>
                        <div className="text-muted-foreground text-sm">{quarter.transactions} transactions</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">
                          {quarter.amount > 0 ? `₦${quarter.amount.toLocaleString()}` : "No data"}
                        </div>
                        {quarter.amount > 0 && (
                          <div className="text-muted-foreground text-sm">
                            Avg: ₦{Math.round(quarter.amount / quarter.transactions).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <div className="text-muted-foreground text-sm">Total YTD</div>
                  <div className="mt-1 text-2xl font-bold">
                    ₦{mockQuarterlyData.reduce((sum, q) => sum + q.amount, 0).toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-muted-foreground text-sm">Projected Annual</div>
                  <div className="mt-1 text-2xl font-bold">
                    ₦{(mockQuarterlyData.reduce((sum, q) => sum + q.amount, 0) * 2).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
