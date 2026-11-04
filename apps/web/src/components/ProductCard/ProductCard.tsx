import type { Product } from "../../types/catalog";

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
    const formattedPrice = product.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    return (
        <article className="product-card">
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

            <div className="product-info">
                <div className="product-name">
                    <strong>{product.name}</strong>
                    <strong>{formattedPrice}</strong>
                </div>

                <p>{product.description}</p>

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
            </div>
        </article>
    );
}