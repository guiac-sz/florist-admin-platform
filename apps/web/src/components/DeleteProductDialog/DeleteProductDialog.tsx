import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { EyeOffIcon, TrashIcon } from "../Icons/Icons";

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
    return (
        <ConfirmDialog
            title={`Excluir “${productName}”?`}
            icon={<TrashIcon size={20} />}
            confirmLabel="Excluir produto"
            isBusy={isDeleting}
            error={error}
            onCancel={onCancel}
            onConfirm={onConfirm}
        >
            <p>O produto sai da loja e do painel. Essa ação não pode ser desfeita.</p>

            <div className="dialog-tip">
                <EyeOffIcon size={16} />
                Só quer tirar da loja por um tempo? Desligue “Na vitrine”.
            </div>
        </ConfirmDialog>
    );
}
