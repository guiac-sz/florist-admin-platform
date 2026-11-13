import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

import { useAuth } from "../../hooks/useAuth";

interface RequireAuthProps {
    children: ReactNode;
}

/** Páginas só para quem está logado (cliente ou admin). */
export default function RequireAuth({ children }: RequireAuthProps) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Depois do login, a pessoa volta para a página que tentou abrir.
        return <Navigate to="/entrar" replace state={{ from: location.pathname }} />;
    }

    return children;
}
