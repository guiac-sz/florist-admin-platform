import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates
} from "@dnd-kit/sortable";

import AdminProductCard from "./AdminProductCard";
import { GripIcon, PlusIcon } from "../Icons/Icons";
import { useAuth } from "../../hooks/useAuth";
import { getAdminProducts, reorderAdminProducts, updateAdminProduct } from "../../services/admin";
import type { AdminProduct } from "../../types/admin";
import type { Product } from "../../types/catalog";

import "../Catalog/Catalog.css";
import "./AdminCatalog.css";

interface AdminCatalogProps {
    onOpenProduct: (product: Product) => void;
}

const screenReaderInstructions = {
    draggable:
        "Para mover um produto, pressione espaço ou enter. Use as setas para escolher a nova " +
        "posição e pressione espaço ou enter de novo para soltar. Esc cancela."
};

function plural(count: number, singular: string, pluralWord: string) {
    return `${count} ${count === 1 ? singular : pluralWord}`;
}

/**
 * Catálogo da página inicial no modo administrador: mostra todos os produtos
 * (inclusive os ocultos) e deixa editar a vitrine sem sair da loja.
 */
export default function AdminCatalog({ onOpenProduct }: AdminCatalogProps) {
    const { token } = useAuth();

    const [products, setProducts] = useState<AdminProduct[] | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    // Distância maior que no painel: aqui o card inteiro é arrastável, e um
    // clique na estrela ou na chave não pode virar arraste por acidente.
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        if (!token) {
            return;
        }

        let ignore = false;

        getAdminProducts(token)
            .then((data) => {
                if (!ignore) setProducts(data);
            })
            .catch(() => {
                if (!ignore) setLoadError("Não foi possível carregar os produtos.");
            });

        return () => {
            ignore = true;
        };
    }, [token]);

    function replaceProduct(updated: AdminProduct) {
        setProducts(
            (current) => current?.map((item) => (item.id === updated.id ? updated : item)) ?? null
        );
    }

    async function handleToggle(product: AdminProduct, field: "isVisible" | "isFeatured") {
        if (!token) {
            return;
        }

        setActionError(null);
        replaceProduct({ ...product, [field]: !product[field] });

        try {
            replaceProduct(await updateAdminProduct(token, product.id, { [field]: !product[field] }));
        } catch {
            replaceProduct(product);
            setActionError(`Não foi possível salvar a alteração em "${product.name}".`);
        }
    }

    async function handleDragEnd({ active, over }: DragEndEvent) {
        if (!token || !products || !over || active.id === over.id) {
            return;
        }

        const oldIndex = products.findIndex((item) => item.id === active.id);
        const newIndex = products.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(products, oldIndex, newIndex);

        setActionError(null);
        setProducts(reordered);

        try {
            await reorderAdminProducts(token, reordered.map((item) => item.id));
        } catch {
            setProducts(products);
            setActionError("Não foi possível salvar a nova ordem da vitrine.");
        }
    }

    function renderSummary() {
        if (!products) {
            return null;
        }

        const visible = products.filter((p) => p.isVisible).length;
        const hidden = products.length - visible;
        const soldOut = products.filter((p) => !p.isAvailable).length;

        return (
            <p className="admin-catalog-summary">
                {visible} na vitrine · {plural(hidden, "oculto", "ocultos")} ·{" "}
                {plural(soldOut, "esgotado", "esgotados")}
            </p>
        );
    }

    function renderContent() {
        if (loadError) {
            return <div className="no-products">{loadError}</div>;
        }

        if (!products) {
            return <div className="no-products">Carregando produtos...</div>;
        }

        if (products.length === 0) {
            return <div className="no-products">Nenhum produto cadastrado ainda.</div>;
        }

        return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                accessibility={{ screenReaderInstructions }}
                onDragEnd={handleDragEnd}
            >
                {/* rectSortingStrategy: para grades (no painel, a lista era vertical). */}
                <SortableContext
                    items={products.map((product) => product.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="product-grid">
                        {products.map((product) => (
                            <AdminProductCard
                                key={product.id}
                                product={product}
                                onOpenProduct={onOpenProduct}
                                onToggle={handleToggle}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        );
    }

    return (
        <section className="catalog-section" id="catalogo">
            <div className="admin-catalog-banner">
                <GripIcon size={20} />

                <div>
                    <strong>Você está editando a vitrine</strong>
                    <p>
                        Arraste os cards para mudar a ordem. Use o lápis para editar, a estrela
                        para destacar e a chave para esconder um produto. Clientes não veem estes
                        controles.
                    </p>
                </div>

                <Link to="/admin/produtos/novo" className="admin-catalog-new">
                    <PlusIcon size={16} />
                    Novo produto
                </Link>
            </div>

            <div className="catalog-header">
                <div>
                    <span className="section-eyebrow">Catálogo completo</span>
                    <h2>Encontre o presente ideal</h2>
                </div>

                {renderSummary()}
            </div>

            {actionError && (
                <p className="admin-catalog-error" role="alert">
                    {actionError} Tente de novo.
                </p>
            )}

            {renderContent()}
        </section>
    );
}
