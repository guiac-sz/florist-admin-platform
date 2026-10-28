import { useState } from "react";

import products from "../../data/products";
import ProductCard from "../ProductCard/ProductCard";

import "./Catalog.css";

export default function Catalog({
    onOpenProduct,
    onAddToCart
}) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

    function normalizeText(text) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            category === "all" ||
            product.category === category;

        const searchableText = normalizeText(
            `${product.name} ${product.description} ${product.categoryLabel}`
        );

        const matchesSearch = searchableText.includes(
            normalizeText(search)
        );

        return matchesCategory && matchesSearch;
    });

    return (
        <section className="catalog-section" id="catalogo">
            <div className="catalog-header">
                <div>
                    <span className="section-eyebrow">
                        Catálogo completo
                    </span>

                    <h2>Encontre o presente ideal</h2>
                </div>

                <p>
                    Pesquise produtos, filtre por categoria e
                    escolha suas flores favoritas.
                </p>
            </div>

            <div className="catalog-toolbar">
                <input
                    type="search"
                    placeholder="Pesquisar buquê, rosas, cesta..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />

                <span>
                    {filteredProducts.length} produtos encontrados
                </span>
            </div>

            <div className="catalog-filters">
                <button
                    className={category === "all" ? "active" : ""}
                    onClick={() => setCategory("all")}
                >
                    Todos
                </button>

                <button
                    className={category === "bouquets" ? "active" : ""}
                    onClick={() => setCategory("bouquets")}
                >
                    Buquês
                </button>

                <button
                    className={
                        category === "arrangements"
                            ? "active"
                            : ""
                    }
                    onClick={() => setCategory("arrangements")}
                >
                    Arranjos
                </button>

                <button
                    className={category === "roses" ? "active" : ""}
                    onClick={() => setCategory("roses")}
                >
                    Rosas
                </button>

                <button
                    className={category === "baskets" ? "active" : ""}
                    onClick={() => setCategory("baskets")}
                >
                    Cestas
                </button>

                <button
                    className={category === "gifts" ? "active" : ""}
                    onClick={() => setCategory("gifts")}
                >
                    Presentes
                </button>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="product-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onOpenProduct={onOpenProduct}
                            onAddToCart={onAddToCart}
                        />
                    ))}
                </div>
            ) : (
                <div className="no-products">
                    Nenhum produto encontrado.
                </div>
            )}
        </section>
    );
}