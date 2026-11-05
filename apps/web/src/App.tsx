import { Route, Routes } from "react-router";

import StoreLayout from "./layouts/StoreLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home/Home";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

export default function App() {
    return (
        <Routes>
            <Route element={<StoreLayout />}>
                <Route index element={<Home />} />
            </Route>

            <Route element={<AuthLayout />}>
                <Route path="entrar" element={<LoginPage />} />
                <Route path="criar-conta" element={<RegisterPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}