import { storeConfig } from "../../config/storeConfig";

import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div>
                    <h3>{storeConfig.name}</h3>

                    <p>
                        Flores, presentes e pequenos gestos que
                        transformam momentos.
                    </p>
                </div>

                <div>
                    <strong>Navegação</strong>

                    <p>
                        Início
                        <br />
                        Catálogo
                        <br />
                        Sobre
                        <br />
                        Localização
                        <br />
                        Contato
                    </p>
                </div>

                <div>
                    <strong>Atendimento</strong>

                    <p>
                        {storeConfig.city}
                        <br />
                        WhatsApp
                        <br />
                        Instagram
                    </p>
                </div>
            </div>

            <div className="footer-bottom">
                <span>
                    © 2026 {storeConfig.name}
                </span>

                <span>Protótipo comercial</span>
            </div>
        </footer>
    );
}