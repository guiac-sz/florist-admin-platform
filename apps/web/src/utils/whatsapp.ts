import { storeConfig } from "../config/storeConfig";

export function openWhatsApp(message: string) {
    const url = `https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
}

export function openSoldOutOrder(productName: string) {
    openWhatsApp(
        `Olá! Vi o produto "${productName}" no site e ele está esgotado. Vocês fazem por encomenda?`
    );
}