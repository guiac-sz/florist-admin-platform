import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import {
    ChevronDownIcon,
    GridIcon,
    LogOutIcon,
    MapPinIcon,
    PackageIcon,
    UserIcon
} from "../Icons/Icons";
import { useAuth } from "../../hooks/useAuth";
import type { AuthUser } from "../../types/auth";
import { getFirstName, getInitials } from "../../utils/user";

import "./AccountMenu.css";

function getRoleLabel(user: AuthUser) {
    return user.role === "ADMIN" ? "Administração" : "Minha conta";
}

export default function AccountMenu() {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleClickOutside(event: MouseEvent) {
            if (!menuRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    if (!user) {
        return null;
    }

    const firstName = getFirstName(user.name);

    function closeMenu() {
        setIsOpen(false);
    }

    function handleSignOut() {
        closeMenu();
        signOut();
    }

    return (
        <div className="account-menu" ref={menuRef}>
            <button
                type="button"
                className="account-trigger"
                onClick={() => setIsOpen((current) => !current)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span className="account-avatar">{getInitials(user.name)}</span>

                <span className="account-trigger-text">
                    <strong>Olá, {firstName}</strong>
                    <small className={user.role === "ADMIN" ? "is-admin" : ""}>
                        {getRoleLabel(user)}
                    </small>
                </span>

                <ChevronDownIcon size={16} className="account-chevron" />
            </button>

            {isOpen && (
                <div className="account-dropdown">
                    <div className="account-dropdown-header">
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                    </div>

                    <nav className="account-dropdown-links">
                        {user.role === "ADMIN" && (
                            <Link to="/admin/produtos" onClick={closeMenu}>
                                <GridIcon size={16} />
                                Painel da loja
                            </Link>
                        )}

                        <Link to="/minha-conta/pedidos" onClick={closeMenu}>
                            <PackageIcon size={16} />
                            Meus pedidos
                        </Link>

                        <Link to="/minha-conta/dados" onClick={closeMenu}>
                            <UserIcon size={16} />
                            Meus dados
                        </Link>

                        <Link to="/minha-conta/enderecos" onClick={closeMenu}>
                            <MapPinIcon size={16} />
                            Endereços
                        </Link>

                        <button
                            type="button"
                            className="account-signout"
                            onClick={handleSignOut}
                        >
                            <LogOutIcon size={16} />
                            Sair
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
}
