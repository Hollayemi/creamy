"use client";

import { useState } from "react";
import { format } from "date-fns";
import { PlusCircle, Pencil, Trash2, MapPin } from "lucide-react";
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
  useGetRegionsQuery,
  useCreateRegionMutation,
  useUpdateRegionMutation,
  useDeleteRegionMutation,
  type Region,
} from "@/stores/services/settingsApi";

export default function RegionsTab() {
  const { data: regionsResponse, isLoading } = useGetRegionsQuery();
  const [createRegion, { isLoading: isCreating }] = useCreateRegionMutation();
  const [updateRegion, { isLoading: isUpdating }] = useUpdateRegionMutation();
  const [deleteRegion, { isLoading: isDeleting }] = useDeleteRegionMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [deletingRegionId, setDeletingRegionId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const regions = regionsResponse?.data || [];

  const handleOpenDialog = (region?: Region) => {
    if (region) {
      setEditingRegion(region);
      setName(region.name);
      setDisplayName(region.displayName);
      setStatus(region.status);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingRegion(null);
    setName("");
    setDisplayName("");
    setStatus("active");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Region name is required");
      return;
    }

    if (!displayName.trim()) {
      toast.error("Display name is required");
      return;
    }

    try {
      const data = {
        name: name.trim(),
        displayName: displayName.trim(),
      };

      if (editingRegion) {
        await updateRegion({ id: editingRegion._id, data }).unwrap();
        toast.success("Region updated successfully");
      } else {
        await createRegion(data).unwrap();
        toast.success("Region created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save region");
    }
  };

  const handleDelete = async () => {
    if (!deletingRegionId) return;

    try {
      await deleteRegion(deletingRegionId).unwrap();
      toast.success("Region deleted successfully");
      setIsDeleteDialogOpen(false);
      setDeletingRegionId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete region");
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeletingRegionId(id);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading regions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Regions</h2>
          <p className="text-sm text-muted-foreground">Manage delivery regions and locations</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Region
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">
                <MapPin className="h-4 w-4" />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground h-32">
                  No regions found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              regions.map((region) => (
                <TableRow key={region._id}>
                  <TableCell>
                    <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{region.name}</TableCell>
                  <TableCell>{region.displayName}</TableCell>
                  <TableCell>
                    <Badge variant={region.status === "active" ? "default" : "secondary"}>
                      {region.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(region.createdAt), "MMM dd, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(region)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(region._id)}
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
            <DialogTitle>{editingRegion ? "Edit Region" : "Add Region"}</DialogTitle>
            <DialogDescription>
              {editingRegion ? "Update region details" : "Create a new delivery region"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., lagos-mainland"
              />
              <p className="text-xs text-muted-foreground">
                Use lowercase with hyphens (e.g., lagos-mainland)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g., Lagos Mainland"
              />
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
              {isCreating || isUpdating ? "Saving..." : editingRegion ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Region</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this region? This action cannot be undone.
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