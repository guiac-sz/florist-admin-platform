import { request } from "./api";
import type {
    AdminCategory,
    AdminProduct,
    AdminProductInput,
    AdminProductUpdate
} from "../types/admin";

type ApiAdminProduct = Omit<AdminProduct, "price"> & { price: string };

function toAdminProduct(product: ApiAdminProduct): AdminProduct {
    return { ...product, price: Number(product.price) };
}

export async function getAdminProducts(token: string) {
    const products = await request<ApiAdminProduct[]>("/admin/products", { token });
    return products.map(toAdminProduct);
}

export async function getAdminProduct(token: string, id: number) {
    const product = await request<ApiAdminProduct>(`/admin/products/${id}`, { token });
    return toAdminProduct(product);
}

export async function createAdminProduct(token: string, data: AdminProductInput) {
    const product = await request<ApiAdminProduct>("/admin/products", {
        method: "POST",
        body: data,
        token
    });

    return toAdminProduct(product);
}

export async function updateAdminProduct(
    token: string,
    id: number,
    data: AdminProductUpdate
) {
    const product = await request<ApiAdminProduct>(`/admin/products/${id}`, {
        method: "PATCH",
        body: data,
        token
    });

    return toAdminProduct(product);
}

export function deleteAdminProduct(token: string, id: number) {
    return request<void>(`/admin/products/${id}`, { method: "DELETE", token });
}

export function reorderAdminProducts(token: string, ids: number[]) {
    return request<void>("/admin/products/order", {
        method: "PUT",
        body: { ids },
        token
    });
}

export async function uploadProductImage(token: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const { url } = await request<{ url: string }>("/admin/uploads", {
        method: "POST",
        body: formData,
        token
    });

    return url;
}

export function getAdminCategories(token: string) {
    return request<AdminCategory[]>("/admin/categories", { token });
}

export function createAdminCategory(token: string, name: string) {
    return request<AdminCategory>("/admin/categories", {
        method: "POST",
        body: { name },
        token
    });
}

export function renameAdminCategory(token: string, id: number, name: string) {
    return request<AdminCategory>(`/admin/categories/${id}`, {
        method: "PATCH",
        body: { name },
        token
    });
}

export function deleteAdminCategory(token: string, id: number) {
    return request<void>(`/admin/categories/${id}`, { method: "DELETE", token });
}

export function reorderAdminCategories(token: string, ids: number[]) {
    return request<void>("/admin/categories/order", {
        method: "PUT",
        body: { ids },
        token
    });
}
