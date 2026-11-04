export interface Category {
    id: number;
    name: string;
    slug: string;
    sortOrder: number;
}

export type CategorySummary = Pick<Category, "id" | "name" | "slug">;

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    isFeatured: boolean;
    category: CategorySummary;
}