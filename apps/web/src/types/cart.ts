import type { Product } from "./catalog";

export interface CartItem extends Product {
    quantity: number;
}