// src/router/AppRouter.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Signup from "../pages/Signup";
import Login from "../pages/Login";
import AdminLayout from "../components/layouts/AdminLayout";

import DashboardPage from "../pages/dashboard/DashboardPage";
import UserDirectory from "../pages/dashboard/UserDirectoryPage";
import IssueManagementPage from "../pages/dashboard/IssueManagementPage";
import FlaggedContentPage from "../pages/dashboard/FlaggedContentPage";
import EventsPage from "../pages/dashboard/EventsPage";

import ProtectedRoute from "../components/common/ProtectedRoute";
import AnnouncementsPage from "../components/admin/AnnouncementsPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UserDirectory />} />
          <Route path="issues" element={<IssueManagementPage />} />
          <Route path="flags" element={<FlaggedContentPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="events" element={<EventsPage />} />
          {/* Add more admin nested routes here */}
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
