const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

export function formatPrice(value: number) {
    return currencyFormatter.format(value);
}