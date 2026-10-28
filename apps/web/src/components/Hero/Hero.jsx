import "./Hero.css";

export default function Hero({ onWhatsApp }) {
    return (
        <section className="hero-section" id="inicio">
            <div className="hero-content">
                <span className="section-eyebrow">
                    Flores para momentos inesquecíveis
                </span>

                <h1>
                    Um gesto simples.
                    <br />
                    Uma memória que fica.
                </h1>

                <p>
                    Buquês, arranjos, rosas e presentes preparados
                    com cuidado para surpreender alguém especial.
                </p>

                <div className="hero-actions">
                    <a href="#catalogo" className="primary-button">
                        Ver catálogo
                    </a>

                    <button
                        className="secondary-button"
                        onClick={onWhatsApp}
                    >
                        Falar com a florista
                    </button>
                </div>
            </div>

            <div className="hero-image">
                <div className="hero-note">
                    <strong>Entrega no mesmo dia</strong>

                    <span>
                        Consulte disponibilidade e região pelo WhatsApp.
                    </span>
                </div>
            </div>
        </section>
    );
}