import type { Product } from "./catalog";

export interface AdminProduct extends Product {
    isVisible: boolean;
    sortOrder: number;
    categoryId: number;
    updatedAt: string;
}

export type AdminProductUpdate = Partial<
    Pick<
        AdminProduct,
        | "name"
        | "description"
        | "price"
        | "imageUrl"
        | "categoryId"
        | "isAvailable"
        | "isVisible"
        | "isFeatured"
    >
>;
