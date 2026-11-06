import { useEffect, useState, type ReactNode } from "react";

import { AuthContext, type AuthContextValue } from "./AuthContext";
import { ApiError } from "../services/api";
import { getMe, login, register } from "../services/auth";
import {
    clearSession,
    loadSession,
    saveSession,
    type Session
} from "../services/session";
import type { LoginRequest, RegisterRequest } from "../types/auth";

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [session, setSession] = useState<Session | null>(() => loadSession());

    // Ao abrir o site, confere com a API se o token salvo ainda vale.
    useEffect(() => {
        const stored = loadSession();

        if (!stored) {
            return;
        }

        let ignore = false;

        getMe(stored.accessToken)
            .then((user) => {
                if (!ignore) {
                    setSession((current) => (current ? { ...current, user } : current));
                }
            })
            .catch((error) => {
                if (!ignore && error instanceof ApiError && error.status === 401) {
                    clearSession();
                    setSession(null);
                }
            });

        return () => {
            ignore = true;
        };
    }, []);

    async function signIn(credentials: LoginRequest, remember: boolean) {
        const response = await login(credentials);

        saveSession(response, remember);
        setSession(response);
    }

    async function signUp(data: RegisterRequest) {
        const response = await register(data);

        saveSession(response, true);
        setSession(response);
    }

    function signOut() {
        clearSession();
        setSession(null);
    }

    const value: AuthContextValue = {
        user: session?.user ?? null,
        token: session?.accessToken ?? null,
        isAuthenticated: session !== null,
        signIn,
        signUp,
        signOut
    };

    return <AuthContext value={value}>{children}</AuthContext>;
}
