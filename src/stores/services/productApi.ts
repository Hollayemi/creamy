import { baseApi } from "../baseApi";
import type { BaseResponse } from "../api/types";
import { GetProductsParams, movementHistory, Product, ProductPreviewResponse, ProductsListResponse, StockHistoryItem, UpdateStockInput } from "@/types/product";



export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /product - List all products with pagination
        getProducts: builder.query<ProductsListResponse, GetProductsParams | undefined>({
            query: (params) => ({
                url: "/product",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.products.map(({ _id }) => ({ type: "Products" as const, id: _id })),
                        { type: "Products", id: "LIST" },
                    ]
                    : [{ type: "Products", id: "LIST" }],
        }),

        // GET /product/:id - Get single product by ID
        getProduct: builder.query<BaseResponse<Product>, string>({
            query: (id) => ({
                url: `/product/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Products", id }],
        }),

        // POST /product - Create new product
        createProduct: builder.mutation<BaseResponse<Product>, any>({
            query: (data) => ({
                url: "/product",
                method: "POST",
                data,
                isFormData: true    
            }),
            invalidatesTags: [{ type: "Products", id: "LIST" }],
        }),

        getProductPreview: builder.query<BaseResponse<ProductPreviewResponse>, string>({
            query: (id) => ({
                url: `/product/${id}/preview`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Products", id: `${id}-preview` }],
        }),

        getProductMovementHistory: builder.query<BaseResponse<movementHistory[]>, string>({
            query: (id) => ({
                url: `/product/${id}/stock-history`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Products", id: `${id}-preview` }],
        }),

        // PUT /product/:id - Update existing product
        updateProduct: builder.mutation<BaseResponse<Product>, any>({
            query: (data) => ({
                url: `/product`,
                method: "PUT",
                data,
                isFormData: true
            }),
            invalidatesTags: (result, error, { _id }) => [
                { type: "Products", id: _id },
                { type: "Products", id: "LIST" },
            ],
        }),

        // DELETE /product/:id - Delete product
        deleteProduct: builder.mutation<BaseResponse, string>({
            query: (id) => ({
                url: `/product/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Products", id: "LIST" }],
        }),

        // PATCH /product/:id/stock - Update product stock
        updateStock: builder.mutation<BaseResponse<Product>, { id: number; data: UpdateStockInput }>({
            query: ({ id, data }) => ({
                url: `/product/${id}/stock`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Products", id },
                { type: "Products", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useGetProductPreviewQuery,
    useGetProductMovementHistoryQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUpdateStockMutation,
} = productApi;