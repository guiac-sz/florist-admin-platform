import { useEffect, useState } from "react";

import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import FormAlert from "../../components/Form/FormAlert";
import { MapPinIcon, PencilIcon, PlusIcon, TrashIcon } from "../../components/Icons/Icons";
import { useAuth } from "../../hooks/useAuth";
import {
    createAddress,
    deleteAddress,
    getAddresses,
    setDefaultAddress,
    updateAddress
} from "../../services/addresses";
import type { Address, SaveAddressRequest } from "../../types/address";
import { formatAddressLine } from "../../utils/cep";
import AddressFormDialog from "./AddressFormDialog";

import "./AddressesPage.css";

// null = diálogo fechado; "new" = cadastrar; Address = editar aquele.
type EditingState = null | "new" | Address;

export default function AddressesPage() {
    const { token } = useAuth();

    const [addresses, setAddresses] = useState<Address[] | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [editing, setEditing] = useState<EditingState>(null);
    const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            return;
        }

        let ignore = false;

        getAddresses(token)
            .then((data) => {
                if (!ignore) setAddresses(data);
            })
            .catch(() => {
                if (!ignore) setLoadError("Não foi possível carregar seus endereços.");
            });

        return () => {
            ignore = true;
        };
    }, [token]);

    // Depois de salvar ou excluir, a ordem (principal primeiro) e a marca de
    // "Principal" podem mudar em vários cards; buscar a lista de novo é o
    // jeito mais simples de a tela ficar igual ao banco.
    async function reload() {
        if (token) {
            setAddresses(await getAddresses(token));
        }
    }

    async function handleSave(data: SaveAddressRequest) {
        if (!token) {
            return;
        }

        if (editing === "new") {
            await createAddress(token, data);
        } else if (editing) {
            await updateAddress(token, editing.id, data);
        }

        setEditing(null);
        await reload();
    }

    async function handleSetDefault(address: Address) {
        if (!token) {
            return;
        }

        setActionError(null);

        try {
            setAddresses(await setDefaultAddress(token, address.id));
        } catch {
            setActionError("Não foi possível trocar o endereço principal. Tente de novo.");
        }
    }

    async function handleDelete() {
        if (!token || !addressToDelete) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await deleteAddress(token, addressToDelete.id);
            setAddressToDelete(null);
            await reload();
        } catch {
            setDeleteError("Não foi possível excluir. Tente novamente.");
        } finally {
            setIsDeleting(false);
        }
    }

    function closeDeleteDialog() {
        setAddressToDelete(null);
        setDeleteError(null);
    }

    function renderList() {
        if (loadError) {
            return <FormAlert>{loadError}</FormAlert>;
        }

        if (!addresses) {
            return <p className="address-empty">Carregando endereços...</p>;
        }

        if (addresses.length === 0) {
            return (
                <div className="address-empty">
                    <MapPinIcon size={28} />
                    <p>
                        Você ainda não tem endereços salvos. Cadastre um para agilizar a
                        entrega das suas flores.
                    </p>
                </div>
            );
        }

        return (
            <ul className="address-list">
                {addresses.map((address) => (
                    <li key={address.id} className="address-item">
                        <MapPinIcon size={20} />

                        <div className="address-text">
                            <div className="address-title">
                                <strong>{address.label}</strong>
                                {address.isDefault && (
                                    <span className="address-badge">Principal</span>
                                )}
                            </div>

                            <p>{formatAddressLine(address)}</p>

                            {address.reference && (
                                <small>Referência: {address.reference}</small>
                            )}
                        </div>

                        <div className="address-actions">
                            {!address.isDefault && (
                                <button
                                    type="button"
                                    className="address-link"
                                    onClick={() => handleSetDefault(address)}
                                >
                                    Tornar principal
                                </button>
                            )}

                            <button
                                type="button"
                                className="address-icon-button"
                                onClick={() => setEditing(address)}
                                aria-label={`Editar ${address.label}`}
                                title="Editar"
                            >
                                <PencilIcon size={17} />
                            </button>

                            <button
                                type="button"
                                className="address-icon-button danger"
                                onClick={() => setAddressToDelete(address)}
                                aria-label={`Excluir ${address.label}`}
                                title="Excluir"
                            >
                                <TrashIcon size={17} />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <>
            <header className="account-page-header">
                <h1>Endereços</h1>
                <p>Salve onde você costuma receber flores. O principal já vem escolhido na compra.</p>
            </header>

            <section className="account-card">
                <div className="address-card-header">
                    <h2>Endereços salvos</h2>

                    <button
                        type="button"
                        className="account-button is-outline"
                        onClick={() => setEditing("new")}
                    >
                        <PlusIcon size={16} />
                        Novo endereço
                    </button>
                </div>

                {actionError && <FormAlert>{actionError}</FormAlert>}

                {renderList()}
            </section>

            {editing && (
                <AddressFormDialog
                    address={editing === "new" ? null : editing}
                    isFirstAddress={(addresses?.length ?? 0) === 0}
                    onCancel={() => setEditing(null)}
                    onSave={handleSave}
                />
            )}

            {addressToDelete && (
                <ConfirmDialog
                    title={`Excluir “${addressToDelete.label}”?`}
                    icon={<TrashIcon size={20} />}
                    confirmLabel="Excluir endereço"
                    isBusy={isDeleting}
                    error={deleteError}
                    onCancel={closeDeleteDialog}
                    onConfirm={handleDelete}
                >
                    <p>{formatAddressLine(addressToDelete)}</p>

                    {addressToDelete.isDefault && (addresses?.length ?? 0) > 1 && (
                        <p>Ele é o seu principal: o endereço mais antigo passa a ser o principal.</p>
                    )}
                </ConfirmDialog>
            )}
        </>
    );
}
