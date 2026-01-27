"use client";

import { use, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Upload, X, Plus, Download, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MultiSelect } from "@/components/ui/select-multiple";
import { z } from "zod";
import { useCreateProductMutation, useGetProductQuery, useUpdateProductMutation } from "@/stores/services/productApi";

// Zod Validation Schema
const productVariantSchema = z.object({
  id: z.string(),
  sku: z.string().min(1, "SKU is required"),
  productId: z.string().min(1, "Product ID is required"),
  salesPrice: z.string().min(1, "Sales price is required"),
  unitType: z.string().min(1, "Unit type is required"),
  unitQuantity: z.string().min(1, "Unit quantity is required"),
  stockQuantity: z.string().min(1, "Stock quantity is required"),
});

const regionStockSchema = z.object({
  region: z.string(),
  main_product: z.string().min(1, "Main product stock is required"),
  variant_1: z.string().optional(),
});

const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productId: z.string().min(1, "Product ID is required"),
  sku: z.string().min(1, "SKU is required"),
  brand: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  status: z.enum(['active', 'inactive', 'draft']),
  description: z.string().min(10, "Description must be at least 10 characters"),
  salesPrice: z.string().min(1, "Sales price is required"),
  unitType: z.string().min(1, "Unit type is required"),
  unitQuantity: z.string().min(1, "Unit quantity is required"),
  stockQuantity: z.string().min(1, "Stock quantity is required"),
  minimumStockAlert: z.string().min(1, "Minimum stock alert is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  variants: z.array(productVariantSchema).max(5, "Maximum 5 variants allowed"),
  regionDistribution: z.array(regionStockSchema).min(1, "At least one region is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductVariant {
  id: string;
  sku: string;
  productId: string;
  salesPrice: string;
  unitType: string;
  unitQuantity: string;
  stockQuantity: string;
}

interface RegionStock {
  region: string;
  mainProduct: string;
  variant: string;
}

interface Params {
  createOrEdit: "create" | "edit" | "duplicate"
}

const allowedScreens = ["duplicate", "create", "edit"]

export default function AddNewProductPage({ searchParams }: any) {

  const myParams = useParams() as unknown as Params
  const mySearchParams = use(searchParams) as any

  const showing = myParams.createOrEdit

  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"active" | "inactive" | "draft">("active");
  const [description, setDescription] = useState("");
  const [salesPrice, setSalesPrice] = useState("");
  const [unitType, setUnitType] = useState("");
  const [unitQuantity, setUnitQuantity] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [stockAlert, setStockAlert] = useState("5");
  
  // Updated image states for Cloudinary
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  const [uploadProductHandler, { isLoading: isSubmitting }] = useCreateProductMutation()
  const [updateProductHandler, { isLoading: isUpdating }] = useUpdateProductMutation()

  // Fetch existing product data
  const { data: productData, isLoading: isFetching, isError: fetchError } = useGetProductQuery(mySearchParams?.id, {
    skip: !mySearchParams?.id || showing !== "edit",
  });

  const categories = ['Packaged Foods', 'Beverages', 'Fresh Produce', 'Dairy', 'Meat & Seafood',
    'Bakery', 'Snacks', 'Household', 'Personal Care', 'Other']

  const unitTypes = ['single', 'pack', 'carton', 'kg', 'litre', 'box']

  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const availableRegions = ["Surulere", "Ikeja", "Yaba", "Lekki-Ajah", "Agege"];
  const [regions, setRegions] = useState<RegionStock[]>([]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {
    if (!fetchError && productData?.data) {
      const fetched = productData?.data || {};
      setProductName(fetched.productName);
      setProductId(fetched.productId);
      setDescription(fetched.description);
      setBrand(fetched.brand);
      setCategory(fetched.category);
      setStatus(fetched.status);
      setStockQuantity(fetched.stockQuantity?.toString());
      setSku(fetched.sku);
      setSalesPrice(fetched.salesPrice?.toString());
      setUnitType(fetched.unitType);
      setUnitQuantity(fetched.unitQuantity?.toString());
      setStockAlert(fetched.minimumStockAlert?.toString());
      setTags(fetched.tags || []);
      
      // Set existing images for edit mode
      if (showing === "edit" && fetched.images) {
        setExistingImages(fetched.images);
      }
      
      // Set variants if available
      if (fetched.variants && fetched.variants.length > 0) {
        setVariants(fetched.variants.map((v: any, index: number) => ({
          id: String(index + 1),
          sku: v.sku || "",
          productId: v.productId || fetched.productId,
          salesPrice: v.salesPrice?.toString() || "",
          unitType: v.unitType || "",
          unitQuantity: v.unitQuantity?.toString() || "",
          stockQuantity: v.stockQuantity?.toString() || "",
        })));
      }
      
      // Set regional distribution if available
      if (fetched.regionalDistribution && fetched.regionalDistribution.length > 0) {
        setRegions(fetched.regionalDistribution.map((r: any) => ({
          region: r.region,
          mainProduct: r.mainProduct?.toString() || "0",
          variant: r.variants?.[0]?.quantity?.toString() || "",
        })));
      }
    }
  }, [productData, fetchError, showing]);

  // Cleanup effect for memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleAddVariant = () => {
    if (variants.length >= 5) {
      toast.error("Maximum 5 variants allowed");
      return;
    }

    const newVariant: ProductVariant = {
      id: String(variants.length + 1),
      sku: "",
      productId,
      salesPrice: "",
      unitType: "single",
      unitQuantity: "",
      stockQuantity: "",
    };
    setVariants([...variants, newVariant]);
  };

  const handleRemoveVariant = (variantId: string) => {
    setVariants(variants.filter((v) => v.id !== variantId));
  };

  const handleUpdateVariant = (id: string, field: keyof ProductVariant, value: string) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Check total image count (existing + new + current)
    const totalCount = existingImages.length + images.length + files.length;
    if (totalCount > 6) {
      toast.error(`Cannot upload more than 6 images total. You have ${existingImages.length + images.length} already.`);
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 5MB size limit`);
        return;
      }

      newFiles.push(file);
      const url = URL.createObjectURL(file);
      newPreviews.push(url);
    });

    setImages([...images, ...newFiles]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
    toast.success(`${newFiles.length} image(s) added successfully`);
  };

  const handleRemoveImage = (index: number, existing: boolean = false) => {
    if (existing) {
      const newImages = [...existingImages];
      newImages.splice(index, 1);
      setExistingImages(newImages);
      toast.info("Image removed");
    } else {
      const newImages = [...images];
      const newPreviews = [...imagePreviews];
      
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(newPreviews[index]);
      
      newImages.splice(index, 1);
      newPreviews.splice(index, 1);
      
      setImages(newImages);
      setImagePreviews(newPreviews);
      toast.info("Image removed");
    }
  };

  const handleClearAll = () => {
    if (!confirm("Are you sure you want to clear all fields? This action cannot be undone.")) {
      return;
    }

    setProductName("");
    setProductId("");
    setSku("");
    setBrand("");
    setCategory("");
    setStatus("active");
    setDescription("");
    setSalesPrice("");
    setUnitType("");
    setUnitQuantity("");
    setStockQuantity("");
    setTags([]);
    setStockAlert("5");
    setVariants([]);
    setRegions([]);
    
    // Clean up image previews
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImages([]);
    setImagePreviews([]);
    setExistingImages([]);
    
    toast.success("All fields cleared");
  };

  const buildPayload = (uploadType: string) => {
    // Validate image count before building payload
    const totalImages = existingImages.length + images.length;
    if (totalImages < 2) {
      toast.error("Product must have at least 2 images");
      return null;
    }

    try {
      const payload = {
        productName: productName,
        productId: productId,
        sku: sku,
        brand: brand || undefined,
        category: category,
        status: uploadType === 'draft' ? 'draft' : status,
        description: description,
        salesPrice: salesPrice,
        unitType: unitType,
        unitQuantity: unitQuantity,
        stockQuantity: stockQuantity,
        minimumStockAlert: stockAlert,
        tags: tags,
        variants: variants.map((v) => ({
          id: v.id,
          sku: v.sku,
          productId: v.productId,
          salesPrice: v.salesPrice,
          unitType: v.unitType,
          unitQuantity: v.unitQuantity,
          stockQuantity: v.stockQuantity,
        })),
        regionDistribution: regions.map((r) => ({
          region: r.region,
          main_product: r.mainProduct,
          variant_1: r.variant || undefined,
        })),
      };

      productSchema.parse(payload);
      return payload;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
        console.error("Validation errors:", error.errors);
      }
      return null;
    }
  };

  const handleSave = async (action: string = "active") => {
    const payload = buildPayload(action);
    if (!payload) return;

    try {
      const formData = new FormData();

      // Append all new image files
      images.forEach((file) => {
        formData.append('images', file);
      });

      // Append all form fields
      Object.keys(payload).forEach((key) => {
        const value = payload[key as keyof typeof payload];
        
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (showing === "edit") {
        console.log('Updating product with ID:', mySearchParams?.id);
        // For edit, also send existing images that should be kept
        formData.append('existingImages', JSON.stringify(existingImages));
        formData.append('_id', mySearchParams?.id);
        
        console.log('FormData entries for update:', formData);

        const response = await updateProductHandler(formData).unwrap();
        toast.success("Product updated successfully");
        console.log(response);
        router.push("/dashboard/product-management");
      } else {
        const response = await uploadProductHandler(formData).unwrap();
        toast.success(action === 'draft' ? "Product saved as draft" : "Product created successfully");
        console.log(response);
        router.push("/dashboard/product-management");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save product");
      console.error(error);
    }
  };

  if (!allowedScreens.includes(showing)) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <h4>404, Page Not Found</h4>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ChevronLeft size={20} />
          <button onClick={() => router.back()}>Back to Inventory</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ChevronLeft size={20} />
              <button onClick={() => router.back()}>Back to Inventory</button>
            </div>
            <div className="flex gap-2">
              {showing !== "edit" ? (
                <>
                  <Button variant="outline" onClick={handleClearAll} disabled={isSubmitting}>
                    <Trash color="red" />
                  </Button>
                  <Button variant="outline" disabled={isSubmitting}>
                    <Download />
                    Import
                  </Button>
                  <Button variant="outline" onClick={() => handleSave("draft")} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save as Draft"}
                  </Button>
                  <Button onClick={() => handleSave()} disabled={isSubmitting}>
                    {isSubmitting ? "Publishing..." : "Publish"}
                  </Button>
                </>) : (
                <Button onClick={() => handleSave()} disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-2 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-6 border rounded-xl">
              <h1 className="text-xl font-[500] m-5 capitalize">{showing === "create" ? "Add New" : showing} Product</h1>

              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-normal">Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        className="h-10 w-full! min-w-full mb-4 bg-muted"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productId">Product ID</Label>
                      <Input
                        className="h-10 w-full! min-w-full mb-4 bg-muted"
                        id="productId"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        className="h-10 w-full! min-w-full mb-4 bg-muted"
                        id="sku"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand (Optional)</Label>
                      <Input
                        className="h-10 w-full! min-w-full mb-4 bg-muted"
                        id="brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-full h-11! bg-muted" id="category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((e, i) =>
                            <SelectItem key={i} value={e}>{e}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={(v) => setStatus(v as "active" | "inactive" | "draft")}>
                        <SelectTrigger className="w-full h-11! bg-muted" id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={6}
                      className="leading-8"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="salesPrice">Sales Price</Label>
                      <Input
                        className="h-10 w-full! min-w-full mb-4 bg-muted"
                        id="salesPrice"
                        value={salesPrice}
                        onChange={(e) => setSalesPrice(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unitType">Unit Type</Label>
                      <Select value={unitType} onValueChange={setUnitType}>
                        <SelectTrigger className="w-full h-11! bg-muted" id="unitType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {unitTypes.map((e, i) =>
                            <SelectItem key={i} value={e}>{e}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="unitQuantity">Unit Quantity</Label>
                      <Input
                        className="h-10 w-full! min-w-full mb-4 bg-muted"
                        id="unitQuantity"
                        value={unitQuantity}
                        onChange={(e) => setUnitQuantity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stockQuantity">Stock Quantity</Label>
                      <Input
                        className="h-10 w-full! min-w-full mb-4 bg-muted"
                        id="stockQuantity"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="Regions">Inventory Region</Label>
                      <MultiSelect
                        options={availableRegions.map((each: string) => ({ value: each, label: each }))}
                        value={regions.map((each) => each.region)}
                        customOnchange={(value: string) =>
                          setRegions((prev) => {
                            const exists = prev.find((r) => r.region === value);
                            if (exists) {
                              return prev.filter((r) => r.region !== value);
                            }
                            return [...prev, { region: value, mainProduct: "0", variant: "" }];
                          })
                        }
                        fixedPlaceholder={`Select Regions (${regions.length}) selected`}
                        triggerClassName="h-11 bg-muted"
                        contentClassName="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stockAlert">Minimum Stock Alert</Label>
                      <Select value={stockAlert} onValueChange={setStockAlert}>
                        <SelectTrigger className="w-full h-11! bg-muted" id="stockAlert">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="30">30</SelectItem>
                          <SelectItem value="40">40</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {regions.map((tag) => (
                      <Badge key={tag.region} variant="outline" className="gap-1">
                        {tag.region}
                        <button
                          onClick={() => setRegions((prev) => prev.filter((r) => r.region !== tag.region))}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 lg:col-span-2">
              <Card className="shadow-none border-0">
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <p className="text-sm text-muted-foreground">Tags</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      className="h-10 bg-muted"
                    />
                    <Button onClick={handleAddTag} size="sm">Add</Button>
                  </div>

                  <div className="flex flex-wrap gap-2 bg-muted p-2 border rounded-md min-h-[50px]">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="gap-1">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Display existing images (for edit mode) */}
                    {existingImages.map((img, index) => (
                      <div key={`existing-${index}`} className="group relative aspect-square overflow-hidden rounded-lg border">
                        <img src={img} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          onClick={() => handleRemoveImage(index, true)}
                          className="absolute right-1 top-1 rounded-full bg-white/90 p-1 opacity-0 shadow-md transition-opacity hover:bg-white group-hover:opacity-100"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Display new image previews */}
                    {imagePreviews.map((preview, index) => (
                      <div key={`new-${index}`} className="group relative aspect-square overflow-hidden rounded-lg border">
                        <img src={preview} alt={`New product ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          onClick={() => handleRemoveImage(index, false)}
                          className="absolute right-1 top-1 rounded-full bg-white/90 p-1 opacity-0 shadow-md transition-opacity hover:bg-white group-hover:opacity-100"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    ))}

                    {/* Upload button - only show if less than 6 total images */}
                    {(existingImages.length + images.length) < 6 && (
                      <label className="border-input hover:bg-accent/50 flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors">
                        <Upload className="text-muted-foreground mb-2 h-6 w-6" />
                        <span className="text-muted-foreground text-xs text-center px-2">Click to upload</span>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageUpload} 
                        />
                      </label>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Minimum 2 images required. Only JPG, JPEG, PNG formats. Max 5MB per image. Maximum 6 images total.
                    {existingImages.length > 0 && ` (${existingImages.length} existing + ${images.length} new = ${existingImages.length + images.length} total)`}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-none">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Product Variants ({variants.length}/5)</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleAddVariant} disabled={variants.length >= 5}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
                  </Button>
                </CardHeader>
                <CardContent>
                  {variants.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No variants added yet
                    </p>
                  ) : (
                    variants.map((variant, index) => (
                      <div key={variant.id} className="mb-6 last:mb-0 pb-4 border-b last:border-b-0">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-medium">Variant {index + 1}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVariant(variant.id)}
                            className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>SKU</Label>
                            <Input
                              className="h-10 w-full bg-muted"
                              value={variant.sku}
                              onChange={(e) => handleUpdateVariant(variant.id, "sku", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Product Id</Label>
                            <Input
                              className="h-10 w-full bg-muted"
                              disabled
                              value={variant.productId}
                              onChange={(e) => handleUpdateVariant(variant.id, "productId", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Sales Price</Label>
                            <Input
                              className="h-10 w-full bg-muted"
                              value={variant.salesPrice}
                              onChange={(e) => handleUpdateVariant(variant.id, "salesPrice", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Unit Type</Label>
                            <Select
                              value={variant.unitType}
                              onValueChange={(v) => handleUpdateVariant(variant.id, "unitType", v)}
                            >
                              <SelectTrigger className="w-full h-11 bg-muted">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {unitTypes.map((e, i) =>
                                  <SelectItem key={i} value={e}>{e}</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Unit Quantity</Label>
                            <Input
                              className="h-10 w-full bg-muted"
                              value={variant.unitQuantity}
                              onChange={(e) => handleUpdateVariant(variant.id, "unitQuantity", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Stock Quantity</Label>
                            <Input
                              className="h-10 w-full bg-muted"
                              value={variant.stockQuantity}
                              onChange={(e) => handleUpdateVariant(variant.id, "stockQuantity", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>

                <CardHeader>
                  <CardTitle>Region Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 pb-2 text-sm font-medium border-b">
                      <div>Region</div>
                      <div>Main Product</div>
                      <div>Variant</div>
                    </div>
                    {regions.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Select regions above to manage distribution
                      </p>
                    ) : (
                      regions.map((region, index) => (
                        <div key={index} className="grid grid-cols-3 items-center gap-4">
                          <div className="text-sm font-medium">{region.region}</div>
                          <Input
                            className="h-9 w-full bg-muted"
                            placeholder="0"
                            value={region.mainProduct}
                            onChange={(e) =>
                              setRegions((prev) =>
                                prev.map((r) =>
                                  r.region === region.region ? { ...r, mainProduct: e.target.value } : r
                                )
                              )
                            }
                          />
                          <Input
                            className="h-9 w-full bg-muted"
                            placeholder="0"
                            value={region.variant}
                            onChange={(e) =>
                              setRegions((prev) =>
                                prev.map((r) => (r.region === region.region ? { ...r, variant: e.target.value } : r))
                              )
                            }
                          />
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}