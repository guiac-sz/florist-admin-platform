import { useId, type InputHTMLAttributes } from "react";

import FieldError from "./FieldError";

import "./Form.css";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export default function TextField({
    label,
    error,
    id,
    ...inputProps
}: TextFieldProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
        <div className="field">
            <label className="field-label" htmlFor={inputId}>
                {label}
            </label>

            <input
                {...inputProps}
                id={inputId}
                className={`field-input ${error ? "has-error" : ""}`}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
            />

            <FieldError id={errorId} message={error} />
        </div>
    );
}