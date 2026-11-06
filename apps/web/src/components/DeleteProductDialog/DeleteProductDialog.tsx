import { useEffect, useRef } from "react";

import FormAlert from "../Form/FormAlert";
import { EyeOffIcon, TrashIcon } from "../Icons/Icons";

import "./DeleteProductDialog.css";

interface DeleteProductDialogProps {
    productName: string;
    isDeleting: boolean;
    error: string | null;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function DeleteProductDialog({
    productName,
    isDeleting,
    error,
    onCancel,
    onConfirm
}: DeleteProductDialogProps) {
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        cancelRef.current?.focus();

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !isDeleting) {
                onCancel();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isDeleting, onCancel]);

    return (
        <div className="dialog-overlay" onClick={isDeleting ? undefined : onCancel}>
            <div
                className="dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-text"
                onClick={(event) => event.stopPropagation()}
            >
                <span className="dialog-icon">
                    <TrashIcon size={20} />
                </span>

                <h2 id="delete-dialog-title">Excluir “{productName}”?</h2>

                <p id="delete-dialog-text">
                    O produto sai da loja e do painel. Essa ação não pode ser desfeita.
                </p>

                <div className="dialog-tip">
                    <EyeOffIcon size={16} />
                    Só quer tirar da loja por um tempo? Desligue “Na vitrine”.
                </div>

                {error && <FormAlert>{error}</FormAlert>}

                <div className="dialog-actions">
                    <button
                        ref={cancelRef}
                        type="button"
                        className="admin-button outline"
                        onClick={onCancel}
                        disabled={isDeleting}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="admin-button danger"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Excluindo..." : "Excluir produto"}
                    </button>
                </div>
            </div>
        </div>
    );
}
