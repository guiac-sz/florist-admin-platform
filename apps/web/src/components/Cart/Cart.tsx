import { useCallback, useEffect, useState } from "react";

import type { CartItem } from "../../types/cart";
import { formatPrice } from "../../utils/format";

import "./Cart.css";

interface CartProps {
    items: CartItem[];
    onClose: () => void;
    onIncrease: (productId: number) => void;
    onDecrease: (productId: number) => void;
    onRemove: (productId: number) => void;
    onCheckout: () => void;
}

export default function Cart({
    items,
    onClose,
    onIncrease,
    onDecrease,
    onRemove,
    onCheckout
}: CartProps) {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = useCallback(() => {
        if (isClosing) {
            return;
        }

        setIsClosing(true);

        setTimeout(() => {
            onClose();
        }, 250);
    }, [isClosing, onClose]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                handleClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [handleClose]);

    const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalPrice = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <div
            className={`cart-overlay ${isClosing ? "closing" : ""}`}
            onClick={handleClose}
        >
            <aside
                className={`cart ${isClosing ? "closing" : ""}`}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="cart-header">
                    <div>
                        <span className="cart-eyebrow">Seu pedido</span>
                        <h2>Carrinho</h2>
                    </div>

                    <button
                        className="cart-close"
                        type="button"
                        onClick={handleClose}
                        aria-label="Fechar carrinho"
                    >
                        ×
                    </button>
                </div>

                <div className="cart-count">
                    {totalItems}{" "}
                    {totalItems === 1 ? "item selecionado" : "itens selecionados"}
                </div>

                {items.length > 0 ? (
                    <>
                        <div className="cart-items">
                            {items.map((item) => (
                                <article className="cart-item" key={item.id}>
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                    />

                                    <div className="cart-item-content">
                                        <div className="cart-item-top">
                                            <div>
                                                <strong>{item.name}</strong>
                                                <span>{formatPrice(item.price)}</span>
                                            </div>

                                            <button
                                                className="cart-remove"
                                                type="button"
                                                onClick={() => onRemove(item.id)}
                                            >
                                                Remover
                                            </button>
                                        </div>

                                        <div className="cart-item-bottom">
                                            <div className="cart-quantity">
                                                <button
                                                    type="button"
                                                    onClick={() => onDecrease(item.id)}
                                                    aria-label={`Diminuir quantidade de ${item.name}`}
                                                >
                                                    −
                                                </button>

                                                <span>{item.quantity}</span>

                                                <button
                                                    type="button"
                                                    onClick={() => onIncrease(item.id)}
                                                    aria-label={`Aumentar quantidade de ${item.name}`}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <strong>
                                                {formatPrice(item.price * item.quantity)}
                                            </strong>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-total">
                                <span>Total do pedido</span>
                                <strong>{formatPrice(totalPrice)}</strong>
                            </div>

                            <p>
                                Você será direcionado ao WhatsApp para
                                confirmar disponibilidade, entrega e
                                pagamento.
                            </p>

                            <button
                                className="cart-checkout"
                                type="button"
                                onClick={onCheckout}
                            >
                                Finalizar pelo WhatsApp
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="cart-empty">
                        <h3>Seu carrinho está vazio</h3>

                        <p>
                            Adicione flores ou presentes para montar
                            seu pedido.
                        </p>
                    </div>
                )}
            </aside>
        </div>
    );
}