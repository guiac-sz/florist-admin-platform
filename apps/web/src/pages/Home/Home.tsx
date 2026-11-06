import Hero from "../../components/Hero/Hero";
import Benefits from "../../components/Benefits/Benefits";
import Catalog from "../../components/Catalog/Catalog";
import AdminCatalog from "../../components/AdminCatalog/AdminCatalog";
import About from "../../components/About/About";
import Location from "../../components/Location/Location";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Footer/Footer";

import { useOutletContext } from "react-router";

import type { StoreOutletContext } from "../../layouts/StoreLayout";

export default function Home() {
    const { onWhatsApp, onOpenProduct, onAddToCart, isAdminEditing } =
        useOutletContext<StoreOutletContext>();

    return (
        <>
            <main>
                <Hero onWhatsApp={onWhatsApp} />

                <Benefits />

                {/* A administração vê a vitrine editável; clientes, o catálogo normal. */}
                {isAdminEditing ? (
                    <AdminCatalog onOpenProduct={onOpenProduct} />
                ) : (
                    <Catalog onOpenProduct={onOpenProduct} onAddToCart={onAddToCart} />
                )}

                <About onWhatsApp={onWhatsApp} />

                <Location />

                <Contact />
            </main>

            <Footer />
        </>
    );
}