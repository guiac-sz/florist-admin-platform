export type UserRole = "CUSTOMER" | "ADMIN";

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: UserRole;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    user: AuthUser;
}
