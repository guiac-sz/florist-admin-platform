import { storeConfig } from "../../config/storeConfig";

import "./Contact.css";

export default function Contact() {
    const whatsappUrl = `https://wa.me/${storeConfig.whatsapp}`;

    return (
        <section className="contact-section" id="contato">
            <div className="contact-header">
                <span className="section-eyebrow">
                    Contato
                </span>

                <h2>Estamos perto de você</h2>

                <p>
                    Tire dúvidas, acompanhe novidades ou faça seu
                    pedido diretamente com a floricultura.
                </p>
            </div>

            <div className="contact-grid">
                <div className="contact-card">
                    <strong>📍 Onde estamos</strong>
                    <span>{storeConfig.address}</span>
                </div>

                <div className="contact-card">
                    <strong>🕐 Atendimento</strong>
                    <span>{storeConfig.openingHours}</span>
                </div>

                <div className="contact-card">
                    <strong>💬 Redes e pedidos</strong>

                    <div className="social-links">
                        <a
                            href={storeConfig.instagramUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            ◎ Instagram
                        </a>

                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            ◉ WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}