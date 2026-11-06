import { request } from "./api";
import type { AdminProduct, AdminProductUpdate } from "../types/admin";

type ApiAdminProduct = Omit<AdminProduct, "price"> & { price: string };

function toAdminProduct(product: ApiAdminProduct): AdminProduct {
    return { ...product, price: Number(product.price) };
}

export async function getAdminProducts(token: string) {
    const products = await request<ApiAdminProduct[]>("/admin/products", { token });
    return products.map(toAdminProduct);
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
