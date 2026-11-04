import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./styles/global.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error('Elemento "#root" não encontrado no index.html');
}

createRoot(rootElement).render(
    <StrictMode>
        <App />
    </StrictMode>
);