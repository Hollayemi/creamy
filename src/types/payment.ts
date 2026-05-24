import { OrderPagination } from "./order";

export interface PaymentMethod {
    "_id": string;
    "id": string;
    "name": string;
    "description": string;
    "logo": string;
    "enabled": boolean,
    "sortOrder": number
}

export interface PaginatePlans<T>{
    plans: T;
    pagination: OrderPagination
}

export interface Plan {
    _id: string;
    name: string;
    description: string;
    price: number;
    durationDays: number;
    discountPercentage: number;
    maxDiscountAmountPerOrder?: number;
    features: string[];
    isActive: boolean;
    badgeColor?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePlanPayload {
    name: string;
    description: string;
    price: number;
    durationDays: number;
    discountPercentage: number;
    maxDiscountAmountPerOrder?: number;
    features: string[];
    badgeColor?: string;
}

export interface UpdatePlanPayload {
    name?: string;
    description?: string;
    price?: number;
    durationDays?: number;
    discountPercentage?: number;
    maxDiscountAmountPerOrder?: number;
    features?: string[];
    badgeColor?: string;
    isActive?: boolean;
}

