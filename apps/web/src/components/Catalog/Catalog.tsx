import { useEffect, useState } from "react";

import ProductCard from "../ProductCard/ProductCard";
import { getCategories, getProducts } from "../../services/api";
import type { Category, Product } from "../../types/catalog";

import "./Catalog.css";

const ALL_CATEGORIES = "all";

interface CatalogProps {
    onOpenProduct: (product: Product) => void;
    onAddToCart: (product: Product, quantity: number) => void;
}

export default function Catalog({
    onOpenProduct,
    onAddToCart
}: CatalogProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState(ALL_CATEGORIES);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [search]);

    useEffect(() => {
        let ignore = false;

        setIsLoading(true);
        setError(null);

        getProducts({
            category: category === ALL_CATEGORIES ? undefined : category,
            search: debouncedSearch || undefined
        })
            .then((data) => {
                if (!ignore) setProducts(data);
            })
            .catch(() => {
                if (!ignore) {
                    setError(
                        "Não foi possível carregar os produtos. Tente novamente em instantes."
                    );
                }
            })
            .finally(() => {
                if (!ignore) setIsLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [category, debouncedSearch]);

    function renderContent() {
        if (error) {
            return <div className="no-products">{error}</div>;
        }

        if (isLoading && products.length === 0) {
            return <div className="no-products">Carregando produtos...</div>;
        }

        if (products.length === 0) {
            return <div className="no-products">Nenhum produto encontrado.</div>;
        }

        return (
            <div className="product-grid">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onOpenProduct={onOpenProduct}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>
        );
    }

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
                    onChange={(event) => setSearch(event.target.value)}
                />

                <span>
                    {isLoading
                        ? "Carregando..."
                        : `${products.length} produtos encontrados`}
                </span>
            </div>

            <div className="catalog-filters">
                <button
                    type="button"
                    className={category === ALL_CATEGORIES ? "active" : ""}
                    onClick={() => setCategory(ALL_CATEGORIES)}
                >
                    Todos
                </button>

                {categories.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={category === item.slug ? "active" : ""}
                        onClick={() => setCategory(item.slug)}
                    >
                        {item.name}
                    </button>
                ))}
            </div>

            {renderContent()}
        </section>
    );
}