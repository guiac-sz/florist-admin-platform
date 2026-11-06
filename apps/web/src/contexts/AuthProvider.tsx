import { useState, type ReactNode } from "react";

import { AuthContext, type AuthContextValue } from "./AuthContext";
import { login } from "../services/auth";
import {
    clearSession,
    loadSession,
    saveSession,
    type Session
} from "../services/session";
import type { LoginRequest } from "../types/auth";

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [session, setSession] = useState<Session | null>(() => loadSession());

    async function signIn(credentials: LoginRequest, remember: boolean) {
        const response = await login(credentials);

        saveSession(response, remember);
        setSession(response);
    }

    function signOut() {
        clearSession();
        setSession(null);
    }

    const value: AuthContextValue = {
        user: session?.user ?? null,
        isAuthenticated: session !== null,
        signIn,
        signOut
    };

    return <AuthContext value={value}>{children}</AuthContext>;
}
