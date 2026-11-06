import { useId, type ReactNode, type SelectHTMLAttributes } from "react";

import FieldError from "./FieldError";
import { ChevronDownIcon } from "../Icons/Icons";

import "./Form.css";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    children: ReactNode;
}

export default function SelectField({
    label,
    error,
    id,
    children,
    ...selectProps
}: SelectFieldProps) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;

    return (
        <div className="field">
            <label className="field-label" htmlFor={selectId}>
                {label}
            </label>

            <div className="field-input-wrapper">
                <select
                    {...selectProps}
                    id={selectId}
                    className={`field-input field-select ${error ? "has-error" : ""}`}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                >
                    {children}
                </select>

                <ChevronDownIcon size={16} className="field-select-icon" />
            </div>

            <FieldError id={errorId} message={error} />
        </div>
    );
}
