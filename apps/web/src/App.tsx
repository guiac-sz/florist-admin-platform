import { Navigate, Route, Routes } from "react-router";

import StoreLayout from "./layouts/StoreLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import RequireAdmin from "./components/RequireAdmin/RequireAdmin";
import Home from "./pages/Home/Home";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import AdminProductsPage from "./pages/Admin/AdminProductsPage";
import AdminProductFormPage from "./pages/Admin/AdminProductFormPage";
import AdminCategoriesPage from "./pages/Admin/AdminCategoriesPage";
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

            <Route
                path="admin"
                element={
                    <RequireAdmin>
                        <AdminLayout />
                    </RequireAdmin>
                }
            >
                <Route index element={<Navigate to="produtos" replace />} />
                <Route path="produtos" element={<AdminProductsPage />} />
                <Route path="produtos/novo" element={<AdminProductFormPage />} />
                <Route path="produtos/:id" element={<AdminProductFormPage key="edit" />} />
                <Route path="categorias" element={<AdminCategoriesPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
