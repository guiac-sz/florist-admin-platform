import { useState } from "react";

import Header from "./components/Header/Header";
import ProductModal from "./components/ProductModal/ProductModal";
import Cart from "./components/Cart/Cart";
import Home from "./pages/Home/Home";

import type { Product } from "./types/catalog";
import type { CartItem } from "./types/cart";
import { formatPrice } from "./utils/format";
import { openWhatsApp } from "./utils/whatsapp";

export default function App() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

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
            <Header
                cartItemCount={cartItemCount}
                onOpenCart={() => setIsCartOpen(true)}
            />

            <Home
                onWhatsApp={handleWhatsApp}
                onOpenProduct={handleOpenProduct}
                onAddToCart={handleAddToCart}
            />

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