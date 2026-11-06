import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router";

import Switch from "../../components/Form/Switch";
import { GripIcon, PencilIcon, StarIcon, TrashIcon } from "../../components/Icons/Icons";
import type { AdminProduct } from "../../types/admin";
import { formatPrice, formatRelativeDate } from "../../utils/format";

type AdminProductRowProps = {
    product: AdminProduct;
    canReorder: boolean;
    onToggle: (product: AdminProduct, field: "isVisible" | "isFeatured") => void;
    onDelete: (product: AdminProduct) => void;
};

export default function AdminProductRow({
    product,
    canReorder,
    onToggle,
    onDelete
}: AdminProductRowProps) {
    // useSortable liga esta linha ao DndContext da página: devolve a ref da
    // linha, os eventos da alça e o deslocamento atual enquanto ela é arrastada.
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: product.id, disabled: !canReorder });

    const classes = [
        product.isVisible ? "" : "is-hidden",
        isDragging ? "is-dragging" : ""
    ].join(" ").trim();

    return (
        <tr
            ref={setNodeRef}
            className={classes || undefined}
            style={{ transform: CSS.Translate.toString(transform), transition }}
        >
            <td className="admin-drag-cell">
                <button
                    type="button"
                    ref={setActivatorNodeRef}
                    className="admin-drag-handle"
                    disabled={!canReorder}
                    aria-label={`Mover ${product.name}`}
                    title={canReorder ? "Arraste para reordenar" : undefined}
                    {...attributes}
                    {...listeners}
                >
                    <GripIcon size={18} />
                </button>
            </td>

            <td>
                <div className="admin-product">
                    <img src={product.imageUrl} alt="" />

                    <div>
                        <strong>{product.name}</strong>
                        <small>Atualizado {formatRelativeDate(product.updatedAt)}</small>
                    </div>
                </div>
            </td>

            <td>{product.category.name}</td>

            <td className="admin-price">{formatPrice(product.price)}</td>

            <td>
                {product.isAvailable ? (
                    <span className="admin-badge available">Disponível</span>
                ) : (
                    <span className="admin-badge sold-out">Esgotado</span>
                )}
            </td>

            <td>
                <button
                    type="button"
                    className={`admin-star ${product.isFeatured ? "on" : ""}`}
                    onClick={() => onToggle(product, "isFeatured")}
                    aria-pressed={product.isFeatured}
                    aria-label={`Destacar ${product.name}`}
                    title={product.isFeatured ? "Tirar do destaque" : "Destacar"}
                >
                    <StarIcon size={16} />
                </button>
            </td>

            <td>
                <Switch
                    checked={product.isVisible}
                    onChange={() => onToggle(product, "isVisible")}
                    label={`Mostrar ${product.name} na loja`}
                />
            </td>

            <td>
                <div className="admin-row-actions">
                    <Link
                        to={`/admin/produtos/${product.id}`}
                        className="admin-icon-button"
                        aria-label={`Editar ${product.name}`}
                        title="Editar"
                    >
                        <PencilIcon size={17} />
                    </Link>

                    <button
                        type="button"
                        className="admin-icon-button danger"
                        onClick={() => onDelete(product)}
                        aria-label={`Excluir ${product.name}`}
                        title="Excluir"
                    >
                        <TrashIcon size={17} />
                    </button>
                </div>
            </td>
        </tr>
    );
}
