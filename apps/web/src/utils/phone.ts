export function onlyDigits(value: string) {
    return value.replace(/\D/g, "");
}

/** Formata enquanto digita: (15) 99123-4567 */
export function formatPhone(value: string) {
    const digits = onlyDigits(value).slice(0, 11);

    if (digits.length <= 2) {
        return digits.length ? `(${digits}` : "";
    }

    const ddd = digits.slice(0, 2);
    const number = digits.slice(2);

    if (number.length <= 4) {
        return `(${ddd}) ${number}`;
    }

    const splitAt = number.length === 9 ? 5 : 4;

    return `(${ddd}) ${number.slice(0, splitAt)}-${number.slice(splitAt)}`;
}
