import { onlyDigits } from "./phone";

/** Formata enquanto digita: 000.000.000-00 */
export function formatCpf(value: string) {
    const digits = onlyDigits(value).slice(0, 11);

    return digits
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

/**
 * Mesma conta da API (dígitos verificadores). Aqui é só para avisar
 * na hora; quem decide de verdade é a API.
 */
export function isValidCpf(value: string) {
    const digits = onlyDigits(value);

    if (!/^\d{11}$/.test(digits) || /^(\d)\1{10}$/.test(digits)) {
        return false;
    }

    const numbers = digits.split("").map(Number);

    return [9, 10].every((position) => {
        let sum = 0;

        for (let index = 0; index < position; index++) {
            sum += numbers[index] * (position + 1 - index);
        }

        return ((sum * 10) % 11) % 10 === numbers[position];
    });
}
