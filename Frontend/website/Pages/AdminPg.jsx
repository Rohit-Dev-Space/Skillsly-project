import AdminLayout from "../src/Admin/AdminLayout"
import AddCategories from "../src/Admin/pages/AddCategories";
import AdminDashboard from "../src/Admin/pages/AdminDashboard";
import ProtectedAdminRoute from "../src/Utilities/ProtectedRoute"
import { Route, Routes } from "react-router-dom";

export default function AdminPg() {
    return (
        <Routes>
            <Route
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout />
                    </ProtectedAdminRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AddCategories />} />
            </Route>
        </Routes>
    )
}