import { Link, Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <main className="container py-5">
            <Link to="/">← Voltar para a loja</Link>

            <Outlet />
        </main>
    );
}