export type UserRole = "CUSTOMER" | "ADMIN";

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    cpf: string | null;
    acceptsMarketing: boolean;
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

export interface RegisterRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
    acceptsTerms: boolean;
    acceptsMarketing: boolean;
}

export interface UpdateProfileRequest {
    name: string;
    email: string;
    phone: string;
    cpf: string | null;
    acceptsMarketing: boolean;
    // Só é enviada quando o e-mail muda.
    currentPassword?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
