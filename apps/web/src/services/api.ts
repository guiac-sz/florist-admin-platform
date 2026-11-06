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
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string | null;
}

export async function request<T>(
    path: string,
    { method = "GET", body, token }: RequestOptions = {}
): Promise<T> {
    const headers: Record<string, string> = {};
    const isFormData = body instanceof FormData;

    // Arquivos (FormData) vão do jeito que estão: o navegador monta o
    // cabeçalho multipart sozinho. O resto vai como JSON.
    if (body !== undefined && !isFormData) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body)
    });

    if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as ApiErrorBody | null;

        const message = Array.isArray(errorBody?.message)
            ? errorBody.message.join(" ")
            : (errorBody?.message ?? `Erro ${response.status} ao acessar ${path}`);

        throw new ApiError(response.status, message);
    }

    // 204 No Content: a API não manda corpo (ex.: depois de excluir).
    if (response.status === 204) {
        return undefined as T;
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