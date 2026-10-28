import { useEffect, useState } from "react";
import { storeConfig } from "../../config/storeConfig";
import "./Header.css";

export default function Header({
    cartItemCount,
    onOpenCart
}) {
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

    function handleWhatsApp() {
        const message = encodeURIComponent(
            "Olá! Vim pelo site e gostaria de fazer um pedido."
        );

        window.open(
            `https://wa.me/${storeConfig.whatsapp}?text=${message}`,
            "_blank"
        );
    }

    function closeMenu() {
        setIsMenuOpen(false);
    }

    function getLinkClass(section) {
        return activeSection === section ? "active" : "";
    }

    return (
        <>
            <div className="top-bar">
                Entrega em Sorocaba • Pedidos pelo WhatsApp •
                Flores frescas todos os dias
            </div>

            <header className="main-header">
                <a
                    href="#inicio"
                    className="brand"
                    onClick={closeMenu}
                >
                    <div className="brand-mark">❀</div>
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
                    <button
                        className="header-cart-button"
                        type="button"
                        onClick={onOpenCart}
                        aria-label="Abrir carrinho"
                    >
                        <span className="cart-icon">
                            🛒
                        </span>

                        <span className="cart-text">
                            Carrinho
                        </span>

                        {cartItemCount > 0 && (
                            <span className="cart-badge">
                                {cartItemCount}
                            </span>
                        )}
                    </button>

                    <button
                        className="header-whatsapp-button"
                        type="button"
                        onClick={handleWhatsApp}
                    >
                        Pedir pelo WhatsApp
                    </button>

                    <button
                        className="mobile-menu-button"
                        type="button"
                        onClick={() =>
                            setIsMenuOpen(!isMenuOpen)
                        }
                        aria-label="Abrir menu"
                        aria-expanded={isMenuOpen}
                    >
                        ☰
                    </button>
                </div>
            </header>
        </>
    );
}