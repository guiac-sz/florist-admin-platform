import { Link } from "react-router";

export default function LoginPage() {
    return (
        <section>
            <h1>Entrar</h1>

            <p>
                Ainda não tem conta? <Link to="/criar-conta">Criar conta</Link>
            </p>
        </section>
    );
}