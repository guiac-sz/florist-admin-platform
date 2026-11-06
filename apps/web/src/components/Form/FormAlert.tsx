import type { ReactNode } from "react";

import { AlertCircleIcon } from "../Icons/Icons";

import "./Form.css";

interface FormAlertProps {
    children: ReactNode;
}

export default function FormAlert({ children }: FormAlertProps) {
    return (
        <div className="form-alert" role="alert">
            <AlertCircleIcon size={16} />
            <div>{children}</div>
        </div>
    );
}
