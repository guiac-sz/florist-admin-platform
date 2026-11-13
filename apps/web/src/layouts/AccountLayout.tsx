import { startTransition } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";

import {
    LockIcon,
    LogOutIcon,
    MapPinIcon,
    PackageIcon,
    UserIcon
} from "../components/Icons/Icons";
import { useAuth } from "../hooks/useAuth";
import { getInitials } from "../utils/user";

import "./AccountLayout.css";

/**
 * Área "Minha conta": menu lateral fixo e a página escolhida ao lado.
 * Fica dentro do StoreLayout, então o cabeçalho e o rodapé da loja continuam.
 */
export default function AccountLayout() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    // O RequireAuth já garante que existe alguém logado.
    if (!user) {
        return null;
    }

    function handleSignOut() {
        // O React Router faz a troca de página dentro de uma "transição".
        // Colocando o logout na mesma transição, as duas coisas acontecem
        // juntas; sem isso, o RequireAuth veria o logout antes da troca de
        // página e mandaria a pessoa para "/entrar" em vez da loja.
        startTransition(() => {
            navigate("/", { replace: true });
            signOut();
        });
    }

    return (
        <div className="account-layout">
            <aside className="account-sidebar">
                <div className="account-profile">
                    <span className="account-profile-avatar">{getInitials(user.name)}</span>

                    <div>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                    </div>
                </div>

                <nav className="account-nav" aria-label="Minha conta">
                    <span className="account-nav-item is-disabled">
                        <PackageIcon size={18} />
                        Meus pedidos
                        <em>em breve</em>
                    </span>

                    <NavLink to="/minha-conta/dados" className="account-nav-item">
                        <UserIcon size={18} />
                        Meus dados
                    </NavLink>

                    <NavLink to="/minha-conta/enderecos" className="account-nav-item">
                        <MapPinIcon size={18} />
                        Endereços
                    </NavLink>

                    <NavLink to="/minha-conta/seguranca" className="account-nav-item">
                        <LockIcon size={18} />
                        Senha e segurança
                    </NavLink>

                    <button
                        type="button"
                        className="account-nav-item is-signout"
                        onClick={handleSignOut}
                    >
                        <LogOutIcon size={18} />
                        Sair da conta
                    </button>
                </nav>
            </aside>

            <main className="account-content">
                <Outlet />
            </main>
        </div>
    );
}
