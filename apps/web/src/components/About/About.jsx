import "./About.css";

export default function About({ onWhatsApp }) {
    return (
        <section className="about-section" id="sobre">
            <div className="about-image" />

            <div className="about-content">
                <span className="section-eyebrow">
                    Nossa história
                </span>

                <h2>
                    Mais do que flores, criamos gestos de carinho.
                </h2>

                <p>
                    Aqui entraria a história verdadeira da
                    floricultura: há quanto tempo existe, quem está
                    por trás do negócio e o cuidado dedicado a cada
                    pedido.
                </p>

                <p>
                    Também podemos destacar entregas, encomendas
                    personalizadas, eventos e casamentos.
                </p>

                <button onClick={onWhatsApp}>
                    Falar conosco
                </button>
            </div>
        </section>
    );
}