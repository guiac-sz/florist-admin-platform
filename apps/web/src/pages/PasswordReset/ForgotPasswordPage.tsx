import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";

import FormAlert from "../../components/Form/FormAlert";
import TextField from "../../components/Form/TextField";
import { AlertCircleIcon, LockIcon, MailIcon } from "../../components/Icons/Icons";
import { ApiError } from "../../services/api";
import { forgotPassword } from "../../services/auth";

import "./PasswordReset.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_SECONDS = 60;

/** ana@email.com → a***@email.com (mostra para onde foi, sem expor tudo) */
function maskEmail(email: string) {
    const [name, domain] = email.split("@");
    return `${name.slice(0, 1)}***@${domain}`;
}

function formatCountdown(seconds: number) {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [sentTo, setSentTo] = useState<string | null>(null);
    const [secondsLeft, setSecondsLeft] = useState(0);

    // Contagem regressiva do "Reenviar": diminui 1 a cada segundo até chegar a 0.
    useEffect(() => {
        if (secondsLeft <= 0) {
            return;
        }

        const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000);
        return () => clearTimeout(timer);
    }, [secondsLeft]);

    async function send(address: string) {
        setIsSending(true);
        setFormError(null);

        try {
            await forgotPassword(address);
            setSentTo(address);
            setSecondsLeft(RESEND_SECONDS);
        } catch (error) {
            setFormError(
                error instanceof ApiError && error.status === 429
                    ? "Você pediu vários links seguidos. Aguarde alguns minutos e tente de novo."
                    : "Não foi possível enviar agora. Tente novamente em instantes."
            );
        } finally {
            setIsSending(false);
        }
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const address = email.trim().toLowerCase();

        if (!EMAIL_PATTERN.test(address)) {
            setEmailError("Digite um e-mail válido.");
            return;
        }

        void send(address);
    }

    // Segundo momento: "Confira seu e-mail".
    if (sentTo) {
        return (
            <section className="auth-page">
                <span className="reset-icon is-green">
                    <MailIcon size={20} />
                </span>

                <div>
                    <h1 className="auth-title">Confira seu e-mail</h1>
                    <p className="auth-subtitle">
                        Se existir uma conta com {maskEmail(sentTo)}, você vai receber um link
                        para criar uma nova senha. O link vale por 30 minutos.
                    </p>
                </div>

                <p className="reset-info">
                    <AlertCircleIcon size={16} />
                    Não encontrou? Olhe também a caixa de spam ou promoções.
                </p>

                {formError && <FormAlert>{formError}</FormAlert>}

                <Link to="/entrar" className="auth-button primary">
                    Voltar para o login
                </Link>

                <p className="auth-switch">
                    Não recebeu?{" "}
                    {secondsLeft > 0 ? (
                        <span className="reset-countdown">
                            Reenviar em {formatCountdown(secondsLeft)}
                        </span>
                    ) : (
                        <button
                            type="button"
                            className="reset-resend"
                            onClick={() => void send(sentTo)}
                            disabled={isSending}
                        >
                            {isSending ? "Reenviando..." : "Reenviar link"}
                        </button>
                    )}
                </p>
            </section>
        );
    }

    return (
        <section className="auth-page">
            <span className="reset-icon">
                <LockIcon size={20} />
            </span>

            <div>
                <h1 className="auth-title">Esqueceu a senha?</h1>
                <p className="auth-subtitle">
                    Sem problema. Digite o e-mail da sua conta e enviaremos um link para você
                    criar uma nova senha.
                </p>
            </div>

            <form className="auth-form" noValidate onSubmit={handleSubmit}>
                {formError && <FormAlert>{formError}</FormAlert>}

                <TextField
                    label="E-mail"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="voce@email.com"
                    value={email}
                    error={emailError ?? undefined}
                    onChange={(event) => {
                        setEmail(event.target.value);
                        setEmailError(null);
                    }}
                    autoFocus
                />

                <button type="submit" className="auth-button primary" disabled={isSending}>
                    {isSending ? "Enviando..." : "Enviar link de recuperação"}
                </button>
            </form>

            <p className="auth-switch">
                Lembrou?{" "}
                <Link to="/entrar" className="auth-link">
                    Voltar para o login
                </Link>
            </p>
        </section>
    );
}
