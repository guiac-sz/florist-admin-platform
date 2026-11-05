import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";

import { ArrowLeftIcon, FlowerIcon } from "../components/Icons/Icons";
import { storeConfig } from "../config/storeConfig";

import "./AuthLayout.css";

const SLIDE_DURATION = 5000;

const slides = [
    "photo-1561181286-d3fee7d55364",
    "photo-1518621736915-f3b1c41bfd00",
    "photo-1519378058457-4c29a0a2efac",
    "photo-1563241527-3004b7be0ffd"
].map(
    (photoId) =>
        `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1200&q=80`
);

export default function AuthLayout() {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, SLIDE_DURATION);

        return () => clearTimeout(timeoutId);
    }, [activeSlide]);

    return (
        <div className="auth-layout">
            <aside className="auth-aside">
                <div className="auth-slides" aria-hidden="true">
                    {slides.map((src, index) => (
                        <img
                            key={src}
                            src={src}
                            alt=""
                            className={`auth-slide ${index === activeSlide ? "active" : ""}`}
                        />
                    ))}
                </div>

                <Link to="/" className="auth-brand">
                    <span className="auth-brand-mark">
                        <FlowerIcon size={18} />
                    </span>

                    {storeConfig.name}
                </Link>

                <div className="auth-aside-footer">
                    <figure className="auth-quote">
                        <blockquote>
                            “Um gesto simples. Uma memória que fica.”
                        </blockquote>

                        <figcaption>
                            Flores frescas todos os dias · Entrega em Sorocaba
                        </figcaption>
                    </figure>

                    <div className="auth-dots">
                        {slides.map((src, index) => (
                            <button
                                key={src}
                                type="button"
                                className={`auth-dot ${index === activeSlide ? "active" : ""}`}
                                onClick={() => setActiveSlide(index)}
                                aria-label={`Mostrar foto ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
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