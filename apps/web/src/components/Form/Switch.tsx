import "./Form.css";

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    disabled?: boolean;
}

export default function Switch({ checked, onChange, label, disabled }: SwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            className={`switch ${checked ? "on" : ""}`}
            onClick={() => onChange(!checked)}
            disabled={disabled}
        >
            <span className="switch-thumb" />
        </button>
    );
}
