import { useState } from "react";
import { Outlet } from "react-router";

import AdminBar from "../components/AdminBar/AdminBar";
import Header from "../components/Header/Header";
import ProductModal from "../components/ProductModal/ProductModal";
import Cart from "../components/Cart/Cart";
import WhatsAppFloat from "../components/WhatsAppFloat/WhatsAppFloat";

import { useAuth } from "../hooks/useAuth";
import type { Product } from "../types/catalog";
import type { CartItem } from "../types/cart";
import { formatPrice } from "../utils/format";
import { openWhatsApp } from "../utils/whatsapp";

export interface StoreOutletContext {
    onWhatsApp: () => void;
    onOpenProduct: (product: Product) => void;
    onAddToCart: (product: Product, quantity: number) => void;
    isAdminEditing: boolean;
}

// Guarda só nesta aba se a administração escolheu "Ver como cliente".
const CUSTOMER_VIEW_KEY = "florist.customerView";

function readCustomerView() {
    try {
        return sessionStorage.getItem(CUSTOMER_VIEW_KEY) === "true";
    } catch {
        return false;
    }
}

export default function StoreLayout() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCustomerView, setIsCustomerView] = useState(readCustomerView);

    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";
    const isAdminEditing = isAdmin && !isCustomerView;

    function toggleCustomerView() {
        const next = !isCustomerView;
        setIsCustomerView(next);

        try {
            sessionStorage.setItem(CUSTOMER_VIEW_KEY, String(next));
        } catch {
            // Sem acesso ao armazenamento: a escolha vale só até recarregar.
        }
    }

    const cartItemCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    function handleWhatsApp() {
        openWhatsApp("Olá! Vim pelo site da Ateliê Flora.");
    }

    function handleOpenProduct(product: Product) {
        setSelectedProduct(product);
    }

    function handleCloseProduct() {
        setSelectedProduct(null);
    }

    function handleAddToCart(product: Product, quantity: number) {
        if (!product.isAvailable) {
            return;
        }

        setCartItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.id === product.id
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...currentItems, { ...product, quantity }];
        });

        setSelectedProduct(null);
        setIsCartOpen(true);
    }

    function changeCartItemQuantity(productId: number, change: number) {
        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.id === productId
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    }

    function handleRemoveCartItem(productId: number) {
        setCartItems((currentItems) =>
            currentItems.filter((item) => item.id !== productId)
        );
    }

    function handleCheckout() {
        if (cartItems.length === 0) {
            return;
        }

        const productLines = cartItems
            .map(
                (item) =>
                    `${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)}`
            )
            .join("\n");

        const total = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        openWhatsApp(
            `Olá! Gostaria de fazer o seguinte pedido:

${productLines}

Total: ${formatPrice(total)}

Poderia confirmar a disponibilidade?`
        );
    }

    return (
        <>
            {isAdmin && (
                <AdminBar isEditing={isAdminEditing} onToggleEditing={toggleCustomerView} />
            )}

            <Header
                cartItemCount={cartItemCount}
                onOpenCart={() => setIsCartOpen(true)}
            />

            <Outlet
                context={{
                    onWhatsApp: handleWhatsApp,
                    onOpenProduct: handleOpenProduct,
                    onAddToCart: handleAddToCart,
                    isAdminEditing
                } satisfies StoreOutletContext}
            />

            <WhatsAppFloat onClick={handleWhatsApp} />

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={handleCloseProduct}
                    onAddToCart={handleAddToCart}
                />
            )}

            {isCartOpen && (
                <Cart
                    items={cartItems}
                    onClose={() => setIsCartOpen(false)}
                    onIncrease={(productId) => changeCartItemQuantity(productId, 1)}
                    onDecrease={(productId) => changeCartItemQuantity(productId, -1)}
                    onRemove={handleRemoveCartItem}
                    onCheckout={handleCheckout}
                />
            )}
        </>
    );
}