import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router";

import Switch from "../Form/Switch";
import { PencilIcon, StarIcon } from "../Icons/Icons";
import type { AdminProduct } from "../../types/admin";
import type { Product } from "../../types/catalog";
import { formatPrice } from "../../utils/format";

interface AdminProductCardProps {
    product: AdminProduct;
    onOpenProduct: (product: Product) => void;
    onToggle: (product: AdminProduct, field: "isVisible" | "isFeatured") => void;
}

function visibilityLabel(product: AdminProduct) {
    if (!product.isVisible) return "Oculto da vitrine";
    if (!product.isAvailable) return "Na vitrine · esgotado";
    return "Aparece na vitrine";
}

/**
 * O mesmo card da loja, com os controles da administração por cima.
 * O card inteiro pode ser arrastado para mudar a ordem da vitrine.
 */
export default function AdminProductCard({
    product,
    onOpenProduct,
    onToggle
}: AdminProductCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: product.id, attributes: { roleDescription: "card da vitrine" } });

    // O card é ao mesmo tempo o elemento que se move e a "alça" do arraste.
    // Marcar como alça garante que Enter/Espaço nos botões de dentro (estrela,
    // chave) não comecem um arraste pelo teclado.
    function setRefs(element: HTMLElement | null) {
        setNodeRef(element);
        setActivatorNodeRef(element);
    }

    const classes = [
        "product-card",
        "admin-product-card",
        product.isAvailable ? "" : "is-sold-out",
        product.isVisible ? "" : "is-hidden",
        isDragging ? "is-dragging" : ""
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <article
            ref={setRefs}
            className={classes}
            style={{ transform: CSS.Translate.toString(transform), transition }}
            aria-label={`${product.name}. Arraste para mudar a posição na vitrine.`}
            {...attributes}
            {...listeners}
        >
            <div className="product-media">
                <button
                    className="product-image-button"
                    type="button"
                    onClick={() => onOpenProduct(product)}
                >
                    <img src={product.imageUrl} alt={product.name} draggable={false} />
                </button>

                {(product.isFeatured || !product.isAvailable) && (
                    <div className="product-badges">
                        {product.isFeatured && (
                            <span className="product-badge featured">
                                <StarIcon size={12} />
                                Destaque
                            </span>
                        )}

                        {!product.isAvailable && (
                            <span className="product-badge sold-out">Esgotado</span>
                        )}
                    </div>
                )}

                <div className="admin-card-actions">
                    <Link
                        to={`/admin/produtos/${product.id}`}
                        className="admin-card-action"
                        aria-label={`Editar ${product.name}`}
                        title="Editar"
                    >
                        <PencilIcon size={16} />
                    </Link>

                    <button
                        type="button"
                        className={`admin-card-action ${product.isFeatured ? "is-on" : ""}`}
                        onClick={() => onToggle(product, "isFeatured")}
                        aria-pressed={product.isFeatured}
                        aria-label={`Destacar ${product.name}`}
                        title={product.isFeatured ? "Tirar do destaque" : "Destacar"}
                    >
                        <StarIcon size={16} />
                    </button>
                </div>
            </div>

            <div className="product-info">
                <div className="product-name">
                    <strong>{product.name}</strong>
                    <strong>{formatPrice(product.price)}</strong>
                </div>

                <p>{product.description}</p>

                <div className="admin-card-visibility">
                    <span>{visibilityLabel(product)}</span>

                    <Switch
                        checked={product.isVisible}
                        onChange={() => onToggle(product, "isVisible")}
                        label={`Mostrar ${product.name} na loja`}
                    />
                </div>
            </div>
        </article>
    );
}
