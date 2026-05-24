"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  CreditCard,
  Calendar,
  DollarSign,
  Tag,
  Layers,
  Palette,
  LayoutGrid,
  List,
  Power,
  PowerOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import {
  useGetAllPlansQuery,
  useTogglePlanMutation,
  useDeletePlanMutation
} from "@/stores/services/subscriptionApi";
import CreateEditPlanDialog from "./_components/create-edit-plan-dialog";

import {
    Plan,
    CreatePlanPayload,
    UpdatePlanPayload,
} from "@/types/payment";


export default function PlansManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  const {
    data: plansResponse,
    isLoading,
    refetch,
  } = useGetAllPlansQuery({
    search: searchQuery,
    page,
    limit,
  });

  const [togglePlan] = useTogglePlanMutation();
  const [deletePlan] = useDeletePlanMutation();

  const plans = plansResponse?.data?.plans || [];
  const totalPages =  1;

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
        <CheckCircle className="mr-1 h-3 w-3" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary">
        <XCircle className="mr-1 h-3 w-3" />
        Inactive
      </Badge>
    );
  };

  const getBadgeColorClass = (color?: string) => {
    const colors: Record<string, string> = {
      gold: "bg-gradient-to-r from-yellow-400 to-yellow-600",
      silver: "bg-gradient-to-r from-gray-300 to-gray-500",
      platinum: "bg-gradient-to-r from-gray-400 to-gray-700",
      bronze: "bg-gradient-to-r from-amber-600 to-amber-800",
      default: "bg-gradient-to-r from-blue-500 to-blue-700",
    };
    return colors[color?.toLowerCase() || "default"] || colors.default;
  };

  const handleCreatePlan = () => {
    setDialogMode("create");
    setSelectedPlan(null);
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setDialogMode("edit");
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const handleTogglePlan = async (plan: Plan) => {
    try {
      await togglePlan(plan._id).unwrap();
      toast.success(`Plan ${plan.isActive ? "deactivated" : "activated"} successfully`);
      refetch();
    } catch (error) {
      toast.error("Failed to toggle plan status");
    }
  };

  const handleDeletePlan = async (plan: Plan) => {
    if (confirm(`Are you sure you want to delete "${plan.name}"? This action cannot be undone.`)) {
      try {
        await deletePlan(plan._id).unwrap();
        toast.success("Plan deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete plan");
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-EN", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2" />
          <p className="text-muted-foreground mt-4">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground">Manage your subscription tiers and pricing</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreatePlan}>
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search plans by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => value && setViewMode(value as "table" | "card")}
        >
          <ToggleGroupItem value="table" aria-label="Table view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="card" aria-label="Card view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-muted-foreground h-32 text-center">
                    No plans found
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan._id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{formatPrice(plan.price)}</TableCell>
                    <TableCell>{plan.durationDays} days</TableCell>
                    <TableCell>{plan.discountPercentage}%</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {plan.features.slice(0, 2).map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {plan.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{plan.features.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(plan.isActive)}</TableCell>
                    <TableCell>
                      {plan.badgeColor && (
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${getBadgeColorClass(
                              plan.badgeColor
                            )}`}
                          />
                          <span className="text-sm capitalize">{plan.badgeColor}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(plan.createdAt), "dd MMM yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem onClick={() => handleEditPlan(plan)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTogglePlan(plan)}>
                            {plan.isActive ? (
                              <>
                                <PowerOff className="mr-2 h-4 w-4 text-orange-600" />
                                Deactivate Plan
                              </>
                            ) : (
                              <>
                                <Power className="mr-2 h-4 w-4 text-green-600" />
                                Activate Plan
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeletePlan(plan)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Plan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.length === 0 ? (
            <div className="col-span-full text-muted-foreground py-12 text-center">
              No plans found
            </div>
          ) : (
            plans.map((plan) => (
              <Card
                key={plan._id}
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  !plan.isActive && "opacity-75"
                } border`}
              >
                {plan.badgeColor && (
                  <div
                    className={`absolute top-0 -right-0 h-2 w-full translate-x-8# ${getBadgeColorClass(
                      plan.badgeColor
                    )}`}
                  />
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                      <CardDescription className="mt-2 text-sm w-full">{plan.description}</CardDescription>
                    </div>
                    {getStatusBadge(plan.isActive)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm">Price</span>
                      </div>
                      <span className="text-md font-bold">{formatPrice(plan.price)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Duration</span>
                      </div>
                      <span className="text-md">{plan.durationDays} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Tag className="h-4 w-4" />
                        <span className="text-sm">Discount</span>
                      </div>
                      <span>{plan.discountPercentage}%</span>
                    </div>
                    {plan.maxDiscountAmountPerOrder && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CreditCard className="h-4 w-4" />
                          <span className="text-sm">Max Discount/Order</span>
                        </div>
                        <span className="text-sm">{formatPrice(plan.maxDiscountAmountPerOrder)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Layers className="h-4 w-4" />
                      <span className="text-sm">Features</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {plan.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => handleEditPlan(plan)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant={plan.isActive ? "outline" : "default"}
                      className="flex-1"
                      onClick={() => handleTogglePlan(plan)}
                    >
                      {plan.isActive ? (
                        <>
                          <PowerOff className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Power className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {plans.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            {/* Showing {plans.length} of {plansResponse?.data?.total || 0} entries */}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            ))}
            {totalPages > 5 && <span className="text-muted-foreground">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <CreateEditPlanDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        plan={selectedPlan}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}