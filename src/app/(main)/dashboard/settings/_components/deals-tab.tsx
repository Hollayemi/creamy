"use client";

import { useState } from "react";
import { format } from "date-fns";
import { PlusCircle, Pencil, Trash2, Calendar, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  useGetDealsQuery,
  useCreateDealMutation,
  useUpdateDealMutation,
  useDeleteDealMutation,
  type DealOfTheDay,
} from "@/stores/services/settingsApi";
import { useGetProductsQuery } from "@/stores/services/productApi";
import { Product } from "@/types/product";

interface IDSelect {
  value: string;
  label: string
}
export default function DealsTab() {
  const { data: dealsResponse, isLoading } = useGetDealsQuery();
  const { data: products, isLoading: isProductsLoading } = useGetProductsQuery({ search: "" })
  const [createDeal, { isLoading: isCreating }] = useCreateDealMutation();
  const [updateDeal, { isLoading: isUpdating }] = useUpdateDealMutation();
  const [deleteDeal, { isLoading: isDeleting }] = useDeleteDealMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Product | null>(null);
  const [deletingDealId, setDeletingDealId] = useState<string | null>(null);

  // Form state
  const [productId, setProductId] = useState("");
  const [percentage, setDiscountPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [applicableProduct, setApplicableProduct] = useState<IDSelect[]>([]);

  const deals = dealsResponse?.data?.deals || [];
  const availableProducts = products?.data?.products || []

  const handleOpenDialog = (deal?: Product) => {
    if (deal) {
      setEditingDeal(deal);
      setProductId(deal._id);
      setDiscountPercentage(deal.dealInfo?.percentage.toString() || "");
      setStartDate(deal.dealInfo?.startDate.split("T")[0] || "");
      setEndDate(deal.dealInfo?.endDate.split("T")[0] || "");
      setStatus(deal.dealInfo?.status || "inactive");
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingDeal(null);
    setProductId("");
    setDiscountPercentage("");
    setStartDate("");
    setEndDate("");
    setStatus("active");
  };

  const handleSubmit = async () => {
    // Validation
    if (!productId.trim()) {
      toast.error("Product ID is required");
      return;
    }

    const discount = parseFloat(percentage);
    if (isNaN(discount) || discount <= 0 || discount > 100) {
      toast.error("Discount must be between 1 and 100");
      return;
    }

    if (!startDate) {
      toast.error("Start date is required");
      return;
    }

    if (!endDate) {
      toast.error("End date is required");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      const data = {
        productId: productId.trim(),
        percentage: discount,
        startDate,
        endDate,
      };

      if (editingDeal) {
        await updateDeal({ id: editingDeal._id, data }).unwrap();
        toast.success("Deal updated successfully");
      } else {
        await createDeal(data).unwrap();
        toast.success("Deal created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save deal");
    }
  };

  const handleDelete = async () => {
    if (!deletingDealId) return;

    try {
      await deleteDeal(deletingDealId).unwrap();
      toast.success("Deal deleted successfully");
      setIsDeleteDialogOpen(false);
      setDeletingDealId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete deal");
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeletingDealId(id);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading deals...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Deals of the Day</h2>
          <p className="text-sm text-muted-foreground">
            Manage special discounts and promotional deals
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Deal
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground h-32">
                  No deals found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              deals.map((deal: Product) => (
                <TableRow key={deal._id}>
                  <TableCell className="font-mono text-sm">{deal.productId}</TableCell>
                  <TableCell>{deal.productName || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-green-50 rounded flex items-center justify-center">
                        <Percent className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-semibold text-green-600">
                        {deal.dealInfo?.percentage ?? "N/A"}% OFF
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {deal.dealInfo ? (
                        <>
                          {format(new Date(deal.dealInfo.startDate), "MMM dd")} -{" "}
                          {format(new Date(deal.dealInfo.endDate), "MMM dd, yyyy")}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={deal?.dealInfo?.status === "active" ? "default" : "secondary"}>
                      {deal.dealInfo?.status || "inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(deal)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(deal._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingDeal ? "Edit Deal" : "Add Deal of the Day"}</DialogTitle>
            <DialogDescription>
              {editingDeal ? "Update deal details" : "Create a new promotional deal"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Product ID *</Label>
              <Select value={productId} onValueChange={(value: string) => setProductId(value)}>
                <SelectTrigger id="productId" className="bg-gray-50 w-full dark:bg-gray-900">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.productName}
                  </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Enter the MongoDB ObjectId of the product
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentage">Discount Percentage *</Label>
              <div className="relative">
                <Input
                  id="percentage"
                  type="number"
                  min="1"
                  max="100"
                  value={percentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  placeholder="e.g., 25"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  %
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Enter a value between 1 and 100</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as "active" | "inactive")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? "Saving..." : editingDeal ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Deal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this deal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}