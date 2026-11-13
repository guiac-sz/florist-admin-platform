import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";

import FormAlert from "../../components/Form/FormAlert";
import PasswordField from "../../components/Form/PasswordField";
import { CheckIcon, ClockIcon, LockIcon } from "../../components/Icons/Icons";
import { useAuth } from "../../hooks/useAuth";
import { ApiError } from "../../services/api";
import { checkResetToken, resetPassword } from "../../services/auth";

import "./PasswordReset.css";

type Status = "checking" | "invalid" | "form" | "done";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const { signOut } = useAuth();

    // Sem token na URL, nem precisa perguntar à API.
    const [status, setStatus] = useState<Status>(token ? "checking" : "invalid");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showErrors, setShowErrors] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Ao abrir, confere se o link ainda vale para já mostrar "Link expirado".
    useEffect(() => {
        if (!token) {
            return;
        }

        let ignore = false;

        checkResetToken(token)
            .then(() => {
                if (!ignore) setStatus("form");
            })
            .catch(() => {
                if (!ignore) setStatus("invalid");
            });

        return () => {
            ignore = true;
        };
    }, [token]);

    // Regras mostradas como lista de "check" (estado derivado: recalcula a cada letra).
    const rules = [
        { label: "Pelo menos 8 caracteres", ok: password.length >= 8 },
        { label: "Letras e números", ok: /[A-Za-z]/.test(password) && /\d/.test(password) },
        {
            label: "As duas senhas são iguais",
            ok: password.length > 0 && password === confirmPassword
        }
    ];
    const isValid = rules.every((rule) => rule.ok);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setShowErrors(true);
        setFormError(null);

        if (!isValid) {
            return;
        }

        setIsSaving(true);

        try {
            await resetPassword(token, password);

            // Todas as sessões antigas foram encerradas, inclusive uma que
            // estivesse aberta neste navegador.
            signOut();
            setStatus("done");
        } catch (error) {
            if (error instanceof ApiError && error.status === 400 && error.message.includes("link")) {
                setStatus("invalid");
            } else {
                setFormError(
                    error instanceof ApiError
                        ? error.message
                        : "Não foi possível salvar agora. Tente novamente."
                );
            }
        } finally {
            setIsSaving(false);
        }
    }

    if (status === "checking") {
        return <p className="auth-subtitle">Conferindo o link...</p>;
    }

    if (status === "invalid") {
        return (
            <section className="auth-page">
                <span className="reset-icon is-amber">
                    <ClockIcon size={20} />
                </span>

                <div>
                    <h1 className="auth-title">Este link expirou</h1>
                    <p className="auth-subtitle">
                        Links de recuperação valem por 30 minutos e só podem ser usados uma
                        vez. Peça um novo para continuar.
                    </p>
                </div>

                <Link to="/esqueci-senha" className="auth-button primary">
                    Enviar novo link
                </Link>

                <p className="auth-switch">
                    Lembrou a senha?{" "}
                    <Link to="/entrar" className="auth-link">
                        Voltar para o login
                    </Link>
                </p>
            </section>
        );
    }

    if (status === "done") {
        return (
            <section className="auth-page">
                <span className="reset-icon is-green">
                    <CheckIcon size={20} />
                </span>

                <div>
                    <h1 className="auth-title">Senha alterada!</h1>
                    <p className="auth-subtitle">
                        Pronto, sua nova senha já está valendo. Por segurança, encerramos as
                        sessões abertas em outros aparelhos.
                    </p>
                </div>

                <Link to="/entrar" className="auth-button primary">
                    Entrar com a nova senha
                </Link>
            </section>
        );
    }

    return (
        <section className="auth-page">
            <span className="reset-icon">
                <LockIcon size={20} />
            </span>

            <div>
                <h1 className="auth-title">Crie uma nova senha</h1>
                <p className="auth-subtitle">Escolha uma senha que você não usa em outros sites.</p>
            </div>

            <form className="auth-form" noValidate onSubmit={handleSubmit}>
                {formError && <FormAlert>{formError}</FormAlert>}

                <PasswordField
                    label="Nova senha"
                    name="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoFocus
                />

                <PasswordField
                    label="Confirmar nova senha"
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                />

                <ul className="reset-rules" aria-live="polite">
                    {rules.map((rule) => (
                        <li
                            key={rule.label}
                            className={rule.ok ? "is-ok" : showErrors ? "is-error" : ""}
                        >
                            <CheckIcon size={14} />
                            {rule.label}
                        </li>
                    ))}
                </ul>

                <button type="submit" className="auth-button primary" disabled={isSaving}>
                    {isSaving ? "Salvando..." : "Salvar nova senha"}
                </button>
            </form>
        </section>
    );
}
