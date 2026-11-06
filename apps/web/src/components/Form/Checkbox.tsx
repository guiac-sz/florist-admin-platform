import { useId, type InputHTMLAttributes, type ReactNode } from "react";

import FieldError from "./FieldError";
import { CheckIcon } from "../Icons/Icons";

import "./Form.css";

interface CheckboxProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label: ReactNode;
    error?: string;
}

export default function Checkbox({
    label,
    error,
    id,
    ...inputProps
}: CheckboxProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
        <div className="checkbox-wrapper">
            <label className="checkbox-field" htmlFor={inputId}>
                <input
                    {...inputProps}
                    id={inputId}
                    type="checkbox"
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                />

                <span
                    className={`checkbox-box ${error ? "has-error" : ""}`}
                    aria-hidden="true"
                >
                    <CheckIcon size={12} />
                </span>

                <span>{label}</span>
            </label>

            <FieldError id={errorId} message={error} />
        </div>
    );
}
