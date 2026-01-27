"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  status: z.enum(["Active", "Inactive"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  salesPrice: z.string().min(1, "Sales price is required"),
  unitType: z.string().min(1, "Unit type is required"),
  unitQuantity: z.string().min(1, "Unit quantity is required"),
  stockQuantity: z.string().min(1, "Stock quantity is required"),
  minimumStockAlert: z.string().min(1, "Minimum stock alert is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
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

interface ImagePreview {
  url: string;
  file: File | null;
}

export default function AddNewProductPage() {
  const router = useRouter();
  const [productName, setProductName] = useState("Golden Penny Spaghetti (500g)");
  const [productId, setProductId] = useState("PROD-000245");
  const [sku, setSku] = useState("PF-GPS-500G-001");
  const [brand, setBrand] = useState("Golden Penny");
  const [category, setCategory] = useState("Packaged Foods");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [description, setDescription] = useState(
    "Golden Penny Spaghetti (500g) is a premium-quality pasta made from 100% pure durum wheat semolina, crafted to deliver the perfect texture and taste every time."
  );
  const [salesPrice, setSalesPrice] = useState("5,200");
  const [unitType, setUnitType] = useState("Carton");
  const [unitQuantity, setUnitQuantity] = useState("1 x 500g");
  const [stockQuantity, setStockQuantity] = useState("1,500");
  const [tags, setTags] = useState(["pasta", "grocery", "golden penny"]);
  const [newTag, setNewTag] = useState("");
  const [stockAlert, setStockAlert] = useState("5");
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      id: "1",
      sku: "GP-SPG-CTN",
      productId: "PROD-000241",
      salesPrice: "36,500",
      unitType: "Carton",
      unitQuantity: "20 x 500g",
      stockQuantity: "20",
    },
  ]);

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

  const handleAddVariant = () => {
    if (variants.length >= 5) {
      toast.error("Maximum 5 variants allowed");
      return;
    }

    const newVariant: ProductVariant = {
      id: String(variants.length + 1),
      sku: "",
      productId: "",
      salesPrice: "",
      unitType: "Single",
      unitQuantity: "",
      stockQuantity: "",
    };
    setVariants([...variants, newVariant]);
  };

  const handleRemoveVariant = (variantId: string) => {
    if (variants.length <= 1) {
      toast.error("At least one variant is required");
      return;
    }
    setVariants(variants.filter((v) => v.id !== variantId));
  };

  const handleUpdateVariant = (id: string, field: keyof ProductVariant, value: string) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImagePreview[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 5MB size limit`);
        return;
      }

      const url = URL.createObjectURL(file);
      newImages.push({ url, file });
    });

    setImages([...images, ...newImages]);
    toast.success(`${newImages.length} image(s) uploaded successfully`);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].url);
    newImages.splice(index, 1);
    setImages(newImages);
    toast.info("Image removed");
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
    setStatus("Active");
    setDescription("");
    setSalesPrice("");
    setUnitType("Carton");
    setUnitQuantity("");
    setStockQuantity("");
    setTags([]);
    setStockAlert("5");
    setVariants([
      {
        id: "1",
        sku: "",
        productId: "",
        salesPrice: "",
        unitType: "Single",
        unitQuantity: "",
        stockQuantity: "",
      },
    ]);
    setRegions([]);
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    toast.success("All fields cleared");
  };

  const buildPayload = (uploadType: "draft" | "publish"): ProductFormData | null => {
    try {
      const payload: ProductFormData = {
        productName: productName,
        productId: productId,
        sku: sku,
        brand: brand || undefined,
        category: category,
        status: status,
        description: description,
        salesPrice: salesPrice,
        unitType: unitType,
        unitQuantity: unitQuantity,
        stockQuantity: stockQuantity,
        minimumStockAlert: stockAlert,
        tags: tags,
        images: images.map((img) => img.url),
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
      console.log(`${uploadType.toUpperCase()} Payload:`, JSON.stringify(payload, null, 2));
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

  const handleSaveDraft = async () => {
    const payload = buildPayload("draft");
    if (!payload) return;

    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Append images
      images.forEach((img, index) => {
        if (img.file) formData.append(`images`, img.file);
      });

      // Append JSON data
      formData.append("data", JSON.stringify(payload));
      formData.append("upload_type", "draft");

      // TODO: Replace with your actual API endpoint
      // const response = await fetch("/api/products/draft", {
      //   method: "POST",
      //   body: formData,
      // });
      // const result = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Product saved as draft");
    } catch (error) {
      toast.error("Failed to save draft");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    const payload = buildPayload("publish");
    if (!payload) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      images.forEach((img, index) => {
        if (img.file) formData.append(`images`, img.file);
      });

      formData.append("data", JSON.stringify(payload));
      formData.append("upload_type", "publish");

      // TODO: Replace with your actual API endpoint
      // const response = await fetch("/api/products/publish", {
      //   method: "POST",
      //   body: formData,
      // });
      // const result = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Product published successfully");
      router.push("/dashboard/products");
    } catch (error) {
      toast.error("Failed to publish product");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Button variant="outline" onClick={handleClearAll} disabled={isSubmitting}>
                <Trash color="red" />
              </Button>
              <Button variant="outline" disabled={isSubmitting}>
                <Download />
                Import
              </Button>
              <Button variant="outline" onClick={handleSaveDraft} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </Button>
              <Button onClick={handlePublish} disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </div>

          <div className="grid gap-2 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-6 border rounded-xl">
              <h1 className="text-xl font-[500] m-5">Add New Product</h1>

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
                          <SelectItem value="Packaged Foods">Packaged Foods</SelectItem>
                          <SelectItem value="Beverages">Beverages</SelectItem>
                          <SelectItem value="Household">Household</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={(v) => setStatus(v as "Active" | "Inactive")}>
                        <SelectTrigger className="w-full h-11! bg-muted" id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
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
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Carton">Carton</SelectItem>
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
                  <CardTitle>Product Image</CardTitle>
                  <p className="text-sm text-muted-foreground">Tag</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2 bg-muted p-2 border rounded-md">
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
                    {images.map((img, index) => (
                      <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border">
                        <img src={img.url} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute right-1 top-1 rounded-full bg-white/90 p-1 opacity-0 shadow-md transition-opacity hover:bg-white group-hover:opacity-100"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    ))}

                    {images.length < 6 && (
                      <label className="border-input hover:bg-accent/50 flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors">
                        <Upload className="text-muted-foreground mb-2 h-6 w-6" />
                        <span className="text-muted-foreground text-xs text-center px-2">Click to upload</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Only images of jpg, jpeg, png and a minimum size of 800 x 400px. Max 5MB per image. Maximum 6
                    images.
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
                  {variants.map((variant, index) => (
                    <div key={variant.id} className="mb-6 last:mb-0 pb-4 border-b last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium">Variant {index + 1}</p>
                        {variants.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVariant(variant.id)}
                            className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
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
                              <SelectItem value="Carton">Carton</SelectItem>
                              <SelectItem value="Single">Single</SelectItem>
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
                  ))}
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