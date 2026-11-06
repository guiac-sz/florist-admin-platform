import { getPasswordStrength } from "../../utils/password";

import "./Form.css";

interface PasswordStrengthProps {
    password: string;
}

const HINT = "mínimo de 8 caracteres, com letras e números";

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    if (!password) {
        return <p className="password-hint">Use no {HINT}.</p>;
    }

    const { score, label, level } = getPasswordStrength(password);

    return (
        <div className={`password-strength ${level}`}>
            <div className="password-strength-bars" aria-hidden="true">
                {[1, 2, 3, 4].map((bar) => (
                    <span key={bar} className={bar <= score ? "filled" : ""} />
                ))}
            </div>

            <p className="password-hint">
                {label} · {HINT}
            </p>
        </div>
    );
}
