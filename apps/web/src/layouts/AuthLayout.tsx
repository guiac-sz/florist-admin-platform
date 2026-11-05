import { Link, Outlet, useLocation } from "react-router";

import { ArrowLeftIcon, FlowerIcon } from "../components/Icons/Icons";
import { storeConfig } from "../config/storeConfig";

import "./AuthLayout.css";

export default function AuthLayout() {
    const { pathname } = useLocation();
    const asideTone = pathname === "/criar-conta" ? "lilac" : "rose";

    return (
        <div className="auth-layout">
            <aside className={`auth-aside ${asideTone}`}>
                <Link to="/" className="auth-brand">
                    <span className="auth-brand-mark">
                        <FlowerIcon size={18} />
                    </span>

                    {storeConfig.name}
                </Link>

                <FlowerIcon size={104} className="auth-aside-flower" />

                <figure className="auth-quote">
                    <blockquote>
                        “Um gesto simples. Uma memória que fica.”
                    </blockquote>

                    <figcaption>
                        Flores frescas todos os dias · Entrega em Sorocaba
                    </figcaption>
                </figure>
            </aside>

            <main className="auth-main">
                <Link to="/" className="auth-back">
                    <ArrowLeftIcon size={14} />
                    Voltar para a loja
                </Link>

                <div className="auth-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}