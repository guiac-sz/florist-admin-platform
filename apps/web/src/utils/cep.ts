import type { Address } from "../types/address";
import { onlyDigits } from "./phone";

/** 18030000 → 18030-000 */
export function formatCep(value: string) {
    return onlyDigits(value)
        .slice(0, 8)
        .replace(/^(\d{5})(\d)/, "$1-$2");
}

export interface CepResult {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
}

interface ViaCepResponse {
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
    erro?: boolean | string;
}

/**
 * Busca a rua, o bairro e a cidade pelo CEP no ViaCEP (serviço gratuito).
 * Devolve null se o CEP não existir ou se o serviço não responder:
 * nesse caso a pessoa preenche à mão, sem travar o cadastro.
 */
export async function fetchAddressByCep(cep: string): Promise<CepResult | null> {
    const digits = onlyDigits(cep);

    if (digits.length !== 8) {
        return null;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);

        if (!response.ok) {
            return null;
        }

        const data = (await response.json()) as ViaCepResponse;

        if (data.erro) {
            return null;
        }

        return {
            street: data.logradouro ?? "",
            neighborhood: data.bairro ?? "",
            city: data.localidade ?? "",
            state: data.uf ?? ""
        };
    } catch {
        return null;
    }
}

/** "Rua das Hortênsias, 210, ap. 32 — Jd. Vergueiro, Sorocaba/SP — 18030-000" */
export function formatAddressLine(address: Address) {
    const street = [address.street, address.number, address.complement]
        .filter(Boolean)
        .join(", ");

    return `${street} — ${address.neighborhood}, ${address.city}/${address.state} — ${formatCep(address.zipCode)}`;
}

export const BRAZILIAN_STATES = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
    "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
    "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];
