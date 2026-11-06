import type { AuthResponse } from "../types/auth";

const STORAGE_KEY = "atelie-flora:session";

export type Session = AuthResponse;

function readFrom(storage: Storage): Session | null {
    try {
        const saved = storage.getItem(STORAGE_KEY);
        return saved ? (JSON.parse(saved) as Session) : null;
    } catch {
        return null;
    }
}

export function loadSession(): Session | null {
    return readFrom(localStorage) ?? readFrom(sessionStorage);
}

export function saveSession(session: Session, remember: boolean) {
    clearSession();

    const storage = remember ? localStorage : sessionStorage;

    try {
        storage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
        // Navegador sem armazenamento (ex.: modo privado restrito):
        // a sessão continua valendo só enquanto a página estiver aberta.
    }
}

export function clearSession() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        // Nada a limpar.
    }
}
