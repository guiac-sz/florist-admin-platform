import { MessageIcon } from "../Icons/Icons";

import "./WhatsAppFloat.css";

interface WhatsAppFloatProps {
    onClick: () => void;
}

export default function WhatsAppFloat({ onClick }: WhatsAppFloatProps) {
    return (
        <button type="button" className="whatsapp-float" onClick={onClick}>
            <MessageIcon size={18} />
            Fale com a florista
        </button>
    );
}
