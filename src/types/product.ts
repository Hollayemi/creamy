// Product Types

export interface variantType {
    sku: string;
    productId: string;
    salesPrice: number;
    unitType: string;
    unitQuantity: string;
    stockQuantity: number;
    images: string[];
    _id: string;
}

export interface createdByType {
    _id: string;
    name: string;
    email: string;
}

export interface Product {
    _id: string;
    productName: string;
    productId: string;
    sku: string;
    brand: string;
    category: string;
    status: "active" | "inactive";
    description: string;
    tags: string[];
    images: string[];
    salesPrice: number;
    unitType: string;
    unitQuantity: number;
    stockQuantity: number;
    minimumStockAlert: number;
    variants: variantType[];
    inventoryRegions: [],
    createdBy: createdByType;
    updatedBy: createdByType | null;
    regionalDistribution: [],
    createdAt: string;
    updatedAt: string;
    __v: 0
}

export interface ProductVariant {
    id: string;
    sku: string;
    product_id: string;
    sales_price: string;
    unit_type: string;
    unit_quantity: string;
    stock_quantity: string;
}

export interface RegionDistribution {
    region: string;
    main_product: string;
    variant_1?: string;
}

export interface CreateProductInput {
    product_name: string;
    product_id: string;
    sku: string;
    brand?: string;
    category: string;
    status: "Active" | "Inactive";
    description: string;
    sales_price: string;
    unit_type: string;
    unit_quantity: string;
    stock_quantity: string;
    minimum_stock_alert: string;
    tags: string[];
    images: File[];
    variants: Omit<ProductVariant, "id">[];
    region_distribution: RegionDistribution[];
}

export interface UpdateProductInput extends Partial<Omit<CreateProductInput, "images">> {
    images?: (string | File)[];
}

export interface UpdateStockInput {
    stock_quantity: string;
    region?: string;
}

export interface GetProductsParams {
    page?: number;
    per_page?: number;
    search?: string;
    category?: string;
    status?: "active" | "inactive" | "all" | "low-stock" | "out-of-stock";
    sort_by?: string;
    sort_order?: "asc" | "desc";
}

export interface PaginationMeta {
    // current_page: number;
    // first_page_url: string;
    // from: number;
    // last_page: number;
    // last_page_url: string;
    // next_page_url: string | null;
    // path: string;
    // per_page: number;
    // prev_page_url: string | null;
    // to: number;
    // total: number;
    // can_load_more: boolean;

    page: number,
    limit: number,
    total: number,
    pages: number
}

export interface ProductsListResponse {
    message: string;
    data: {
        pagination: PaginationMeta;
        products: Product[];
    };
}


// Product Preview Types
export interface ProductPreview {
    _id: string;
    productId: string;
    sku: string;
    productName: string;
    brand?: string;
    category: string;
    description: string;
    images: string[];
    status: "active" | "inactive";
    tags: string[];
    salesPrice: number;
    unitType: string;
    unitQuantity: string;
    stockQuantity: number;
    totalStock: number;
    minimumStockAlert: number;
    stockStatus: string;
    variants: ProductVariant[];
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    updatedBy: any;
    createdAt: string;
    updatedAt: string;
}

export interface ProductVariant {
    _id: string;
    sku: string;
    productId: string;
    salesPrice: number;
    unitType: string;
    unitQuantity: string;
    stockQuantity: number;
    images: string[];
}

export interface ProductAnalytics {
    totalSales: number;
    totalQuantitySold: number;
    totalOrders: number;
    percentageChange: number;
    salesTrend: Array<{
        month: string;
        revenue: number;
        quantity: number;
    }>;
}

export interface ProductPricing {
    salesPrice: number;
    costPerItem: number;
    profit: number;
    grossMargin: number;
}

export interface RegionInventory {
    region: string;
    currentStock: number;
    lastRestocked: string;
    manager: string;
    status: "Stable" | "Low Stock" | "Out of Stock" | "Balanced";
    variants: Array<{
        variantId: string;
        variantName: string;
        quantity: number;
    }>;
}

export interface StockHistoryItem {
    date: string;
    action: string;
    quantity: number;
    orderNumber: string;
    orderStatus: string;
}

export interface ProductInventory {
    byRegion: RegionInventory[];
    stockHistory: StockHistoryItem[];
}

export interface movementHistory {
    history: StockHistoryItem[];
    pagination: any
}

export interface ProductOverview {
    sku: string;
    category: string;
    stockLevel: string;
    weightQuantity: string;
    availabilityStatus: string;
    tags: string[];
}

export interface ProductPreviewResponse {
    product: ProductPreview;
    analytics: ProductAnalytics;
    pricing: ProductPricing;
    inventory: ProductInventory;
    overview: ProductOverview;
}
