import { useId, type TextareaHTMLAttributes } from "react";

import FieldError from "./FieldError";

import "./Form.css";

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export default function TextAreaField({
    label,
    error,
    id,
    ...textareaProps
}: TextAreaFieldProps) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const errorId = `${textareaId}-error`;

    return (
        <div className="field">
            <label className="field-label" htmlFor={textareaId}>
                {label}
            </label>

            <textarea
                {...textareaProps}
                id={textareaId}
                className={`field-input field-textarea ${error ? "has-error" : ""}`}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
            />

            <FieldError id={errorId} message={error} />
        </div>
    );
}
