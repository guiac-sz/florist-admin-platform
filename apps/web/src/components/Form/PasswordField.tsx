import { useId, useState, type InputHTMLAttributes } from "react";

import FieldError from "./FieldError";
import { EyeIcon, EyeOffIcon } from "../Icons/Icons";

import "./Form.css";

interface PasswordFieldProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label: string;
    error?: string;
}

export default function PasswordField({
    label,
    error,
    id,
    ...inputProps
}: PasswordFieldProps) {
    const [isVisible, setIsVisible] = useState(false);

    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
        <div className="field">
            <label className="field-label" htmlFor={inputId}>
                {label}
            </label>

            <div className="field-input-wrapper">
                <input
                    {...inputProps}
                    id={inputId}
                    type={isVisible ? "text" : "password"}
                    className={`field-input has-action ${error ? "has-error" : ""}`}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                />

                <button
                    type="button"
                    className="field-action"
                    onClick={() => setIsVisible((current) => !current)}
                    aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
                >
                    {isVisible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
            </div>

            <FieldError id={errorId} message={error} />
        </div>
    );
}