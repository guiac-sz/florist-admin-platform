import type { Product } from "../../types/catalog";
import { openSoldOutOrder } from "../../utils/whatsapp";
import { formatPrice } from "../../utils/format";
import { MessageIcon, StarIcon } from "../Icons/Icons";

interface ProductCardProps {
    product: Product;
    onOpenProduct: (product: Product) => void;
    onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductCard({
    product,
    onOpenProduct,
    onAddToCart
}: ProductCardProps) {
    const isSoldOut = !product.isAvailable;

    const formattedPrice = formatPrice(product.price);

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
                                <StarIcon size={12} />
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