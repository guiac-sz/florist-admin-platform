import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";

import TextField from "../../components/Form/TextField";
import PasswordField from "../../components/Form/PasswordField";
import Checkbox from "../../components/Form/Checkbox";
import FormAlert from "../../components/Form/FormAlert";
import { MessageIcon } from "../../components/Icons/Icons";
import { ApiError } from "../../services/api";
import { openWhatsApp } from "../../utils/whatsapp";
import { useAuth } from "../../hooks/useAuth";

interface LoginErrors {
    email?: string;
    password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(email: string, password: string): LoginErrors {
    const errors: LoginErrors = {};

    if (!email.trim()) {
        errors.email = "Informe seu e-mail.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
        errors.email = "Digite um e-mail válido, como nome@exemplo.com.";
    }

    if (!password) {
        errors.password = "Informe sua senha.";
    }

    return errors;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, signIn } = useAuth();

    const redirectTo =
        (location.state as { from?: string } | null)?.from ?? "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [errors, setErrors] = useState<LoginErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationErrors = validate(email, password);
        setErrors(validationErrors);
        setFormError(null);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setIsSubmitting(true);

        try {
            await signIn({ email: email.trim(), password }, remember);
            navigate(redirectTo, { replace: true });
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
                setFormError(
                    "E-mail ou senha incorretos. Confira os dados e tente de novo."
                );
                setPassword("");
            } else if (error instanceof ApiError && error.status === 429) {
                // Muitas tentativas seguidas: a API bloqueia por um minuto.
                setFormError("Muitas tentativas seguidas. Aguarde um minuto e tente de novo.");
            } else if (error instanceof ApiError && error.status === 400) {
                setFormError(error.message);
            } else {
                setFormError(
                    "Não foi possível entrar agora. Tente novamente em instantes."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isAuthenticated && !isSubmitting) {
        return <Navigate to={redirectTo} replace />;
    }

    return (
        <section className="auth-page">
            <header>
                <span className="auth-eyebrow">Minha conta</span>

                <h1 className="auth-title">Que bom te ver de novo</h1>

                <p className="auth-subtitle">
                    Entre para acompanhar seus pedidos e comprar mais rápido.
                </p>
            </header>

            <form className="auth-form" noValidate onSubmit={handleSubmit}>
                {formError && <FormAlert>{formError}</FormAlert>}

                <TextField
                    label="E-mail"
                    type="email"
                    name="email"
                    placeholder="seuemail@exemplo.com"
                    autoComplete="email"
                    value={email}
                    error={errors.email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                        setErrors((current) => ({ ...current, email: undefined }));
                    }}
                />

                <PasswordField
                    label="Senha"
                    name="password"
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    value={password}
                    error={errors.password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                        setErrors((current) => ({ ...current, password: undefined }));
                    }}
                />

                <div className="auth-options">
                    <Checkbox
                        label="Manter conectado"
                        name="remember"
                        checked={remember}
                        onChange={(event) => setRemember(event.target.checked)}
                    />

                    <Link to="/esqueci-senha" className="auth-link">
                        Esqueci minha senha
                    </Link>
                </div>

                <button
                    type="submit"
                    className="auth-button primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <div className="auth-divider">ou</div>

            <button
                type="button"
                className="auth-button outline"
                onClick={() =>
                    openWhatsApp("Olá! Quero fazer um pedido sem criar conta.")
                }
            >
                <MessageIcon size={16} />
                Comprar sem conta pelo WhatsApp
            </button>

            <p className="auth-switch">
                Ainda não tem conta?{" "}
                <Link to="/criar-conta" className="auth-link">
                    Criar conta
                </Link>
            </p>
        </section>
    );
}
