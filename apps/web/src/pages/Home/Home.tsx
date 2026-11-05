import Hero from "../../components/Hero/Hero";
import Benefits from "../../components/Benefits/Benefits";
import Catalog from "../../components/Catalog/Catalog";
import About from "../../components/About/About";
import Location from "../../components/Location/Location";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";

import { useOutletContext } from "react-router";

import type { StoreOutletContext } from "../../layouts/StoreLayout";

export default function Home() {
    const { onWhatsApp, onOpenProduct, onAddToCart } =
        useOutletContext<StoreOutletContext>();

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