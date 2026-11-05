import { AlertCircleIcon } from "../Icons/Icons";

interface FieldErrorProps {
    id: string;
    message?: string;
}

export default function FieldError({ id, message }: FieldErrorProps) {
    if (!message) {
        return null;
    }

    return (
        <p className="field-error" id={id}>
            <AlertCircleIcon size={14} />
            {message}
        </p>
    );
}