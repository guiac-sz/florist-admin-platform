import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FormEvent } from "react";

import { CheckIcon, GripIcon, PencilIcon, TrashIcon, XIcon } from "../../components/Icons/Icons";
import type { AdminCategory } from "../../types/admin";

interface AdminCategoryRowProps {
    category: AdminCategory;
    canReorder: boolean;
    isEditing: boolean;
    editingName: string;
    editError: string | null;
    isSaving: boolean;
    onEditingNameChange: (name: string) => void;
    onStartEdit: (category: AdminCategory) => void;
    onCancelEdit: () => void;
    onSaveEdit: () => void;
    onDelete: (category: AdminCategory) => void;
}

function formatCount(count: number) {
    return count === 1 ? "1 produto" : `${count} produtos`;
}

export default function AdminCategoryRow({
    category,
    canReorder,
    isEditing,
    editingName,
    editError,
    isSaving,
    onEditingNameChange,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onDelete
}: AdminCategoryRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: category.id, disabled: !canReorder });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSaveEdit();
    }

    return (
        <li
            ref={setNodeRef}
            className={`category-row ${isDragging ? "is-dragging" : ""}`}
            style={{ transform: CSS.Translate.toString(transform), transition }}
        >
            <button
                type="button"
                ref={setActivatorNodeRef}
                className="admin-drag-handle"
                disabled={!canReorder}
                aria-label={`Mover ${category.name}`}
                title={canReorder ? "Arraste para reordenar" : undefined}
                {...attributes}
                {...listeners}
            >
                <GripIcon size={18} />
            </button>

            {isEditing ? (
                <form className="category-edit" onSubmit={handleSubmit}>
                    <div className="category-edit-field">
                        <input
                            className={`field-input ${editError ? "has-error" : ""}`}
                            value={editingName}
                            onChange={(event) => onEditingNameChange(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Escape") onCancelEdit();
                            }}
                            maxLength={40}
                            aria-label={`Novo nome para ${category.name}`}
                            aria-invalid={editError ? true : undefined}
                            disabled={isSaving}
                            autoFocus
                        />

                        {editError && (
                            <p className="field-error" role="alert">
                                {editError}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="admin-icon-button confirm"
                        disabled={isSaving}
                        aria-label="Salvar nome"
                        title="Salvar (Enter)"
                    >
                        <CheckIcon size={17} />
                    </button>

                    <button
                        type="button"
                        className="admin-icon-button"
                        onClick={onCancelEdit}
                        disabled={isSaving}
                        aria-label="Cancelar"
                        title="Cancelar (Esc)"
                    >
                        <XIcon size={17} />
                    </button>
                </form>
            ) : (
                <>
                    <div className="category-info">
                        <strong>{category.name}</strong>

                        {category.productCount === 0 ? (
                            <span className="admin-badge sold-out">
                                Sem produtos · não aparece na loja
                            </span>
                        ) : (
                            <small>{formatCount(category.productCount)}</small>
                        )}
                    </div>

                    <div className="admin-row-actions">
                        <button
                            type="button"
                            className="admin-icon-button"
                            onClick={() => onStartEdit(category)}
                            aria-label={`Renomear ${category.name}`}
                            title="Renomear"
                        >
                            <PencilIcon size={17} />
                        </button>

                        <button
                            type="button"
                            className="admin-icon-button danger"
                            onClick={() => onDelete(category)}
                            aria-label={`Excluir ${category.name}`}
                            title="Excluir"
                        >
                            <TrashIcon size={17} />
                        </button>
                    </div>
                </>
            )}
        </li>
    );
}
