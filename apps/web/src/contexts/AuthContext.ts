import { createContext } from "react";

import type { AuthUser, LoginRequest } from "../types/auth";

export interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    signIn: (credentials: LoginRequest, remember: boolean) => Promise<void>;
    signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
