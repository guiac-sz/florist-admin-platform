import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import Checkbox from "../../components/Form/Checkbox";
import FormAlert from "../../components/Form/FormAlert";
import SelectField from "../../components/Form/SelectField";
import TextField from "../../components/Form/TextField";
import { ApiError } from "../../services/api";
import type { Address, SaveAddressRequest } from "../../types/address";
import { BRAZILIAN_STATES, fetchAddressByCep, formatCep } from "../../utils/cep";
import { onlyDigits } from "../../utils/phone";

import "../../components/ConfirmDialog/ConfirmDialog.css";

interface AddressFormDialogProps {
    // Sem endereço = cadastrar um novo.
    address: Address | null;
    // Na primeira vez, o endereço já vai ser o principal (a caixa nem aparece).
    isFirstAddress: boolean;
    onCancel: () => void;
    onSave: (data: SaveAddressRequest) => Promise<void>;
}

interface AddressForm {
    label: string;
    zipCode: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    reference: string;
    isDefault: boolean;
}

type AddressErrors = Partial<Record<keyof AddressForm, string>>;

const LABEL_SUGGESTIONS = ["Casa", "Trabalho"];

function toForm(address: Address | null): AddressForm {
    return {
        label: address?.label ?? "",
        zipCode: formatCep(address?.zipCode ?? ""),
        street: address?.street ?? "",
        number: address?.number ?? "",
        complement: address?.complement ?? "",
        neighborhood: address?.neighborhood ?? "",
        city: address?.city ?? "",
        state: address?.state ?? "",
        reference: address?.reference ?? "",
        isDefault: address?.isDefault ?? false
    };
}

export default function AddressFormDialog({
    address,
    isFirstAddress,
    onCancel,
    onSave
}: AddressFormDialogProps) {
    const titleId = useId();
    const numberRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<AddressForm>(() => toForm(address));
    const [errors, setErrors] = useState<AddressErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [cepStatus, setCepStatus] = useState<"idle" | "loading" | "not-found">("idle");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !isSaving) {
                onCancel();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isSaving, onCancel]);

    function updateField<K extends keyof AddressForm>(field: K, value: AddressForm[K]) {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    }

    async function handleCepChange(value: string) {
        const formatted = formatCep(value);
        updateField("zipCode", formatted);

        // Só busca quando o CEP fica completo (8 números).
        if (onlyDigits(formatted).length !== 8) {
            setCepStatus("idle");
            return;
        }

        setCepStatus("loading");
        const found = await fetchAddressByCep(formatted);

        if (!found) {
            setCepStatus("not-found");
            return;
        }

        setCepStatus("idle");

        // Preenche só o que o ViaCEP trouxe (CEP de cidade pequena às vezes
        // não tem rua) e leva o cursor para o número, que nunca vem.
        setForm((current) => ({
            ...current,
            street: found.street || current.street,
            neighborhood: found.neighborhood || current.neighborhood,
            city: found.city || current.city,
            state: found.state || current.state
        }));
        setErrors((current) => ({
            ...current,
            street: undefined,
            neighborhood: undefined,
            city: undefined,
            state: undefined
        }));
        numberRef.current?.focus();
    }

    function validate(): AddressErrors {
        const result: AddressErrors = {};

        if (!form.label.trim()) result.label = "Dê um nome, como “Casa”.";
        if (onlyDigits(form.zipCode).length !== 8) result.zipCode = "Informe o CEP completo.";
        if (!form.street.trim()) result.street = "Informe a rua.";
        if (!form.number.trim()) result.number = "Informe o número (ou “s/n”).";
        if (!form.neighborhood.trim()) result.neighborhood = "Informe o bairro.";
        if (!form.city.trim()) result.city = "Informe a cidade.";
        if (!form.state) result.state = "Escolha o estado.";

        return result;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationErrors = validate();
        setErrors(validationErrors);
        setFormError(null);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setIsSaving(true);

        try {
            await onSave({
                label: form.label.trim(),
                zipCode: onlyDigits(form.zipCode),
                street: form.street.trim(),
                number: form.number.trim(),
                complement: form.complement.trim() || null,
                neighborhood: form.neighborhood.trim(),
                city: form.city.trim(),
                state: form.state,
                reference: form.reference.trim() || null,
                isDefault: form.isDefault
            });
            // Quem abriu o diálogo fecha ele depois de salvar.
        } catch (error) {
            setFormError(
                error instanceof ApiError
                    ? error.message
                    : "Não foi possível salvar o endereço. Tente novamente."
            );
            setIsSaving(false);
        }
    }

    return (
        <div className="dialog-overlay" onClick={isSaving ? undefined : onCancel}>
            <form
                className="dialog address-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                noValidate
                onSubmit={handleSubmit}
                onClick={(event) => event.stopPropagation()}
            >
                <h2 id={titleId}>{address ? "Editar endereço" : "Novo endereço"}</h2>

                {formError && <FormAlert>{formError}</FormAlert>}

                <div className="address-label-row">
                    <TextField
                        label="Nome do endereço"
                        name="label"
                        placeholder="Casa, Trabalho, Casa da mãe..."
                        maxLength={30}
                        value={form.label}
                        error={errors.label}
                        onChange={(event) => updateField("label", event.target.value)}
                        autoFocus
                    />

                    <div className="address-label-chips">
                        {LABEL_SUGGESTIONS.map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                className={`address-chip ${form.label === suggestion ? "active" : ""}`}
                                onClick={() => updateField("label", suggestion)}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="address-grid">
                    <div className="address-cep">
                        <TextField
                            label="CEP"
                            name="zipCode"
                            inputMode="numeric"
                            autoComplete="postal-code"
                            placeholder="00000-000"
                            value={form.zipCode}
                            error={errors.zipCode}
                            onChange={(event) => void handleCepChange(event.target.value)}
                        />

                        <p className="address-cep-hint" role="status">
                            {cepStatus === "loading" && "Buscando endereço..."}
                            {cepStatus === "not-found" &&
                                "Não achamos esse CEP. Preencha o endereço abaixo."}
                        </p>
                    </div>

                    <div className="address-span-2">
                        <TextField
                            label="Rua"
                            name="street"
                            autoComplete="address-line1"
                            value={form.street}
                            error={errors.street}
                            onChange={(event) => updateField("street", event.target.value)}
                        />
                    </div>

                    <TextField
                        ref={numberRef}
                        label="Número"
                        name="number"
                        maxLength={10}
                        value={form.number}
                        error={errors.number}
                        onChange={(event) => updateField("number", event.target.value)}
                    />

                    <div className="address-span-2">
                        <TextField
                            label="Complemento (opcional)"
                            name="complement"
                            placeholder="Apartamento, bloco..."
                            autoComplete="address-line2"
                            value={form.complement}
                            onChange={(event) => updateField("complement", event.target.value)}
                        />
                    </div>

                    <TextField
                        label="Bairro"
                        name="neighborhood"
                        value={form.neighborhood}
                        error={errors.neighborhood}
                        onChange={(event) => updateField("neighborhood", event.target.value)}
                    />

                    <TextField
                        label="Cidade"
                        name="city"
                        autoComplete="address-level2"
                        value={form.city}
                        error={errors.city}
                        onChange={(event) => updateField("city", event.target.value)}
                    />

                    <SelectField
                        label="Estado"
                        name="state"
                        value={form.state}
                        error={errors.state}
                        onChange={(event) => updateField("state", event.target.value)}
                    >
                        <option value="">UF</option>
                        {BRAZILIAN_STATES.map((uf) => (
                            <option key={uf} value={uf}>
                                {uf}
                            </option>
                        ))}
                    </SelectField>
                </div>

                <TextField
                    label="Ponto de referência (opcional)"
                    name="reference"
                    placeholder="Ajuda o entregador: portão verde, ao lado da padaria..."
                    maxLength={120}
                    value={form.reference}
                    onChange={(event) => updateField("reference", event.target.value)}
                />

                {/* Um endereço que já é o principal não pode ser "desmarcado":
                    para trocar, marca-se outro. */}
                {!isFirstAddress && !address?.isDefault && (
                    <Checkbox
                        label="Usar como endereço principal"
                        checked={form.isDefault}
                        onChange={(event) => updateField("isDefault", event.target.checked)}
                    />
                )}

                <div className="dialog-actions">
                    <button
                        type="button"
                        className="account-button is-outline"
                        onClick={onCancel}
                        disabled={isSaving}
                    >
                        Cancelar
                    </button>

                    <button type="submit" className="account-button" disabled={isSaving}>
                        {isSaving ? "Salvando..." : "Salvar endereço"}
                    </button>
                </div>
            </form>
        </div>
    );
}
