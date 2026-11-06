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

export interface AdminProductInput {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: number;
    isAvailable: boolean;
    isVisible: boolean;
    isFeatured: boolean;
}
