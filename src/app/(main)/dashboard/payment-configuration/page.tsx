"use client";

import { useState } from "react";
import { Database, Zap, CreditCard } from "lucide-react"; // Database for Data & Backup, Zap for Integration & API
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntegrationTab from "./_components/api-integration-tab";
import DataBackupTab from "./_components/data-backup-tab";

export default function PaymentConfigurationPage() {
  const [activeTab, setActiveTab] = useState("api-integration");

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
          <CreditCard className="text-primary h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Configuration</h1>
          <p className="text-muted-foreground">Manage your Integration & API settings and Data & Backup</p>
        </div>
      </div>

      {/* Tabs Card */}
      <Card>
        <CardContent className="p-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tabs Triggers */}
            <TabsList className="grid h-12 w-full grid-cols-2 lg:inline-grid lg:w-auto">
              <TabsTrigger value="api-integration" className="gap-2">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Integration & API</span>
              </TabsTrigger>
              <TabsTrigger value="data-backup" className="gap-2">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Data & Backup</span>
              </TabsTrigger>
            </TabsList>

            {/* Tabs Content */}
            <TabsContent value="api-integration" className="space-y-4">
              <IntegrationTab />
            </TabsContent>

            <TabsContent value="data-backup" className="space-y-4">
              <DataBackupTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
