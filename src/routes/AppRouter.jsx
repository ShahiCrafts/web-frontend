import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Signup from "../pages/Signup";
import Login from "../pages/Login";
import AdminLayout from "../components/layouts/AdminLayout";

import PublicLayout from "../components/layouts/PublicLayout";

import DashboardPage from "../pages/dashboard/DashboardPage";
import IssueManagementPage from "../pages/dashboard/IssueManagementPage";
import EventsPage from "../pages/dashboard/EventsPage";

import ProtectedRoute from "../components/common/ProtectedRoute";
import MainContentPage from "../components/admin/contents/MainContentPage";
import MainUsersPage from "../components/admin/users/MainUsersPage";
import MainNotificationPage from "../components/admin/notifications/MainNotificationPage";
import MainEventPage from "../components/admin/events/MainEventPage";
import MainDiscussionPage from "../components/admin/discussions/MainDiscussionPage";
import MainRolePage from "../components/admin/permissions/MainRolePage";
import MainPollPage from "../components/admin/polls/MainPollPage";
import Settings from "../components/admin/Settings";
import MainTenantPage from "../components/admin/tenants/MainTenantPage";
import MainCatAndTag from "../components/admin/categories/MainCatAndTag";
import MainHomePage from "../components/public/home/MainHomePage";
import DiscussionPage from "../pages/DiscussionPage";
import PostDetailPage from "../pages/PostDetailModal";
import ProfilePage from "../pages/profile/UserProfilePage";
import SarahChenProfile from "../pages/ExplorePage";
import ExploreCommunities from "../pages/ExploreCommunities";
import CommunityApprovalDashboard from "../components/admin/CommunityManagement";
import ManageCommunities from "../pages/ManageCommunities";
import PopularPage from "../pages/PopularPage";
import MainCitizensPage from "../components/admin/users/MainCitizensPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/citizen/discussion/:id"
          element={
            <ProtectedRoute allowedRoles={["citizen"]}>
              <DiscussionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview" element={<DashboardPage />} />
          <Route path="users" element={<MainUsersPage />} />
          <Route path="users/citizens" element={<MainCitizensPage />} />
          <Route path="issues" element={<IssueManagementPage />} />
          <Route path="flags" element={<MainContentPage />} />
          <Route path="notifications" element={<MainNotificationPage />} />
          <Route path="discussions" element={<MainDiscussionPage />} />
          <Route path="roles" element={<MainRolePage />} />
          <Route path="polls" element={<MainPollPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="tenants" element={<MainTenantPage />} />
          <Route path="categories" element={<MainCatAndTag />} />
          <Route path="events" element={<MainEventPage />} />
          <Route path="communities" element={<CommunityApprovalDashboard />} />

        </Route>

        <Route
          path="/citizen/*"
          element={
            <ProtectedRoute allowedRoles={["citizen"]}>
              <PublicLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/citizen/home" replace />} />
          <Route path="home" element={<MainHomePage />} />
          <Route path="popular" element={<PopularPage />} />
          <Route path="post/options/:postId" element={<PostDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/:userId" element={<SarahChenProfile />} />
          <Route path="explore" element={<ExploreCommunities />} />
          <Route path="manage" element={<ManageCommunities />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;