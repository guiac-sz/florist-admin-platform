import { Link, NavLink, Outlet, useNavigate } from "react-router";

import {
    FlowerIcon,
    GridIcon,
    LogOutIcon,
    PackageIcon,
    StoreIcon,
    TagIcon
} from "../components/Icons/Icons";
import { storeConfig } from "../config/storeConfig";
import { useAuth } from "../hooks/useAuth";
import { getInitials } from "../utils/user";

import "./AdminLayout.css";

export default function AdminLayout() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    function handleSignOut() {
        signOut();
        navigate("/", { replace: true });
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <Link to="/admin/produtos" className="admin-brand">
                    <span className="admin-brand-mark">
                        <FlowerIcon size={18} />
                    </span>

                    <span>
                        <strong>{storeConfig.name}</strong>
                        <small>Painel da loja</small>
                    </span>
                </Link>

                <nav className="admin-nav">
                    <span className="admin-nav-item is-disabled">
                        <GridIcon size={18} />
                        Início
                        <em>em breve</em>
                    </span>

                    <span className="admin-nav-item is-disabled">
                        <PackageIcon size={18} />
                        Pedidos
                        <em>em breve</em>
                    </span>

                    <NavLink to="/admin/produtos" className="admin-nav-item">
                        <FlowerIcon size={18} />
                        Produtos e vitrine
                    </NavLink>

                    <NavLink to="/admin/categorias" className="admin-nav-item">
                        <TagIcon size={18} />
                        Categorias
                    </NavLink>
                </nav>

                <div className="admin-sidebar-footer">
                    <Link to="/" className="admin-store-link">
                        <StoreIcon size={18} />
                        Ver loja como cliente
                    </Link>

                    {user && (
                        <div className="admin-user">
                            <span className="admin-user-avatar">
                                {getInitials(user.name)}
                            </span>

                            <span className="admin-user-text">
                                <strong>{user.name}</strong>
                                <small>Administração</small>
                            </span>

                            <button
                                type="button"
                                className="admin-signout"
                                onClick={handleSignOut}
                                aria-label="Sair"
                                title="Sair"
                            >
                                <LogOutIcon size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}
