import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedAdminRoute from "../src/Utilities/ProtectedRoute";
import AdmindashboardPages from "./AdmindashboardPages";

import AdminDashboard from "../src/Admin/pages/AdminDashboard";
import AdminUsers from "../src/Admin/pages/AdminUsers";
import AdminSkills from "../src/Admin/pages/AdminSkills";

export default function AdminPg() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedAdminRoute>
            <AdmindashboardPages />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Navigate to="main" replace />} />
        <Route path="main" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="skills" element={<AdminSkills />} />
      </Route>
    </Routes>
  );
}