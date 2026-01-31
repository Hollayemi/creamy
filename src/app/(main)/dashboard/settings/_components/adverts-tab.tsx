"use client";

import { useState } from "react";
import { format } from "date-fns";
import { PlusCircle, Pencil, Trash2, Image as ImageIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  useGetAdvertsQuery,
  useCreateAdvertMutation,
  useUpdateAdvertMutation,
  useDeleteAdvertMutation,
  type Advert,
} from "@/stores/services/settingsApi";

export default function AdvertsTab() {
  const { data: advertsResponse, isLoading } = useGetAdvertsQuery();
  const [createAdvert, { isLoading: isCreating }] = useCreateAdvertMutation();
  const [updateAdvert, { isLoading: isUpdating }] = useUpdateAdvertMutation();
  const [deleteAdvert, { isLoading: isDeleting }] = useDeleteAdvertMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAdvert, setEditingAdvert] = useState<Advert | null>(null);
  const [deletingAdvertId, setDeletingAdvertId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [position, setPosition] = useState<"top" | "middle" | "bottom">("top");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const adverts = advertsResponse?.data || [];

  const handleOpenDialog = (advert?: Advert) => {
    if (advert) {
      setEditingAdvert(advert);
      setTitle(advert.title);
      setDescription(advert.description);
      setTargetUrl(advert.targetUrl);
      setPosition(advert.position);
      setStartDate(advert.startDate.split("T")[0]);
      setEndDate(advert.endDate.split("T")[0]);
      setStatus(advert.status);
      setImagePreview(advert.image);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingAdvert(null);
    setTitle("");
    setDescription("");
    setTargetUrl("");
    setPosition("top");
    setStartDate("");
    setEndDate("");
    setStatus("active");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!targetUrl.trim()) {
      toast.error("Target URL is required");
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

    if (!editingAdvert && !imageFile) {
      toast.error("Advert image is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("targetUrl", targetUrl.trim());
      formData.append("position", position);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("status", status);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingAdvert) {
        await updateAdvert({ id: editingAdvert._id, formData }).unwrap();
        toast.success("Advert updated successfully");
      } else {
        await createAdvert(formData).unwrap();
        toast.success("Advert created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save advert");
    }
  };

  const handleDelete = async () => {
    if (!deletingAdvertId) return;

    try {
      await deleteAdvert(deletingAdvertId).unwrap();
      toast.success("Advert deleted successfully");
      setIsDeleteDialogOpen(false);
      setDeletingAdvertId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete advert");
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeletingAdvertId(id);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading adverts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Adverts</h2>
          <p className="text-sm text-muted-foreground">Manage promotional banners and adverts</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Advert
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Banner</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adverts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground h-32">
                  No adverts found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              adverts.map((advert:any) => (
                <TableRow key={advert._id}>
                  <TableCell>
                    {advert.image ? (
                      <img
                        src={advert.image}
                        alt={advert.title}
                        className="w-16 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{advert.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {advert.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{advert.position}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(advert.startDate), "MMM dd")} -{" "}
                      {format(new Date(advert.endDate), "MMM dd, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={advert.status === "active" ? "default" : "secondary"}>
                      {advert.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(advert)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(advert._id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAdvert ? "Edit Advert" : "Add Advert"}</DialogTitle>
            <DialogDescription>
              {editingAdvert ? "Update advert details" : "Create a new promotional banner"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Summer Sale 2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the promotion"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetUrl">Target URL *</Label>
              <Input
                id="targetUrl"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com/promotion"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Select value={position} onValueChange={(v) => setPosition(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="middle">Middle</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
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
              <Label htmlFor="image">Banner Image {!editingAdvert && "*"}</Label>
              <div className="space-y-4">
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      ×
                    </Button>
                  </div>
                )}
                <div>
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended size: 1200x400px. Max 5MB, JPG/PNG/GIF
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? "Saving..." : editingAdvert ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Advert</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this advert? This action cannot be undone.
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