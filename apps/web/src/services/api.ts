import type { Category, Product } from "../types/catalog";

const API_URL = import.meta.env.VITE_API_URL;

export interface ProductFilters {
    category?: string;
    search?: string;
}

type ApiProduct = Omit<Product, "price"> & { price: string };

async function request<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`);

    if (!response.ok) {
        throw new Error(`Erro ${response.status} ao acessar ${path}`);
    }

    return response.json() as Promise<T>;
}

function toProduct(product: ApiProduct): Product {
    return { ...product, price: Number(product.price) };
}

export function getCategories() {
    return request<Category[]>("/categories");
}

export async function getProducts(filters: ProductFilters = {}) {
    const params = new URLSearchParams();

    if (filters.category) params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);

    const query = params.toString();
    const products = await request<ApiProduct[]>(
        `/products${query ? `?${query}` : ""}`
    );

    return products.map(toProduct);
}

export async function getProduct(id: number) {
    const product = await request<ApiProduct>(`/products/${id}`);
    return toProduct(product);
}