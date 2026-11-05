import Hero from "../../components/Hero/Hero";
import Benefits from "../../components/Benefits/Benefits";
import Catalog from "../../components/Catalog/Catalog";
import About from "../../components/About/About";
import Location from "../../components/Location/Location";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";

import type { Product } from "../../types/catalog";

interface HomeProps {
    onWhatsApp: () => void;
    onOpenProduct: (product: Product) => void;
    onAddToCart: (product: Product, quantity: number) => void;
}


export default function Home({
    onWhatsApp,
    onOpenProduct,
    onAddToCart
}: HomeProps) {
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