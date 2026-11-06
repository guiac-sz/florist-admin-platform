import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";

import ProductCard from "../../components/ProductCard/ProductCard";
import DeleteProductDialog from "../../components/DeleteProductDialog/DeleteProductDialog";
import TextField from "../../components/Form/TextField";
import SelectField from "../../components/Form/SelectField";
import TextAreaField from "../../components/Form/TextAreaField";
import FormAlert from "../../components/Form/FormAlert";
import Switch from "../../components/Form/Switch";
import { ArrowLeftIcon, FlowerIcon, TrashIcon } from "../../components/Icons/Icons";
import { useAuth } from "../../hooks/useAuth";
import { ApiError, getCategories } from "../../services/api";
import {
    createAdminProduct,
    deleteAdminProduct,
    getAdminProduct,
    updateAdminProduct
} from "../../services/admin";
import type { AdminProductInput } from "../../types/admin";
import type { Category, Product } from "../../types/catalog";
import { formatPrice, parsePriceInput } from "../../utils/format";

import "../../components/Catalog/Catalog.css";
import "./AdminProductFormPage.css";

interface ProductForm {
    name: string;
    description: string;
    priceCents: number;
    imageUrl: string;
    categoryId: string;
    isAvailable: boolean;
    isVisible: boolean;
    isFeatured: boolean;
}

type FormErrors = Partial<Record<"name" | "description" | "price" | "imageUrl" | "categoryId", string>>;

const emptyForm: ProductForm = {
    name: "",
    description: "",
    priceCents: 0,
    imageUrl: "",
    categoryId: "",
    isAvailable: true,
    isVisible: true,
    isFeatured: false
};

function isValidUrl(value: string) {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function validate(form: ProductForm): FormErrors {
    const errors: FormErrors = {};

    if (!form.name.trim()) errors.name = "Informe o nome do produto.";
    if (!form.categoryId) errors.categoryId = "Escolha uma categoria.";
    if (form.priceCents <= 0) errors.price = "Informe o preço.";
    if (!form.description.trim()) errors.description = "Escreva uma descrição.";
    if (!isValidUrl(form.imageUrl.trim())) {
        errors.imageUrl = "Cole um endereço de imagem que comece com https://";
    }

    return errors;
}

export default function AdminProductFormPage() {
    const { id } = useParams();
    const productId = id ? Number(id) : null;
    const isEditing = productId !== null;

    const navigate = useNavigate();
    const { token } = useAuth();

    const [form, setForm] = useState<ProductForm>(emptyForm);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoaded, setIsLoaded] = useState(!isEditing);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => setLoadError("Não foi possível carregar as categorias."));
    }, []);

    useEffect(() => {
        if (!token || productId === null) {
            return;
        }

        let ignore = false;

        getAdminProduct(token, productId)
            .then((product) => {
                if (ignore) return;

                setForm({
                    name: product.name,
                    description: product.description,
                    priceCents: Math.round(product.price * 100),
                    imageUrl: product.imageUrl,
                    categoryId: String(product.categoryId),
                    isAvailable: product.isAvailable,
                    isVisible: product.isVisible,
                    isFeatured: product.isFeatured
                });
                setIsLoaded(true);
            })
            .catch((error) => {
                if (ignore) return;

                setLoadError(
                    error instanceof ApiError && error.status === 404
                        ? "Produto não encontrado. Ele pode ter sido excluído."
                        : "Não foi possível carregar o produto."
                );
            });

        return () => {
            ignore = true;
        };
    }, [token, productId]);

    function updateField<K extends keyof ProductForm>(field: K, value: ProductForm[K]) {
        setForm((current) => ({ ...current, [field]: value }));

        const errorKey = field === "priceCents" ? "price" : field;
        setErrors((current) => ({ ...current, [errorKey]: undefined }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationErrors = validate(form);
        setErrors(validationErrors);
        setFormError(null);

        if (Object.keys(validationErrors).length > 0 || !token) {
            return;
        }

        const data: AdminProductInput = {
            name: form.name.trim(),
            description: form.description.trim(),
            price: form.priceCents / 100,
            imageUrl: form.imageUrl.trim(),
            categoryId: Number(form.categoryId),
            isAvailable: form.isAvailable,
            isVisible: form.isVisible,
            isFeatured: form.isFeatured
        };

        setIsSaving(true);

        try {
            if (productId === null) {
                await createAdminProduct(token, data);
            } else {
                await updateAdminProduct(token, productId, data);
            }

            navigate("/admin/produtos", {
                state: {
                    notice: isEditing
                        ? `"${data.name}" foi atualizado.`
                        : `"${data.name}" foi cadastrado.`
                }
            });
        } catch (error) {
            setFormError(
                error instanceof ApiError && error.status === 400
                    ? error.message
                    : "Não foi possível salvar. Tente novamente em instantes."
            );
            setIsSaving(false);
        }
    }

    async function handleDelete() {
        if (!token || productId === null) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await deleteAdminProduct(token, productId);
            navigate("/admin/produtos", {
                state: { notice: `"${form.name}" foi excluído.` }
            });
        } catch {
            setDeleteError("Não foi possível excluir. Tente novamente.");
            setIsDeleting(false);
        }
    }

    const selectedCategory = categories.find((c) => String(c.id) === form.categoryId);

    const preview: Product = {
        id: productId ?? 0,
        name: form.name || "Nome do produto",
        description: form.description || "A descrição aparece aqui.",
        price: form.priceCents / 100,
        imageUrl: form.imageUrl,
        isAvailable: form.isAvailable,
        isFeatured: form.isFeatured,
        category: selectedCategory ?? { id: 0, name: "", slug: "" }
    };

    if (loadError) {
        return (
            <section>
                <Link to="/admin/produtos" className="admin-back-link">
                    <ArrowLeftIcon size={14} />
                    Produtos e vitrine
                </Link>

                <FormAlert>{loadError}</FormAlert>
            </section>
        );
    }

    if (!isLoaded) {
        return <p className="admin-empty">Carregando produto...</p>;
    }

    return (
        <section>
            <Link to="/admin/produtos" className="admin-back-link">
                <ArrowLeftIcon size={14} />
                Produtos e vitrine
            </Link>

            <header className="admin-page-header">
                <h1>{isEditing ? "Editar produto" : "Novo produto"}</h1>

                <div className="admin-header-actions">
                    <Link to="/admin/produtos" className="admin-button outline">
                        Cancelar
                    </Link>

                    <button
                        type="submit"
                        form="product-form"
                        className="admin-button primary"
                        disabled={isSaving}
                    >
                        {isSaving
                            ? "Salvando..."
                            : isEditing
                              ? "Salvar alterações"
                              : "Cadastrar produto"}
                    </button>
                </div>
            </header>

            <div className="product-form-layout">
                <form id="product-form" className="product-form-main" noValidate onSubmit={handleSubmit}>
                    {formError && <FormAlert>{formError}</FormAlert>}

                    <div className="admin-card">
                        <h2>Informações</h2>

                        <div className="product-photo">
                            <div className="product-photo-preview">
                                {isValidUrl(form.imageUrl) ? (
                                    <img src={form.imageUrl} alt="" />
                                ) : (
                                    <FlowerIcon size={36} />
                                )}
                            </div>

                            <div className="product-photo-field">
                                <TextField
                                    label="Endereço da foto"
                                    name="imageUrl"
                                    type="url"
                                    placeholder="https://..."
                                    value={form.imageUrl}
                                    error={errors.imageUrl}
                                    onChange={(event) => updateField("imageUrl", event.target.value)}
                                />

                                <p className="field-hint">
                                    Formato vertical (4:5) fica melhor. O envio de arquivos do
                                    computador chega numa próxima etapa.
                                </p>
                            </div>
                        </div>

                        <TextField
                            label="Nome do produto"
                            name="name"
                            value={form.name}
                            error={errors.name}
                            onChange={(event) => updateField("name", event.target.value)}
                        />

                        <div className="field-row">
                            <SelectField
                                label="Categoria"
                                name="categoryId"
                                value={form.categoryId}
                                error={errors.categoryId}
                                onChange={(event) => updateField("categoryId", event.target.value)}
                            >
                                <option value="" disabled>
                                    Escolha...
                                </option>

                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </SelectField>

                            <TextField
                                label="Preço"
                                name="price"
                                inputMode="numeric"
                                placeholder="R$ 0,00"
                                value={form.priceCents ? formatPrice(form.priceCents / 100) : ""}
                                error={errors.price}
                                onChange={(event) =>
                                    updateField("priceCents", parsePriceInput(event.target.value))
                                }
                            />
                        </div>

                        <TextAreaField
                            label="Descrição"
                            name="description"
                            rows={4}
                            maxLength={600}
                            value={form.description}
                            error={errors.description}
                            onChange={(event) => updateField("description", event.target.value)}
                        />
                    </div>

                    <div className="admin-card">
                        <h2>Disponibilidade</h2>

                        <label className="radio-option">
                            <input
                                type="radio"
                                name="availability"
                                checked={form.isAvailable}
                                onChange={() => updateField("isAvailable", true)}
                            />
                            <span className="radio-dot" />
                            <span>
                                <strong>Disponível</strong>
                                <small>Clientes podem comprar normalmente.</small>
                            </span>
                        </label>

                        <label className="radio-option">
                            <input
                                type="radio"
                                name="availability"
                                checked={!form.isAvailable}
                                onChange={() => updateField("isAvailable", false)}
                            />
                            <span className="radio-dot" />
                            <span>
                                <strong>Esgotado</strong>
                                <small>
                                    Continua visível, mas o botão de compra vira “Encomendar
                                    pelo WhatsApp”.
                                </small>
                            </span>
                        </label>
                    </div>
                </form>

                <aside className="product-form-side">
                    <div className="admin-card">
                        <h2>Vitrine</h2>

                        <div className="setting-row">
                            <div>
                                <strong>Mostrar na loja</strong>
                                <small>Quando desligado, o produto fica salvo mas escondido.</small>
                            </div>

                            <Switch
                                checked={form.isVisible}
                                onChange={(checked) => updateField("isVisible", checked)}
                                label="Mostrar na loja"
                            />
                        </div>

                        <div className="setting-row">
                            <div>
                                <strong>Destacar</strong>
                                <small>Ganha a etiqueta “Destaque” na loja.</small>
                            </div>

                            <Switch
                                checked={form.isFeatured}
                                onChange={(checked) => updateField("isFeatured", checked)}
                                label="Destacar"
                            />
                        </div>
                    </div>

                    <span className="admin-eyebrow">Como aparece na loja</span>

                    <div className="product-preview" inert>
                        <ProductCard
                            product={preview}
                            onOpenProduct={() => undefined}
                            onAddToCart={() => undefined}
                        />
                    </div>

                    {isEditing && (
                        <button
                            type="button"
                            className="admin-button danger-outline"
                            onClick={() => setIsDeleteOpen(true)}
                        >
                            <TrashIcon size={16} />
                            Excluir produto
                        </button>
                    )}
                </aside>
            </div>

            {isDeleteOpen && (
                <DeleteProductDialog
                    productName={form.name}
                    isDeleting={isDeleting}
                    error={deleteError}
                    onCancel={() => setIsDeleteOpen(false)}
                    onConfirm={handleDelete}
                />
            )}
        </section>
    );
}
