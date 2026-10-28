import { useState } from "react";

import Header from "./components/Header/Header";
import ProductModal from "./components/ProductModal/ProductModal";
import Cart from "./components/Cart/Cart";
import Home from "./pages/Home/Home";

import { storeConfig } from "./config/storeConfig";

export default function App() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    function handleWhatsApp() {
        const message = encodeURIComponent(
            "Olá! Vim pelo site da Ateliê Flora."
        );

        window.open(
            `https://wa.me/${storeConfig.whatsapp}?text=${message}`,
            "_blank"
        );
    }

    function handleOpenProduct(product) {
        setSelectedProduct(product);
    }

    function handleCloseProduct() {
        setSelectedProduct(null);
    }

    function handleAddToCart(product, quantity) {
        setCartItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.id === product.id
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              quantity: item.quantity + quantity
                          }
                        : item
                );
            }

            return [
                ...currentItems,
                {
                    ...product,
                    quantity
                }
            ];
        });

        setSelectedProduct(null);
        setIsCartOpen(true);
    }

    function handleIncreaseCartItem(productId) {
        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.id === productId
                    ? {
                          ...item,
                          quantity: item.quantity + 1
                      }
                    : item
            )
        );
    }

    function handleDecreaseCartItem(productId) {
        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.id === productId
                    ? {
                          ...item,
                          quantity: Math.max(
                              1,
                              item.quantity - 1
                          )
                      }
                    : item
            )
        );
    }

    function handleRemoveCartItem(productId) {
        setCartItems((currentItems) =>
            currentItems.filter(
                (item) => item.id !== productId
            )
        );
    }

    function handleCheckout() {
        if (cartItems.length === 0) {
            return;
        }

        const productLines = cartItems
            .map((item) => {
                const subtotal =
                    item.price * item.quantity;

                const formattedSubtotal =
                    subtotal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    });

                return `${item.quantity}x ${item.name} — ${formattedSubtotal}`;
            })
            .join("\n");

        const total = cartItems.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );

        const formattedTotal = total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        const message = encodeURIComponent(
            `Olá! Gostaria de fazer o seguinte pedido:

${productLines}

Total: ${formattedTotal}

Poderia confirmar a disponibilidade?`
        );

        window.open(
            `https://wa.me/${storeConfig.whatsapp}?text=${message}`,
            "_blank"
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
                    onIncrease={handleIncreaseCartItem}
                    onDecrease={handleDecreaseCartItem}
                    onRemove={handleRemoveCartItem}
                    onCheckout={handleCheckout}
                />
            )}
        </>
    );
}