import { useId, type ComponentProps } from "react";

import FieldError from "./FieldError";

import "./Form.css";

// ComponentProps<"input"> inclui o "ref": no React 19 ele é uma prop comum,
// então quem usa o TextField pode pegar o <input> (ex.: para dar foco).
interface TextFieldProps extends ComponentProps<"input"> {
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