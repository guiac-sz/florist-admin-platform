import { useId, type InputHTMLAttributes, type ReactNode } from "react";

import { CheckIcon } from "../Icons/Icons";

import "./Form.css";

interface CheckboxProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label: ReactNode;
}

export default function Checkbox({ label, id, ...inputProps }: CheckboxProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <label className="checkbox-field" htmlFor={inputId}>
            <input {...inputProps} id={inputId} type="checkbox" />

            <span className="checkbox-box" aria-hidden="true">
                <CheckIcon size={12} />
            </span>

            <span>{label}</span>
        </label>
    );
}