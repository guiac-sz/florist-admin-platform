export type PasswordLevel = "weak" | "fair" | "good" | "strong";

interface PasswordStrength {
    score: number;
    label: string;
    level: PasswordLevel;
}

export function isPasswordValid(password: string) {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

export function getPasswordStrength(password: string): PasswordStrength {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (/[A-Za-z]/.test(password) && /\d/.test(password)) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;

    if (!isPasswordValid(password)) {
        return { score: Math.min(score, 1), label: "Senha fraca", level: "weak" };
    }

    if (score <= 2) return { score, label: "Senha razoável", level: "fair" };
    if (score === 3) return { score, label: "Senha boa", level: "good" };

    return { score, label: "Senha forte", level: "strong" };
}
