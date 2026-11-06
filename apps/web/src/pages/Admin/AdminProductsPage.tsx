import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

import DeleteProductDialog from "../../components/DeleteProductDialog/DeleteProductDialog";
import FormAlert from "../../components/Form/FormAlert";
import Switch from "../../components/Form/Switch";
import {
    CheckIcon,
    PencilIcon,
    PlusIcon,
    SearchIcon,
    StarIcon,
    TrashIcon
} from "../../components/Icons/Icons";
import { useAuth } from "../../hooks/useAuth";
import {
    deleteAdminProduct,
    getAdminProducts,
    updateAdminProduct
} from "../../services/admin";
import type { AdminProduct } from "../../types/admin";
import { formatPrice, formatRelativeDate } from "../../utils/format";

import "./AdminProductsPage.css";

type Filter = "all" | "visible" | "hidden" | "sold-out";
type ToggleField = "isVisible" | "isFeatured";

const FILTERS: { value: Filter; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "visible", label: "Na vitrine" },
    { value: "hidden", label: "Ocultos" },
    { value: "sold-out", label: "Esgotados" }
];

function normalize(text: string) {
    return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function matchesFilter(product: AdminProduct, filter: Filter) {
    if (filter === "visible") return product.isVisible;
    if (filter === "hidden") return !product.isVisible;
    if (filter === "sold-out") return !product.isAvailable;
    return true;
}

export default function AdminProductsPage() {
    const { token } = useAuth();
    const location = useLocation();
    const notice = (location.state as { notice?: string } | null)?.notice;

    const [products, setProducts] = useState<AdminProduct[] | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<Filter>("all");
    const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

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
                if (!ignore) {
                    setLoadError("Não foi possível carregar os produtos. Tente novamente.");
                }
            });

        return () => {
            ignore = true;
        };
    }, [token]);

    function replaceProduct(updated: AdminProduct) {
        setProducts((current) =>
            current?.map((item) => (item.id === updated.id ? updated : item)) ?? null
        );
    }

    async function handleToggle(product: AdminProduct, field: ToggleField) {
        if (!token) {
            return;
        }

        setActionError(null);

        // Atualização otimista: muda na tela na hora e confirma com a API.
        replaceProduct({ ...product, [field]: !product[field] });

        try {
            const updated = await updateAdminProduct(token, product.id, {
                [field]: !product[field]
            });

            replaceProduct(updated);
        } catch {
            replaceProduct(product);
            setActionError(`Não foi possível salvar a alteração em "${product.name}". Tente de novo.`);
        }
    }

    async function handleDelete() {
        if (!token || !productToDelete) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await deleteAdminProduct(token, productToDelete.id);
            setProducts((current) =>
                current?.filter((item) => item.id !== productToDelete.id) ?? null
            );
            setProductToDelete(null);
        } catch {
            setDeleteError("Não foi possível excluir. Tente novamente.");
        } finally {
            setIsDeleting(false);
        }
    }

    function closeDeleteDialog() {
        setProductToDelete(null);
        setDeleteError(null);
    }

    const allProducts = products ?? [];
    const searchTerm = normalize(search.trim());

    const visibleProducts = allProducts.filter(
        (product) =>
            matchesFilter(product, filter) &&
            normalize(`${product.name} ${product.category.name}`).includes(searchTerm)
    );

    const soldOutCount = allProducts.filter((p) => !p.isAvailable).length;

    const stats = [
        {
            label: allProducts.length === 1 ? "produto cadastrado" : "produtos cadastrados",
            value: allProducts.length,
            tone: ""
        },
        { label: "na vitrine", value: allProducts.filter((p) => p.isVisible).length, tone: "" },
        { label: "em destaque", value: allProducts.filter((p) => p.isFeatured).length, tone: "rose" },
        { label: soldOutCount === 1 ? "esgotado" : "esgotados", value: soldOutCount, tone: "warning" }
    ];

    function renderTable() {
        if (loadError) {
            return <FormAlert>{loadError}</FormAlert>;
        }

        if (!products) {
            return <p className="admin-empty">Carregando produtos...</p>;
        }

        if (visibleProducts.length === 0) {
            return <p className="admin-empty">Nenhum produto encontrado.</p>;
        }

        return (
            <div className="admin-table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Categoria</th>
                            <th>Preço</th>
                            <th>Disponibilidade</th>
                            <th>Destaque</th>
                            <th>Na vitrine</th>
                            <th>
                                <span className="visually-hidden">Ações</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {visibleProducts.map((product) => (
                            <tr
                                key={product.id}
                                className={product.isVisible ? "" : "is-hidden"}
                            >
                                <td>
                                    <div className="admin-product">
                                        <img src={product.imageUrl} alt="" />

                                        <div>
                                            <strong>{product.name}</strong>
                                            <small>
                                                Atualizado {formatRelativeDate(product.updatedAt)}
                                            </small>
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
                                        onClick={() => handleToggle(product, "isFeatured")}
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
                                        onChange={() => handleToggle(product, "isVisible")}
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
                                            onClick={() => setProductToDelete(product)}
                                            aria-label={`Excluir ${product.name}`}
                                            title="Excluir"
                                        >
                                            <TrashIcon size={17} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <p className="admin-table-footer">
                    Mostrando {visibleProducts.length} de {allProducts.length} produtos
                </p>
            </div>
        );
    }

    return (
        <section>
            <header className="admin-page-header">
                <div>
                    <h1>Produtos e vitrine</h1>
                    <p>
                        Escolha o que aparece na loja e o que fica em destaque.
                        Mudanças entram no ar na hora.
                    </p>
                </div>

                <Link to="/admin/produtos/novo" className="admin-button primary">
                    <PlusIcon size={18} />
                    Novo produto
                </Link>
            </header>

            {notice && (
                <p className="form-notice admin-notice" role="status">
                    <CheckIcon size={16} />
                    {notice}
                </p>
            )}

            <div className="admin-stats">
                {stats.map((stat) => (
                    <div key={stat.label} className="admin-stat">
                        <strong className={stat.tone}>{stat.value}</strong>
                        <span>{stat.label}</span>
                    </div>
                ))}
            </div>

            <div className="admin-toolbar">
                <label className="admin-search">
                    <SearchIcon size={18} />
                    <input
                        type="search"
                        placeholder="Buscar produto..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        aria-label="Buscar produto"
                    />
                </label>

                <div className="admin-chips">
                    {FILTERS.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            className={`admin-chip ${filter === item.value ? "active" : ""}`}
                            onClick={() => setFilter(item.value)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {actionError && <FormAlert>{actionError}</FormAlert>}

            {renderTable()}

            {productToDelete && (
                <DeleteProductDialog
                    productName={productToDelete.name}
                    isDeleting={isDeleting}
                    error={deleteError}
                    onCancel={closeDeleteDialog}
                    onConfirm={handleDelete}
                />
            )}
        </section>
    );
}
