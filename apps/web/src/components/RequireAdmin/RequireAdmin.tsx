import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

import ForbiddenPage from "../../pages/Forbidden/ForbiddenPage";
import { useAuth } from "../../hooks/useAuth";

interface RequireAdminProps {
    children: ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/entrar" replace state={{ from: location.pathname }} />;
    }

    if (user?.role !== "ADMIN") {
        return <ForbiddenPage />;
    }

    return children;
}
