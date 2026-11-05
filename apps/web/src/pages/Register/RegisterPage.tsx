import { Link } from "react-router";

export default function RegisterPage() {
    return (
        <section>
            <h1>Criar conta</h1>

            <p>
                Já tem conta? <Link to="/entrar">Entrar</Link>
            </p>
        </section>
    );
}