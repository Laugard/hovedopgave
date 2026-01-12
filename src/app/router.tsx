// src/app/router.tsx
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

      // Fri træning (separate sider pr. område)
      { path: "guides/kasse/free", element: <KasseFreePage /> },
      { path: "guides/reparation/free", element: <ReparationFreePage /> },
      { path: "guides/returemballage/free", element: <ReturEmballageFreePage /> },
      { path: "guides/pda/free", element: <PdaFreePage /> },

      // Placeholder sider
      { path: "feedback", element: <div className="panel">Feedback (placeholder)</div> },
      { path: "admin", element: <div className="panel">Admin (placeholder)</div> },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);
