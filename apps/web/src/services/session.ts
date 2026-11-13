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

/**
 * Atualiza parte da sessão salva (o usuário depois de editar "Meus dados",
 * ou o token depois de trocar a senha), mantendo o mesmo lugar:
 * localStorage ou sessionStorage.
 */
export function updateStoredSession(changes: Partial<Session>) {
    for (const storage of [localStorage, sessionStorage]) {
        const saved = readFrom(storage);

        if (saved) {
            try {
                storage.setItem(STORAGE_KEY, JSON.stringify({ ...saved, ...changes }));
            } catch {
                // Sem armazenamento: vale só enquanto a página estiver aberta.
            }

            return;
        }
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
