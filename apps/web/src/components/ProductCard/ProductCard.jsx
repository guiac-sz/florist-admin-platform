export default function ProductCard({
    product,
    onOpenProduct,
    onAddToCart
}) {
    const formattedPrice = product.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    return (
        <article className="product-card">
            <button
                className="product-image-button"
                onClick={() => onOpenProduct(product)}
            >
                <img
                    src={product.image}
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
                        onClick={() => onOpenProduct(product)}
                    >
                        Ver detalhes
                    </button>

                    <button
                        className="quick-add-button"
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