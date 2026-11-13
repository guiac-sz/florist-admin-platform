import { createContext } from "react";

import type { AuthUser, LoginRequest, RegisterRequest } from "../types/auth";

export interface AuthContextValue {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    signIn: (credentials: LoginRequest, remember: boolean) => Promise<void>;
    signUp: (data: RegisterRequest) => Promise<void>;
    signOut: () => void;
    updateUser: (user: AuthUser) => void;
    updateToken: (accessToken: string) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
