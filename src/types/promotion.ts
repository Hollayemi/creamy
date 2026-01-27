// Base types
export interface BasePagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface Stats {
    activePromotions: number;
    upcomingPromotions: number;
    endedPromotions: number;
    mostRedeemedPromo: string;
    totalOrdersWithDiscounts: number;
}
export type promoType = 'Percentage' | 'Fixed' | 'Free-Shipping';
export type status = 'draft' | 'active' | 'running' | 'ended' | 'disabled';

export interface CreatedBy {
    _id: string;
    name: string;
    email: string;
}

// Coupon/Promotion types
export interface Coupon {
    _id: string;
    promoName: string;
    code: string;
    discountType: promoType;
    value: number;
    usageLimit: number;
    used: number;
    startDate: string;
    endDate: string;
    status: status;
    createdBy: CreatedBy;
    description?: string;
    minimumOrderValue?: number;
    applicableCategories?: string[];
    applicableProducts: string[];
    perUserLimit?: number;
    promoType?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Request/Response types
export interface CouponsListResponse {
    coupons: Coupon[];
    pagination: BasePagination;
    stats: Stats;
}

export interface SingleCouponResponse {
    data: Coupon;
    success: boolean;
    message: string;
}

export interface GetCouponsParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
}

// Mutation input types
export interface CreateCouponInput {
    promotionName: string;
    promoType: promoType;
    couponCode: string;
    discountValue: number;
    usageLimit: number;
    perUserLimit?: number;
    description?: string;
    minimumOrderValue?: number;
    applicableCategories?: string[];
    applicableProducts: string[];
    startDateTime?: Date;
    endDateTime?: Date;
}

export interface UpdateCouponInput extends Partial<CreateCouponInput> {
    _id: string;
}

export interface BulkUpdateCouponInput {
    ids: string[];
    status?: string;
    // Add other bulk update fields as needed
}

export interface UpdateCouponStatusInput {
    status: 'draft' | 'active' | 'disabled';
}

export interface ToggleStatusResponse {
    status: string;
    enabled: boolean;
}