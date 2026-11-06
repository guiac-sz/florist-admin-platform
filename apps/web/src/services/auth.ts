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
