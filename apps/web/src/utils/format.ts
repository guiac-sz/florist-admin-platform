const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

export function formatPrice(value: number) {
    return currencyFormatter.format(value);
}
const relativeFormatter = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

/** "agora há pouco", "há 3 horas", "ontem", "há 2 dias"... */
export function formatRelativeDate(isoDate: string) {
    const diffMinutes = Math.round((Date.now() - new Date(isoDate).getTime()) / 60000);

    if (diffMinutes < 1) return "agora há pouco";
    if (diffMinutes < 60) return relativeFormatter.format(-diffMinutes, "minute");

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return relativeFormatter.format(-diffHours, "hour");

    return relativeFormatter.format(-Math.round(diffHours / 24), "day");
}

/** Campo de preço: o que a pessoa digita vira centavos ("14990" → 14990 centavos). */
export function parsePriceInput(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    return digits ? Number(digits) : 0;
}
