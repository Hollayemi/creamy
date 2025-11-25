// Product Types
export interface Product {
    _id: number;
    productName: string;
    productId: string;
    sku: string;
    brand?: string;
    category: string;
    status: "Active" | "Inactive";
    description: string;
    salesPrice: string;
    unitType: string;
    unitQuantity: string;
    stockQuantity: string;
    minimumStockAlert: string;
    tags: string[];
    images: string[];
    variants: ProductVariant[];
    regionDistribution: RegionDistribution[];
    createdAt: string;
    updatedAt: string;
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