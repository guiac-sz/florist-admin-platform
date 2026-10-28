import Hero from "../../components/Hero/Hero";
import Benefits from "../../components/Benefits/Benefits";
import Catalog from "../../components/Catalog/Catalog";
import About from "../../components/About/About";
import Location from "../../components/Location/Location";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";

export default function Home({
    onWhatsApp,
    onOpenProduct,
    onAddToCart
}) {
    return (
        <>
            <main>
                <Hero onWhatsApp={onWhatsApp} />

                <Benefits />

                <Catalog
                    onOpenProduct={onOpenProduct}
                    onAddToCart={onAddToCart}
                />

                <About onWhatsApp={onWhatsApp} />

                <Location />

                <Contact />
            </main>

            <Footer />
        </>
    );
}