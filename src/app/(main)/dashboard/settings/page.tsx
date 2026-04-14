"use client";

import { useState } from "react";
import { Settings, FolderTree, MapPin, Zap, Megaphone, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoriesTab from "./_components/categories-tab";
import RegionsTab from "./_components/regions-tab";
import DealsTab from "./_components/deals-tab";
import AdvertsTab from "./_components/adverts-tab";
import PushNotificationsTab from "./_components/push-notifications-tab";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
          <Settings className="text-primary h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your store&apos;scategories, regions, deals, and promotional content
          </p>
        </div>
      </div>

      {/* Tabs Card */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid h-12 w-full grid-cols-5 lg:inline-grid lg:w-auto">
              <TabsTrigger value="categories" className="gap-2">
                <FolderTree className="h-4 w-4" />
                <span className="hidden sm:inline">Categories</span>
              </TabsTrigger>
              <TabsTrigger value="regions" className="gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Regions</span>
              </TabsTrigger>
              <TabsTrigger value="deals" className="gap-2">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Deals</span>
              </TabsTrigger>
              <TabsTrigger value="adverts" className="gap-2">
                <Megaphone className="h-4 w-4" />
                <span className="hidden sm:inline">Adverts</span>
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Push Notifications</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="space-y-4">
              <CategoriesTab />
            </TabsContent>

            <TabsContent value="regions" className="space-y-4">
              <RegionsTab />
            </TabsContent>

            <TabsContent value="deals" className="space-y-4">
              <DealsTab />
            </TabsContent>

            <TabsContent value="adverts" className="space-y-4">
              <AdvertsTab />
            </TabsContent>

            <TabsContent value="notifications">
              <PushNotificationsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
