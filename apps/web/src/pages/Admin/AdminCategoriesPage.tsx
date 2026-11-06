import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type Modifier
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";

import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import FormAlert from "../../components/Form/FormAlert";
import { AlertCircleIcon, PlusIcon, TrashIcon } from "../../components/Icons/Icons";
import { useAuth } from "../../hooks/useAuth";
import { ApiError } from "../../services/api";
import {
    createAdminCategory,
    deleteAdminCategory,
    getAdminCategories,
    renameAdminCategory,
    reorderAdminCategories
} from "../../services/admin";
import type { AdminCategory } from "../../types/admin";
import AdminCategoryRow from "./AdminCategoryRow";

// Reaproveita os estilos da lista de produtos (cartão, alça, botões e etiquetas).
import "./AdminProductsPage.css";
import "./AdminCategoriesPage.css";

const restrictToVerticalAxis: Modifier = ({ transform }) => ({ ...transform, x: 0 });

const screenReaderInstructions = {
    draggable:
        "Para mover uma categoria, pressione espaço ou enter. Use as setas para cima e para baixo " +
        "e pressione espaço ou enter de novo para soltar. Esc cancela."
};

// A API devolve a mensagem pronta em português (ex.: "Já existe a categoria...").
function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof ApiError ? error.message : fallback;
}

export default function AdminCategoriesPage() {
    const { token } = useAuth();

    const [categories, setCategories] = useState<AdminCategory[] | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    // Nova categoria
    const [newName, setNewName] = useState("");
    const [createError, setCreateError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Renomear (uma categoria por vez)
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState("");
    const [editError, setEditError] = useState<string | null>(null);
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // Excluir
    const [categoryToDelete, setCategoryToDelete] = useState<AdminCategory | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        if (!token) {
            return;
        }

        let ignore = false;

        getAdminCategories(token)
            .then((data) => {
                if (!ignore) setCategories(data);
            })
            .catch(() => {
                if (!ignore) {
                    setLoadError("Não foi possível carregar as categorias. Tente novamente.");
                }
            });

        return () => {
            ignore = true;
        };
    }, [token]);

    async function handleCreate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!token) {
            return;
        }

        if (!newName.trim()) {
            setCreateError("Informe o nome da categoria.");
            return;
        }

        setIsCreating(true);
        setCreateError(null);

        try {
            const created = await createAdminCategory(token, newName);
            setCategories((current) => [...(current ?? []), created]);
            setNewName("");
        } catch (error) {
            setCreateError(getErrorMessage(error, "Não foi possível criar. Tente novamente."));
        } finally {
            setIsCreating(false);
        }
    }

    function startEdit(category: AdminCategory) {
        setEditingId(category.id);
        setEditingName(category.name);
        setEditError(null);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditError(null);
    }

    async function saveEdit() {
        if (!token || editingId === null) {
            return;
        }

        if (!editingName.trim()) {
            setEditError("Informe o nome da categoria.");
            return;
        }

        setIsSavingEdit(true);
        setEditError(null);

        try {
            const updated = await renameAdminCategory(token, editingId, editingName);
            setCategories(
                (current) =>
                    current?.map((item) => (item.id === updated.id ? updated : item)) ?? null
            );
            setEditingId(null);
        } catch (error) {
            setEditError(getErrorMessage(error, "Não foi possível renomear. Tente novamente."));
        } finally {
            setIsSavingEdit(false);
        }
    }

    async function handleDelete() {
        if (!token || !categoryToDelete) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await deleteAdminCategory(token, categoryToDelete.id);
            setCategories(
                (current) => current?.filter((item) => item.id !== categoryToDelete.id) ?? null
            );
            setCategoryToDelete(null);
        } catch (error) {
            setDeleteError(getErrorMessage(error, "Não foi possível excluir. Tente novamente."));
        } finally {
            setIsDeleting(false);
        }
    }

    function closeDeleteDialog() {
        setCategoryToDelete(null);
        setDeleteError(null);
    }

    async function handleDragEnd({ active, over }: DragEndEvent) {
        if (!token || !categories || !over || active.id === over.id) {
            return;
        }

        const oldIndex = categories.findIndex((item) => item.id === active.id);
        const newIndex = categories.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(categories, oldIndex, newIndex);

        setActionError(null);
        setCategories(reordered);

        try {
            await reorderAdminCategories(token, reordered.map((item) => item.id));
        } catch {
            setCategories(categories);
            setActionError("Não foi possível salvar a nova ordem. Tente de novo.");
        }
    }

    function renderDeleteDialog() {
        if (!categoryToDelete) {
            return null;
        }

        const { name, productCount } = categoryToDelete;

        // Com produtos, a API recusaria. Avisamos antes, explicando o que fazer.
        if (productCount > 0) {
            return (
                <ConfirmDialog
                    title={`Não dá para excluir “${name}” ainda`}
                    icon={<AlertCircleIcon size={20} />}
                    iconTone="neutral"
                    cancelLabel="Entendi"
                    onCancel={closeDeleteDialog}
                >
                    <p>
                        Ela tem {productCount === 1 ? "1 produto" : `${productCount} produtos`}.
                        Todo produto precisa de uma categoria, então mova{" "}
                        {productCount === 1 ? "ele" : "eles"} para outra em{" "}
                        <Link to="/admin/produtos">Produtos e vitrine</Link> e tente de novo.
                    </p>
                </ConfirmDialog>
            );
        }

        return (
            <ConfirmDialog
                title={`Excluir “${name}”?`}
                icon={<TrashIcon size={20} />}
                confirmLabel="Excluir categoria"
                isBusy={isDeleting}
                error={deleteError}
                onCancel={closeDeleteDialog}
                onConfirm={handleDelete}
            >
                <p>Ela não tem produtos, então nada muda na loja.</p>
            </ConfirmDialog>
        );
    }

    function renderList() {
        if (loadError) {
            return <FormAlert>{loadError}</FormAlert>;
        }

        if (!categories) {
            return <p className="admin-empty">Carregando categorias...</p>;
        }

        if (categories.length === 0) {
            return <p className="admin-empty">Nenhuma categoria ainda. Crie a primeira acima.</p>;
        }

        // Enquanto renomeia, o arraste fica desligado para não misturar as ações.
        const canReorder = editingId === null;

        return (
            <div className="admin-table-card">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    accessibility={{ screenReaderInstructions }}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={categories.map((category) => category.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <ul className="category-list">
                            {categories.map((category) => (
                                <AdminCategoryRow
                                    key={category.id}
                                    category={category}
                                    canReorder={canReorder}
                                    isEditing={editingId === category.id}
                                    editingName={editingName}
                                    editError={editError}
                                    isSaving={isSavingEdit}
                                    onEditingNameChange={(name) => {
                                        setEditingName(name);
                                        setEditError(null);
                                    }}
                                    onStartEdit={startEdit}
                                    onCancelEdit={cancelEdit}
                                    onSaveEdit={saveEdit}
                                    onDelete={setCategoryToDelete}
                                />
                            ))}
                        </ul>
                    </SortableContext>
                </DndContext>

                <p className="admin-table-footer">
                    {categories.length === 1 ? "1 categoria" : `${categories.length} categorias`} ·
                    a ordem aqui é a ordem dos filtros na loja
                </p>
            </div>
        );
    }

    return (
        <section className="admin-categories">
            <header className="admin-page-header">
                <div>
                    <h1>Categorias</h1>
                    <p>
                        Organizam os filtros da loja. Arraste pela alça para mudar a ordem
                        em que aparecem.
                    </p>
                </div>
            </header>

            <form className="category-create" onSubmit={handleCreate} noValidate>
                <label className="visually-hidden" htmlFor="new-category">
                    Nome da nova categoria
                </label>

                <div className="category-create-field">
                    <input
                        id="new-category"
                        className={`field-input ${createError ? "has-error" : ""}`}
                        placeholder="Nova categoria, por exemplo: Orquídeas"
                        value={newName}
                        maxLength={40}
                        onChange={(event) => {
                            setNewName(event.target.value);
                            setCreateError(null);
                        }}
                        aria-invalid={createError ? true : undefined}
                        disabled={isCreating}
                    />

                    {createError && (
                        <p className="field-error" role="alert">
                            {createError}
                        </p>
                    )}
                </div>

                <button type="submit" className="admin-button primary" disabled={isCreating}>
                    <PlusIcon size={18} />
                    {isCreating ? "Adicionando..." : "Adicionar"}
                </button>
            </form>

            {actionError && <FormAlert>{actionError}</FormAlert>}

            {renderList()}

            {renderDeleteDialog()}
        </section>
    );
}
