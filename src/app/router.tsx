import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { AppLayout } from "../layout/AppLayout";
import { LoginPage } from "../pages/LoginPage";
import { ActivateAccountPage } from "../pages/ActivateAccountPage";
import { HomePage } from "../pages/HomePage";
import { GuidesPage } from "../pages/GuidesPage";
import { GuideDetailPage } from "../pages/GuideDetailPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { KasseFreePage } from "../pages/free/KasseFreePage";
import { ReparationFreePage } from "../pages/free/ReparationFreePage";
import { PdaFreePage } from "../pages/free/PdaFreePage";
import { ReturEmballageFreePage } from "../pages/free/ReturEmballageFreePage";
import { FeedbackPage } from "../pages/FeedbackPage";
import { AdminPage } from "../pages/AdminPage";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/activate", element: <ActivateAccountPage /> },

  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "guides", element: <GuidesPage /> },

      // Læseguide
      { path: "guides/:area/:slug", element: <GuideDetailPage /> },

      // Fri træning sider
      { path: "guides/kasse/free", element: <KasseFreePage /> },
      { path: "guides/reparation/free", element: <ReparationFreePage /> },
      { path: "guides/pda/free", element: <PdaFreePage /> },
      { path: "guides/returemballage/free", element: <ReturEmballageFreePage /> },

      // Feedback/Admin
      { path: "feedback", element: <FeedbackPage /> },
      { path: "admin", element: <AdminPage /> },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);
