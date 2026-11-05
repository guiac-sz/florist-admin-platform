import { useEffect, useState } from "react";

import type { Product } from "../../types/catalog";
import { formatPrice } from "../../utils/format";
import { openSoldOutOrder } from "../../utils/whatsapp";

import "./ProductModal.css";

interface ProductModalProps {
    product: Product;
    onClose: () => void;
    onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductModal({
    product,
    onClose,
    onAddToCart
}: ProductModalProps) {
    const [quantity, setQuantity] = useState(1);
    const isSoldOut = !product.isAvailable;

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    function decreaseQuantity() {
        setQuantity((current) => Math.max(1, current - 1));
    }

    function increaseQuantity() {
        setQuantity((current) => current + 1);
    }

    return (
        <div
            className="product-modal-overlay"
            onClick={onClose}
        >
            <div
                className="product-modal"
                role="dialog"
                aria-modal="true"
                aria-label={`Detalhes de ${product.name}`}
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    className="product-modal-close"
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar detalhes do produto"
                >
                    ×
                </button>

                <div className="product-modal-image">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                    />
                </div>

                <div className="product-modal-content">
                    <span className="product-modal-category">
                        {product.category.name}
                    </span>

                    {isSoldOut && (
                        <span className="product-badge sold-out">
                            Esgotado
                        </span>
                    )}

                    <h2>{product.name}</h2>

                    <strong className="product-modal-price">
                        {formatPrice(product.price)}
                    </strong>

                    <p className="product-modal-description">
                        {product.description}
                    </p>

                    <div className="product-modal-divider" />

                    {isSoldOut ? (
                        <button
                            className="product-modal-add"
                            type="button"
                            onClick={() => openSoldOutOrder(product.name)}
                        >
                            Encomendar pelo WhatsApp
                        </button>
                    ) : (
                        <>
                            <div className="product-modal-purchase">
                                <div>
                                    <span className="quantity-label">
                                        Quantidade
                                    </span>

                                    <div className="quantity-control">
                                        <button
                                            type="button"
                                            onClick={decreaseQuantity}
                                            aria-label="Diminuir quantidade"
                                        >
                                            −
                                        </button>

                                        <span>{quantity}</span>

                                        <button
                                            type="button"
                                            onClick={increaseQuantity}
                                            aria-label="Aumentar quantidade"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="product-modal-total">
                                    <span>Total</span>
                                    <strong>{formatPrice(product.price * quantity)}</strong>
                                </div>
                            </div>

                            <button
                                className="product-modal-add"
                                type="button"
                                onClick={() => onAddToCart(product, quantity)}
                            >
                                Adicionar ao carrinho
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}