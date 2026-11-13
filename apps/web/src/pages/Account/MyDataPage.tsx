import { useState, type FormEvent } from "react";

import Checkbox from "../../components/Form/Checkbox";
import FormAlert from "../../components/Form/FormAlert";
import PasswordField from "../../components/Form/PasswordField";
import TextField from "../../components/Form/TextField";
import { CheckIcon } from "../../components/Icons/Icons";
import { useAuth } from "../../hooks/useAuth";
import { updateProfile } from "../../services/account";
import { ApiError } from "../../services/api";
import type { AuthUser } from "../../types/auth";
import { formatCpf, isValidCpf } from "../../utils/cpf";
import { formatPhone, onlyDigits } from "../../utils/phone";

interface ProfileForm {
    name: string;
    email: string;
    phone: string;
    cpf: string;
    acceptsMarketing: boolean;
    currentPassword: string;
}

type ProfileErrors = Partial<Record<keyof ProfileForm, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toForm(user: AuthUser): ProfileForm {
    return {
        name: user.name,
        email: user.email,
        phone: formatPhone(user.phone ?? ""),
        cpf: formatCpf(user.cpf ?? ""),
        acceptsMarketing: user.acceptsMarketing,
        currentPassword: ""
    };
}

function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

export default function MyDataPage() {
    const { user, token, updateUser } = useAuth();

    // O RequireAuth garante que existe user aqui.
    const [form, setForm] = useState<ProfileForm>(() => toForm(user as AuthUser));
    const [errors, setErrors] = useState<ProfileErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    if (!user || !token) {
        return null;
    }

    // Estado derivado: não guardamos "mudou o e-mail?", calculamos.
    const isChangingEmail = normalizeEmail(form.email) !== user.email;

    function updateField<K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
        setNotice(null);
    }

    function validate(): ProfileErrors {
        const result: ProfileErrors = {};

        if (!form.name.trim()) {
            result.name = "Informe seu nome completo.";
        }

        if (!EMAIL_PATTERN.test(form.email.trim())) {
            result.email = "Digite um e-mail válido.";
        }

        if (onlyDigits(form.phone).length < 10) {
            result.phone = "Informe o celular com DDD.";
        }

        if (form.cpf && !isValidCpf(form.cpf)) {
            result.cpf = "CPF inválido. Confira os números.";
        }

        if (isChangingEmail && !form.currentPassword) {
            result.currentPassword = "Digite sua senha atual para confirmar.";
        }

        return result;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!token) {
            return;
        }

        const validationErrors = validate();
        setErrors(validationErrors);
        setFormError(null);
        setNotice(null);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setIsSaving(true);

        try {
            const updated = await updateProfile(token, {
                name: form.name.trim(),
                email: normalizeEmail(form.email),
                phone: onlyDigits(form.phone),
                cpf: onlyDigits(form.cpf) || null,
                acceptsMarketing: form.acceptsMarketing,
                currentPassword: isChangingEmail ? form.currentPassword : undefined
            });

            // Atualiza o usuário no site todo (cabeçalho, menu) e o formulário.
            updateUser(updated);
            setForm(toForm(updated));
            setNotice("Dados atualizados.");
        } catch (error) {
            if (error instanceof ApiError && error.status === 409) {
                setErrors({ email: error.message });
            } else if (error instanceof ApiError && error.message === "Senha atual incorreta.") {
                setErrors({ currentPassword: error.message });
            } else if (error instanceof ApiError && error.status === 400) {
                setFormError(error.message);
            } else {
                setFormError("Não foi possível salvar agora. Tente novamente em instantes.");
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <>
            <header className="account-page-header">
                <h1>Meus dados</h1>
                <p>Mantenha seus dados atualizados para agilizar as próximas compras.</p>
            </header>

            <form className="account-card" noValidate onSubmit={handleSubmit}>
                <h2>Dados pessoais</h2>

                {formError && <FormAlert>{formError}</FormAlert>}

                <div className="account-field-grid">
                    <TextField
                        label="Nome completo"
                        name="name"
                        autoComplete="name"
                        value={form.name}
                        error={errors.name}
                        onChange={(event) => updateField("name", event.target.value)}
                    />

                    <TextField
                        label="CPF (para nota fiscal)"
                        name="cpf"
                        placeholder="000.000.000-00"
                        inputMode="numeric"
                        value={form.cpf}
                        error={errors.cpf}
                        onChange={(event) => updateField("cpf", formatCpf(event.target.value))}
                    />

                    <TextField
                        label="E-mail"
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={form.email}
                        error={errors.email}
                        onChange={(event) => updateField("email", event.target.value)}
                    />

                    <TextField
                        label="Celular (WhatsApp)"
                        type="tel"
                        name="phone"
                        autoComplete="tel-national"
                        inputMode="numeric"
                        value={form.phone}
                        error={errors.phone}
                        onChange={(event) =>
                            updateField("phone", formatPhone(event.target.value))
                        }
                    />
                </div>

                {/* Só aparece quando o e-mail foi alterado. */}
                {isChangingEmail && (
                    <div className="account-email-confirm">
                        <p>
                            Você está trocando o e-mail que usa para entrar. Por segurança,
                            confirme sua senha atual.
                        </p>

                        <PasswordField
                            label="Senha atual"
                            name="currentPassword"
                            autoComplete="current-password"
                            value={form.currentPassword}
                            error={errors.currentPassword}
                            onChange={(event) =>
                                updateField("currentPassword", event.target.value)
                            }
                        />
                    </div>
                )}

                <Checkbox
                    label="Receber novidades e lembretes de datas especiais por e-mail"
                    checked={form.acceptsMarketing}
                    onChange={(event) => updateField("acceptsMarketing", event.target.checked)}
                />

                <div className="account-card-actions">
                    {notice && (
                        <p className="form-notice" role="status">
                            <CheckIcon size={16} />
                            {notice}
                        </p>
                    )}

                    <button type="submit" className="account-button" disabled={isSaving}>
                        {isSaving ? "Salvando..." : "Salvar alterações"}
                    </button>
                </div>
            </form>
        </>
    );
}
