import { useEffect, useState } from "react";

import "./ProductModal.css";

export default function ProductModal({
    product,
    onClose,
    onAddToCart
}) {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        function handleKeyDown(event) {
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

    const formattedPrice = product.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const totalPrice = (product.price * quantity).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

    function decreaseQuantity() {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    function increaseQuantity() {
        setQuantity(quantity + 1);
    }

    function handleAddProduct() {
        onAddToCart(product, quantity);
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
                        src={product.image}
                        alt={product.name}
                    />
                </div>

                <div className="product-modal-content">
                    <span className="product-modal-category">
                        {product.categoryLabel}
                    </span>

                    <h2>{product.name}</h2>

                    <strong className="product-modal-price">
                        {formattedPrice}
                    </strong>

                    <p className="product-modal-description">
                        {product.description}
                    </p>

                    <div className="product-modal-divider" />

                    <div className="product-modal-purchase">
                        <div>
                            <span className="quantity-label">
                                Quantidade
                            </span>

                            <div className="quantity-control">
                                <button
                                    type="button"
                                    onClick={decreaseQuantity}
                                >
                                    −
                                </button>

                                <span>{quantity}</span>

                                <button
                                    type="button"
                                    onClick={increaseQuantity}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="product-modal-total">
                            <span>Total</span>
                            <strong>{totalPrice}</strong>
                        </div>
                    </div>

                    <button
                        className="product-modal-add"
                        type="button"
                        onClick={handleAddProduct}
                    >
                        Adicionar ao carrinho
                    </button>
                </div>
            </div>
        </div>
    );
}