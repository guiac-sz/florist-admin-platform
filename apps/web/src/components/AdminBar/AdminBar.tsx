import { Link } from "react-router";

import { EyeIcon, FlowerIcon, PencilIcon, ShieldIcon, TagIcon } from "../Icons/Icons";

import "./AdminBar.css";

interface AdminBarProps {
    isEditing: boolean;
    onToggleEditing: () => void;
}

/** Faixa que só a administração vê no topo da loja. */
export default function AdminBar({ isEditing, onToggleEditing }: AdminBarProps) {
    return (
        <div className="admin-bar" role="region" aria-label="Modo administrador">
            <p className="admin-bar-text">
                <ShieldIcon size={16} />
                <strong>Modo administrador</strong>
                <span>
                    {isEditing
                        ? "Você está vendo a loja como seus clientes, com opções extras de edição."
                        : "Pré-visualização: a loja exatamente como seus clientes veem."}
                </span>
            </p>

            <nav className="admin-bar-links">
                <button type="button" className="admin-bar-link" onClick={onToggleEditing}>
                    {isEditing ? <EyeIcon size={15} /> : <PencilIcon size={15} />}
                    {isEditing ? "Ver como cliente" : "Voltar a editar"}
                </button>

                <Link to="/admin/categorias" className="admin-bar-link">
                    <TagIcon size={15} />
                    Categorias
                </Link>

                <Link to="/admin/produtos" className="admin-bar-link is-primary">
                    <FlowerIcon size={15} />
                    Produtos e vitrine
                </Link>
            </nav>
        </div>
    );
}
