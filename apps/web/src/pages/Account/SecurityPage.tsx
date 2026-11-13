import { useState, type FormEvent } from "react";

import FormAlert from "../../components/Form/FormAlert";
import PasswordField from "../../components/Form/PasswordField";
import PasswordStrength from "../../components/Form/PasswordStrength";
import { CheckIcon } from "../../components/Icons/Icons";
import { useAuth } from "../../hooks/useAuth";
import { changePassword } from "../../services/account";
import { ApiError } from "../../services/api";
import { isPasswordValid } from "../../utils/password";

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

type PasswordErrors = Partial<Record<keyof PasswordForm, string>>;

const emptyForm: PasswordForm = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
};

export default function SecurityPage() {
    const { token } = useAuth();

    const [form, setForm] = useState<PasswordForm>(emptyForm);
    const [errors, setErrors] = useState<PasswordErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    function updateField(field: keyof PasswordForm, value: string) {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
        setNotice(null);
    }

    function validate(): PasswordErrors {
        const result: PasswordErrors = {};

        if (!form.currentPassword) {
            result.currentPassword = "Informe sua senha atual.";
        }

        if (!isPasswordValid(form.newPassword)) {
            result.newPassword = "Use no mínimo 8 caracteres, com letras e números.";
        } else if (form.newPassword === form.currentPassword) {
            result.newPassword = "A nova senha precisa ser diferente da atual.";
        }

        if (form.confirmPassword !== form.newPassword) {
            result.confirmPassword = "As senhas não conferem.";
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
            await changePassword(token, {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            });

            // Limpa os campos: senha não deve ficar "parada" na tela.
            setForm(emptyForm);
            setNotice("Senha atualizada. Use a nova senha no próximo login.");
        } catch (error) {
            if (error instanceof ApiError && error.message === "Senha atual incorreta.") {
                setErrors({ currentPassword: error.message });
            } else if (error instanceof ApiError && error.status === 400) {
                setFormError(error.message);
            } else {
                setFormError("Não foi possível trocar a senha agora. Tente novamente.");
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <>
            <header className="account-page-header">
                <h1>Senha e segurança</h1>
                <p>Troque sua senha sempre que achar que alguém pode saber qual é.</p>
            </header>

            <form className="account-card" noValidate onSubmit={handleSubmit}>
                <h2>Alterar senha</h2>

                {formError && <FormAlert>{formError}</FormAlert>}

                <div className="account-field-grid is-three">
                    <PasswordField
                        label="Senha atual"
                        name="currentPassword"
                        autoComplete="current-password"
                        value={form.currentPassword}
                        error={errors.currentPassword}
                        onChange={(event) => updateField("currentPassword", event.target.value)}
                    />

                    <PasswordField
                        label="Nova senha"
                        name="newPassword"
                        autoComplete="new-password"
                        value={form.newPassword}
                        error={errors.newPassword}
                        onChange={(event) => updateField("newPassword", event.target.value)}
                    />

                    <PasswordField
                        label="Confirmar nova senha"
                        name="confirmPassword"
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        error={errors.confirmPassword}
                        onChange={(event) => updateField("confirmPassword", event.target.value)}
                    />
                </div>

                {form.newPassword && <PasswordStrength password={form.newPassword} />}

                <div className="account-card-actions">
                    {notice && (
                        <p className="form-notice" role="status">
                            <CheckIcon size={16} />
                            {notice}
                        </p>
                    )}

                    <button type="submit" className="account-button" disabled={isSaving}>
                        {isSaving ? "Atualizando..." : "Atualizar senha"}
                    </button>
                </div>
            </form>
        </>
    );
}
