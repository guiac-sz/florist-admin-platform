import { storeConfig } from "../../config/storeConfig";

import "./Location.css";

export default function Location() {
    return (
        <section className="location-section" id="localizacao">
            <div className="location-header">
                <div>
                    <span className="section-eyebrow">
                        Localização
                    </span>

                    <h2>Visite nossa loja</h2>
                </div>

                <p>
                    Consulte nossa localização, horários e região
                    de atendimento.
                </p>
            </div>

            <div className="location-grid">
                <div className="location-info">
                    <h3>{storeConfig.name}</h3>

                    <div>
                        <strong>📍 Endereço</strong>
                        <span>{storeConfig.address}</span>
                    </div>

                    <div>
                        <strong>🕐 Horário</strong>
                        <span>{storeConfig.openingHours}</span>
                    </div>

                    <div>
                        <strong>🛵 Entregas</strong>
                        <span>
                            Sorocaba e região, mediante consulta.
                        </span>
                    </div>
                </div>

                <div className="location-map">
                    <iframe
                        src={storeConfig.mapEmbedUrl}
                        title={`Localização ${storeConfig.name}`}
                        loading="lazy"
                        allowFullScreen
                    />
                </div>
            </div>
        </section>
    );
}