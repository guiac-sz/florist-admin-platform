import { request } from "./api";
import type {
    AuthResponse,
    AuthUser,
    LoginRequest,
    RegisterRequest
} from "../types/auth";

export function login(data: LoginRequest) {
    return request<AuthResponse>("/auth/login", { method: "POST", body: data });
}

export function register(data: RegisterRequest) {
    return request<AuthResponse>("/auth/register", { method: "POST", body: data });
}

export function getMe(token: string) {
    return request<AuthUser>("/auth/me", { token });
}

/** Envia o link de nova senha (responde igual exista a conta ou não). */
export function forgotPassword(email: string) {
    return request<void>("/auth/forgot-password", { method: "POST", body: { email } });
}

/** Confere se o link do e-mail ainda vale. */
export function checkResetToken(token: string) {
    return request<void>("/auth/reset-password/check", { method: "POST", body: { token } });
}

export function resetPassword(token: string, password: string) {
    return request<void>("/auth/reset-password", {
        method: "POST",
        body: { token, password }
    });
}
