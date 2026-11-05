import { Link } from "react-router";

export default function NotFoundPage() {
    return (
        <main className="container py-5 text-center">
            <h1>Página não encontrada</h1>

            <p>O endereço que você acessou não existe ou foi removido.</p>

            <Link to="/">Voltar para a loja</Link>
        </main>
    );
}