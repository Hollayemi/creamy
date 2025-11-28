// src/app/(main)/dashboard/product-management/[id]/edit/page.tsx
"use client"

import { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Upload, X, Plus, Download, Trash, Loader2 } from "lucide-react";
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
import { useGetProductQuery, useUpdateProductMutation } from "@/stores/services/productApi";

// Zod Validation Schema matching backend validator
const productUpdateSchema = z.object({
    productName: z.string().min(3, "Product name must be at least 3 characters").max(200, "Product name cannot exceed 200 characters").optional(),
    sku: z.string().regex(/^[A-Z0-9-]+$/, "SKU can only contain uppercase letters, numbers, and hyphens").optional(),
    brand: z.string().optional(),
    category: z.enum(['Packaged Foods', 'Beverages', 'Fresh Produce', 'Dairy', 'Meat & Seafood', 'Bakery', 'Snacks', 'Household', 'Personal Care', 'Other']).optional(),
    status: z.enum(['active', 'inactive', 'draft']).optional(),
    description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description cannot exceed 2000 characters").optional(),
    salesPrice: z.number().min(0, "Sales price must be a positive number").optional(),
    unitType: z.enum(['single', 'pack', 'carton', 'kg', 'litre', 'box']).optional(),
    unitQuantity: z.string().optional(),
    stockQuantity: z.number().min(0, "Stock quantity must be a non-negative number").optional(),
    minimumStockAlert: z.string().optional(),
    tags: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
});

type ProductUpdateFormData = z.infer<typeof productUpdateSchema>;

interface ImagePreview {
    url: string;
    file: File | null;
    isExisting: boolean;
}

export default function EditProductPage({ params }: any) {
    const myParams = use(params);
    const router = useRouter();
    const productId = "6924f6b281b1e6feb92992e0" // myParams?.id as string;

    // Fetch existing product data
    const { data: productData, isLoading: isFetching, isError } = useGetProductQuery(productId, {
        skip: !productId,
    });

    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    // Form states
    const [productName, setProductName] = useState("");
    const [productIdValue, setProductIdValue] = useState("");
    const [sku, setSku] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState<"active" | "inactive" | "draft">("active");
    const [description, setDescription] = useState("");
    const [salesPrice, setSalesPrice] = useState("");
    const [unitType, setUnitType] = useState("carton");
    const [unitQuantity, setUnitQuantity] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [stockAlert, setStockAlert] = useState("5");
    const [images, setImages] = useState<ImagePreview[]>([]);

    const categories = ['Packaged Foods', 'Beverages', 'Fresh Produce', 'Dairy', 'Meat & Seafood',
        'Bakery', 'Snacks', 'Household', 'Personal Care', 'Other'];
    const unitTypes = ['single', 'pack', 'carton', 'kg', 'litre', 'box'];

    // Load product data into form
    useEffect(() => {
        if (productData?.data) {
            const product = productData.data;
            setProductName(product.productName || "");
            setProductIdValue(product.productId || "");
            setSku(product.sku || "");
            setBrand(product.brand || "");
            setCategory(product.category || "");
            setStatus((product.status?.toLowerCase() as "active" | "inactive" | "draft") || "active");
            setDescription(product.description || "");
            setSalesPrice(product.salesPrice?.toString() || "");
            setUnitType(product.unitType || "carton");
            setUnitQuantity(product.unitQuantity || "");
            setStockQuantity(product.stockQuantity?.toString() || "");
            setStockAlert(product.minimumStockAlert || "5");
            setTags(product.tags || []);

            // Load existing images
            if (product.images && product.images.length > 0) {
                setImages(product.images.map(url => ({
                    url,
                    file: null,
                    isExisting: true
                })));
            }
        }
    }, [productData]);

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
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
            newImages.push({ url, file, isExisting: false });
        });

        setImages([...images, ...newImages]);
        toast.success(`${newImages.length} image(s) uploaded successfully`);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        if (!newImages[index].isExisting) {
            URL.revokeObjectURL(newImages[index].url);
        }
        newImages.splice(index, 1);
        setImages(newImages);
        toast.info("Image removed");
    };

    const buildPayload = (): ProductUpdateFormData | null => {
        try {
            // Only include changed fields
            const payload: any = {};

            if (productName !== productData?.data?.productName) {
                payload.productName = productName;
            }
            if (sku !== productData?.data?.sku) {
                payload.sku = sku.toUpperCase();
            }
            if (brand !== productData?.data?.brand) {
                payload.brand = brand || undefined;
            }
            if (category !== productData?.data?.category) {
                payload.category = category;
            }
            if (status !== productData?.data?.status?.toLowerCase()) {
                payload.status = status;
            }
            if (description !== productData?.data?.description) {
                payload.description = description;
            }
            if (salesPrice !== productData?.data?.salesPrice?.toString()) {
                payload.salesPrice = parseFloat(salesPrice.replace(/,/g, ''));
            }
            if (unitType !== productData?.data?.unitType) {
                payload.unitType = unitType;
            }
            if (unitQuantity !== productData?.data?.unitQuantity) {
                payload.unitQuantity = unitQuantity;
            }
            if (stockQuantity !== productData?.data?.stockQuantity?.toString()) {
                payload.stockQuantity = parseInt(stockQuantity.replace(/,/g, ''));
            }
            if (stockAlert !== productData?.data?.minimumStockAlert) {
                payload.minimumStockAlert = stockAlert;
            }
            if (JSON.stringify(tags) !== JSON.stringify(productData?.data?.tags)) {
                payload.tags = tags;
            }

            // Handle images - only include if changed
            const currentImageUrls = images.filter(img => img.isExisting).map(img => img.url);
            if (JSON.stringify(currentImageUrls) !== JSON.stringify(productData?.data?.images)) {
                payload.images = images.map(img => img.url);
            }

            // Validate only the fields we're updating
            if (Object.keys(payload).length > 0) {
                productUpdateSchema.parse(payload);
                return payload;
            }

            toast.info("No changes detected");
            return null;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const firstError = error.errors[0];
                toast.error(firstError.message);
                console.error("Validation errors:", error.errors);
            }
            return null;
        }
    };

    const handleUpdate = async () => {
        const payload = buildPayload();
        if (!payload) return;

        try {
            const formData = new FormData();

            // Add new image files
            images.forEach((img) => {
                if (img.file) {
                    formData.append('images', img.file);
                }
            });

            // Append JSON data
            formData.append("data", JSON.stringify(payload));

            await updateProduct({ id: Number(productId), data: formData }).unwrap();

            toast.success("Product updated successfully");
            router.push(`/dashboard/product-management/${productId}/preview`);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update product");
            console.error(error);
        }
    };

    // Loading state
    if (isFetching) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-sm text-muted-foreground">Loading product...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError || !productData?.data) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-semibold text-destructive">Failed to load product</p>
                    <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6 flex justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ChevronLeft size={20} />
                            <button onClick={() => router.back()}>Back to Product</button>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => router.push(`/dashboard/product-management/${productId}/preview`)}
                                disabled={isUpdating}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleUpdate} disabled={isUpdating}>
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Product'
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-2 lg:grid-cols-5">
                        <div className="lg:col-span-3 space-y-6 border rounded-xl">
                            <h1 className="text-xl font-[500] m-5">Edit Product</h1>

                            <Card className="border-none shadow-none">
                                <CardHeader>
                                    <CardTitle className="text-normal">Product Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="productName">Product Name *</Label>
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
                                                value={productIdValue}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="sku">SKU *</Label>
                                            <Input
                                                className="h-10 w-full! min-w-full mb-4 bg-muted"
                                                id="sku"
                                                value={sku}
                                                onChange={(e) => setSku(e.target.value.toUpperCase())}
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
                                            <Label htmlFor="category">Category *</Label>
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
                                            <Label htmlFor="status">Status *</Label>
                                            <Select value={status} onValueChange={(v) => setStatus(v as "active" | "inactive" | "draft")}>
                                                <SelectTrigger className="w-full h-11! bg-muted" id="status">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description *</Label>
                                        <Textarea
                                            id="description"
                                            rows={6}
                                            className="leading-8"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {description.length}/2000 characters
                                        </p>
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
                                            <Label htmlFor="salesPrice">Sales Price *</Label>
                                            <Input
                                                className="h-10 w-full! min-w-full mb-4 bg-muted"
                                                id="salesPrice"
                                                type="number"
                                                value={salesPrice}
                                                onChange={(e) => setSalesPrice(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="unitType">Unit Type *</Label>
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
                                            <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                                            <Input
                                                className="h-10 w-full! min-w-full mb-4 bg-muted"
                                                id="stockQuantity"
                                                type="number"
                                                value={stockQuantity}
                                                onChange={(e) => setStockQuantity(e.target.value)}
                                            />
                                        </div>
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
                                    <div className="flex items-center gap-2">
                                        <Input
                                            placeholder="Add tag"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                            className="flex-1"
                                        />
                                        <Button type="button" onClick={handleAddTag} size="sm">
                                            Add
                                        </Button>
                                    </div>

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
                                        Only images of jpg, jpeg, png and a minimum size of 800 x 400px. Max 5MB per image. Maximum 6 images.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}