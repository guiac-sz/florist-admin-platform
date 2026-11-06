import { useEffect, useState } from "react";
import { Link } from "react-router";

import AccountMenu from "../AccountMenu/AccountMenu";
import { BagIcon, FlowerIcon, MenuIcon, UserIcon } from "../Icons/Icons";
import { storeConfig } from "../../config/storeConfig";
import { useAuth } from "../../hooks/useAuth";

import "./Header.css";

interface HeaderProps {
    cartItemCount: number;
    onOpenCart: () => void;
}

export default function Header({
    cartItemCount,
    onOpenCart
}: HeaderProps) {
    const { isAuthenticated } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("inicio");

    useEffect(() => {
        const sectionIds = [
            "inicio",
            "catalogo",
            "sobre",
            "localizacao",
            "contato"
        ];

        function handleScroll() {
            const scrollPosition = window.scrollY + 180;

            let currentSection = "inicio";

            sectionIds.forEach((sectionId) => {
                const section =
                    document.getElementById(sectionId);

                if (
                    section &&
                    scrollPosition >= section.offsetTop
                ) {
                    currentSection = sectionId;
                }
            });

            setActiveSection(currentSection);
        }

        handleScroll();

        window.addEventListener("scroll", handleScroll, {
            passive: true
        });

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, []);

    function closeMenu() {
        setIsMenuOpen(false);
    }

    function getLinkClass(section: string) {
        return activeSection === section ? "active" : "";
    }

    return (
        <>
            <div className="top-bar">
                Entrega em Sorocaba • Compre pelo site ou pelo WhatsApp •
                Flores frescas todos os dias
            </div>

            <header className="main-header">
                <a
                    href="#inicio"
                    className="brand"
                    onClick={closeMenu}
                >
                    <div className="brand-mark">
                        <FlowerIcon size={18} />
                    </div>
                    <strong>{storeConfig.name}</strong>
                </a>

                <nav
                    className={`main-nav ${
                        isMenuOpen ? "open" : ""
                    }`}
                >
                    <a
                        href="#inicio"
                        className={getLinkClass("inicio")}
                        onClick={closeMenu}
                    >
                        Início
                    </a>

                    <a
                        href="#catalogo"
                        className={getLinkClass("catalogo")}
                        onClick={closeMenu}
                    >
                        Catálogo
                    </a>

                    <a
                        href="#sobre"
                        className={getLinkClass("sobre")}
                        onClick={closeMenu}
                    >
                        Sobre
                    </a>

                    <a
                        href="#localizacao"
                        className={getLinkClass(
                            "localizacao"
                        )}
                        onClick={closeMenu}
                    >
                        Localização
                    </a>

                    <a
                        href="#contato"
                        className={getLinkClass("contato")}
                        onClick={closeMenu}
                    >
                        Contato
                    </a>
                </nav>

                <div className="header-actions">
                    {!isAuthenticated && (
                        <Link to="/entrar" className="header-login-link">
                            <UserIcon size={18} />
                            Entrar
                        </Link>
                    )}

                    <button
                        className="header-cart-button"
                        type="button"
                        onClick={onOpenCart}
                        aria-label="Abrir carrinho"
                    >
                        <BagIcon size={18} />

                        <span className="cart-text">Carrinho</span>

                        {cartItemCount > 0 && (
                            <span className="cart-badge">{cartItemCount}</span>
                        )}
                    </button>

                    {isAuthenticated && <AccountMenu />}

                    <button
                        className="mobile-menu-button"
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Abrir menu"
                        aria-expanded={isMenuOpen}
                    >
                        <MenuIcon size={24} />
                    </button>
                </div>
            </header>
        </>
    );
}