import { Link } from "react-router";

import { LockIcon } from "../../components/Icons/Icons";

export default function ForbiddenPage() {
    return (
        <main className="container py-5 text-center">
            <LockIcon size={40} />

            <h1 className="mt-3">Acesso restrito</h1>

            <p>Esta área é só para a administração da loja.</p>

            <Link to="/">Voltar para a loja</Link>
        </main>
    );
}
