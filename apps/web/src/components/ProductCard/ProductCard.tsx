import type { Product } from "../../types/catalog";
import { openSoldOutOrder } from "../../utils/whatsapp";

interface ProductCardProps {
    product: Product;
    onOpenProduct: (product: Product) => void;
    onAddToCart: (product: Product, quantity: number) => void;
}

function StarIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );
}

function MessageIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
    );
}

export default function ProductCard({
    product,
    onOpenProduct,
    onAddToCart
}: ProductCardProps) {
    const isSoldOut = !product.isAvailable;

    const formattedPrice = product.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    return (
        <article className={`product-card ${isSoldOut ? "is-sold-out" : ""}`}>
            <div className="product-media">
                <button
                    className="product-image-button"
                    type="button"
                    onClick={() => onOpenProduct(product)}
                >
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                    />
                </button>

                {(product.isFeatured || isSoldOut) && (
                    <div className="product-badges">
                        {product.isFeatured && (
                            <span className="product-badge featured">
                                <StarIcon />
                                Destaque
                            </span>
                        )}

                        {isSoldOut && (
                            <span className="product-badge sold-out">
                                Esgotado
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="product-info">
                <div className="product-name">
                    <strong>{product.name}</strong>
                    <strong>{formattedPrice}</strong>
                </div>

                <p>{product.description}</p>

                {isSoldOut ? (
                    <button
                        className="whatsapp-order-button"
                        type="button"
                        onClick={() => openSoldOutOrder(product.name)}
                    >
                        <MessageIcon />
                        Encomendar pelo WhatsApp
                    </button>
                ) : (
                    <div className="product-buttons">
                        <button
                            className="details-button"
                            type="button"
                            onClick={() => onOpenProduct(product)}
                        >
                            Ver detalhes
                        </button>

                        <button
                            className="quick-add-button"
                            type="button"
                            onClick={() => onAddToCart(product, 1)}
                            title="Adicionar ao carrinho"
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}