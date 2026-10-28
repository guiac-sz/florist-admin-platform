import "./Benefits.css";

export default function Benefits() {
    return (
        <section className="benefits">
            <div className="benefit">
                <span>✿</span>

                <div>
                    <strong>Flores selecionadas</strong>
                    <p>Arranjos preparados sob encomenda.</p>
                </div>
            </div>

            <div className="benefit">
                <span>⌂</span>

                <div>
                    <strong>Entrega em Sorocaba</strong>
                    <p>Receba em casa ou envie de presente.</p>
                </div>
            </div>

            <div className="benefit">
                <span>♡</span>

                <div>
                    <strong>Atendimento humano</strong>
                    <p>
                        Monte seu pedido e finalize pelo WhatsApp.
                    </p>
                </div>
            </div>
        </section>
    );
}