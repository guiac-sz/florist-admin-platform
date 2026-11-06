import type { Category, Product } from "../types/catalog";

const API_URL = import.meta.env.VITE_API_URL;

export interface ProductFilters {
    category?: string;
    search?: string;
}

type ApiProduct = Omit<Product, "price"> & { price: string };

interface ApiErrorBody {
    message?: string | string[];
}

export class ApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

interface RequestOptions {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string | null;
}

export async function request<T>(
    path: string,
    { method = "GET", body, token }: RequestOptions = {}
): Promise<T> {
    const headers: Record<string, string> = {};

    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as ApiErrorBody | null;

        const message = Array.isArray(errorBody?.message)
            ? errorBody.message.join(" ")
            : (errorBody?.message ?? `Erro ${response.status} ao acessar ${path}`);

        throw new ApiError(response.status, message);
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