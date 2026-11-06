import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";

import TextField from "../../components/Form/TextField";
import PasswordField from "../../components/Form/PasswordField";
import PasswordStrength from "../../components/Form/PasswordStrength";
import Checkbox from "../../components/Form/Checkbox";
import FormAlert from "../../components/Form/FormAlert";
import { useAuth } from "../../hooks/useAuth";
import { ApiError } from "../../services/api";
import { isPasswordValid } from "../../utils/password";
import { formatPhone, onlyDigits } from "../../utils/phone";

interface RegisterForm {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    acceptsTerms: boolean;
    acceptsMarketing: boolean;
}

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialForm: RegisterForm = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptsTerms: false,
    acceptsMarketing: false
};

function validate(form: RegisterForm): RegisterErrors {
    const errors: RegisterErrors = {};
    const phoneDigits = onlyDigits(form.phone);

    if (!form.name.trim()) {
        errors.name = "Informe seu nome completo.";
    }

    if (!form.email.trim()) {
        errors.email = "Informe seu e-mail.";
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
        errors.email = "Digite um e-mail válido.";
    }

    if (phoneDigits.length < 10) {
        errors.phone = "Informe o celular com DDD.";
    }

    if (!isPasswordValid(form.password)) {
        errors.password = "Use no mínimo 8 caracteres, com letras e números.";
    }

    if (form.confirmPassword !== form.password) {
        errors.confirmPassword = "As senhas não conferem.";
    }

    if (!form.acceptsTerms) {
        errors.acceptsTerms = "É preciso aceitar os termos para criar a conta.";
    }

    return errors;
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const { isAuthenticated, signUp } = useAuth();

    const [form, setForm] = useState<RegisterForm>(initialForm);
    const [errors, setErrors] = useState<RegisterErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateField<K extends keyof RegisterForm>(
        field: K,
        value: RegisterForm[K]
    ) {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationErrors = validate(form);
        setErrors(validationErrors);
        setFormError(null);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setIsSubmitting(true);

        try {
            await signUp({
                name: form.name.trim(),
                email: form.email.trim(),
                phone: onlyDigits(form.phone),
                password: form.password,
                acceptsTerms: form.acceptsTerms,
                acceptsMarketing: form.acceptsMarketing
            });

            navigate("/", { replace: true });
        } catch (error) {
            if (error instanceof ApiError && error.status === 409) {
                setErrors({ email: "Este e-mail já está cadastrado. Que tal entrar?" });
            } else if (error instanceof ApiError && error.status === 400) {
                setFormError(error.message);
            } else {
                setFormError(
                    "Não foi possível criar a conta agora. Tente novamente em instantes."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isAuthenticated && !isSubmitting) {
        return <Navigate to="/" replace />;
    }

    return (
        <section className="auth-page">
            <header>
                <span className="auth-eyebrow">Nova conta</span>

                <h1 className="auth-title">Crie sua conta</h1>
            </header>

            <form className="auth-form" noValidate onSubmit={handleSubmit}>
                {formError && <FormAlert>{formError}</FormAlert>}

                <TextField
                    label="Nome completo"
                    name="name"
                    placeholder="Ana Carolina Souza"
                    autoComplete="name"
                    value={form.name}
                    error={errors.name}
                    onChange={(event) => updateField("name", event.target.value)}
                />

                <div className="field-row">
                    <TextField
                        label="E-mail"
                        type="email"
                        name="email"
                        placeholder="ana@email.com"
                        autoComplete="email"
                        value={form.email}
                        error={errors.email}
                        onChange={(event) => updateField("email", event.target.value)}
                    />

                    <TextField
                        label="Celular (WhatsApp)"
                        type="tel"
                        name="phone"
                        placeholder="(15) 9 0000-0000"
                        autoComplete="tel-national"
                        inputMode="numeric"
                        value={form.phone}
                        error={errors.phone}
                        onChange={(event) =>
                            updateField("phone", formatPhone(event.target.value))
                        }
                    />
                </div>

                <PasswordField
                    label="Senha"
                    name="password"
                    placeholder="Crie uma senha"
                    autoComplete="new-password"
                    value={form.password}
                    error={errors.password}
                    onChange={(event) => updateField("password", event.target.value)}
                />

                <PasswordStrength password={form.password} />

                <PasswordField
                    label="Confirmar senha"
                    name="confirmPassword"
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    error={errors.confirmPassword}
                    onChange={(event) =>
                        updateField("confirmPassword", event.target.value)
                    }
                />

                <div className="auth-checkboxes">
                    <Checkbox
                        label="Li e aceito os termos de uso e a política de privacidade"
                        name="acceptsTerms"
                        checked={form.acceptsTerms}
                        error={errors.acceptsTerms}
                        onChange={(event) =>
                            updateField("acceptsTerms", event.target.checked)
                        }
                    />

                    <Checkbox
                        label="Quero receber novidades e datas especiais por e-mail"
                        name="acceptsMarketing"
                        checked={form.acceptsMarketing}
                        onChange={(event) =>
                            updateField("acceptsMarketing", event.target.checked)
                        }
                    />
                </div>

                <button
                    type="submit"
                    className="auth-button primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Criando conta..." : "Criar conta"}
                </button>
            </form>

            <p className="auth-switch">
                Já tem conta?{" "}
                <Link to="/entrar" className="auth-link">
                    Entrar
                </Link>
            </p>
        </section>
    );
}
