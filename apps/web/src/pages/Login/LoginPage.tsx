import { Link } from "react-router";

import TextField from "../../components/Form/TextField";
import PasswordField from "../../components/Form/PasswordField";
import Checkbox from "../../components/Form/Checkbox";
import { MessageIcon } from "../../components/Icons/Icons";
import { openWhatsApp } from "../../utils/whatsapp";

export default function LoginPage() {
    return (
        <section className="auth-page">
            <header>
                <span className="auth-eyebrow">Minha conta</span>

                <h1 className="auth-title">Que bom te ver de novo</h1>

                <p className="auth-subtitle">
                    Entre para acompanhar seus pedidos e comprar mais rápido.
                </p>
            </header>

            <form
                className="auth-form"
                noValidate
                onSubmit={(event) => event.preventDefault()}
            >
                <TextField
                    label="E-mail"
                    type="email"
                    name="email"
                    placeholder="seuemail@exemplo.com"
                    autoComplete="email"
                />

                <PasswordField
                    label="Senha"
                    name="password"
                    placeholder="Sua senha"
                    autoComplete="current-password"
                />

                <div className="auth-options">
                    <Checkbox
                        label="Manter conectado"
                        name="remember"
                        defaultChecked
                    />

                    <Link to="/esqueci-senha" className="auth-link">
                        Esqueci minha senha
                    </Link>
                </div>

                <button type="submit" className="auth-button primary">
                    Entrar
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