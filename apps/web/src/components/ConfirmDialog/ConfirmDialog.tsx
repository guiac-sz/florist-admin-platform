import { useEffect, useId, useRef, type ReactNode } from "react";

import FormAlert from "../Form/FormAlert";

import "./ConfirmDialog.css";

interface ConfirmDialogProps {
    title: string;
    children: ReactNode;
    icon?: ReactNode;
    iconTone?: "danger" | "neutral";
    cancelLabel?: string;
    // Sem onConfirm, o diálogo vira só um aviso, com um botão para fechar.
    confirmLabel?: string;
    busyLabel?: string;
    isBusy?: boolean;
    error?: string | null;
    onCancel: () => void;
    onConfirm?: () => void;
}

/**
 * Janela de confirmação reaproveitável (excluir produto, excluir categoria...).
 * Fecha com Esc ou clicando fora, a não ser que esteja processando.
 */
export default function ConfirmDialog({
    title,
    children,
    icon,
    iconTone = "danger",
    cancelLabel = "Cancelar",
    confirmLabel = "Excluir",
    busyLabel = "Excluindo...",
    isBusy = false,
    error,
    onCancel,
    onConfirm
}: ConfirmDialogProps) {
    const titleId = useId();
    const textId = useId();
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // Foco no botão seguro: um Enter sem querer não exclui nada.
        cancelRef.current?.focus();

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !isBusy) {
                onCancel();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isBusy, onCancel]);

    return (
        <div className="dialog-overlay" onClick={isBusy ? undefined : onCancel}>
            <div
                className="dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={textId}
                onClick={(event) => event.stopPropagation()}
            >
                {icon && <span className={`dialog-icon ${iconTone}`}>{icon}</span>}

                <h2 id={titleId}>{title}</h2>

                <div id={textId} className="dialog-body">
                    {children}
                </div>

                {error && <FormAlert>{error}</FormAlert>}

                <div className="dialog-actions">
                    <button
                        ref={cancelRef}
                        type="button"
                        className={`admin-button ${onConfirm ? "outline" : "primary"}`}
                        onClick={onCancel}
                        disabled={isBusy}
                    >
                        {cancelLabel}
                    </button>

                    {onConfirm && (
                        <button
                            type="button"
                            className="admin-button danger"
                            onClick={onConfirm}
                            disabled={isBusy}
                        >
                            {isBusy ? busyLabel : confirmLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
