import { ApiError } from "./api";
import type { AuthResponse, LoginRequest } from "../types/auth";

/*
 * Respostas SIMULADAS enquanto a API de autenticação não existe.
 * Na etapa 5, o corpo destas funções vira uma chamada real à API,
 * mantendo os mesmos tipos de entrada e saída.
 */

const MOCK_DELAY = 800;

const MOCK_ACCOUNT = {
    email: "ana@email.com",
    password: "flores123"
};

function wait(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function login({
    email,
    password
}: LoginRequest): Promise<AuthResponse> {
    await wait(MOCK_DELAY);

    const isValid =
        email.toLowerCase() === MOCK_ACCOUNT.email &&
        password === MOCK_ACCOUNT.password;

    if (!isValid) {
        throw new ApiError(401, "E-mail ou senha incorretos.");
    }

    return {
        accessToken: "token-simulado",
        user: {
            id: 1,
            name: "Ana Carolina Souza",
            email: MOCK_ACCOUNT.email,
            phone: "15990000000",
            role: "CUSTOMER"
        }
    };
}
