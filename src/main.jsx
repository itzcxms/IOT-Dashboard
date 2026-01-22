// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/index.css";
import AuthProvider from "@/context/AuthProvider.jsx";
import RequireAuth from "@/context/RequireAuth.jsx";
import ProtectedRoute from "@/components/security/ProtectedRoute.jsx";

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/Login";
import Decouverte from "./pages/Decouverte";
import ForgotPassword from "@/pages/ForgotPassword.jsx";
import NotFound from "@/pages/NotFound.jsx";

import GestionAire from "./pages/GestionAire";
import Savon from "./pages/Savon";
import ToutVoir from "./pages/ToutVoir.jsx";
import ZoneInondable from "./pages/ZoneInondable";
import Account from "@/pages/Account.jsx";
import Users from "@/pages/Users.jsx";
import DetailsAccount from "@/pages/DetailsAccount.jsx";
import GestionPermissions from "@/pages/GestionPermissions.jsx";
import LandingPage from "./pages/LandingPage";
import SatisfactionForm from "./pages/SatisfactionForm";
import AnalyseSatisfaction from "./pages/AnalyseSatisfaction";
import AccessDenied from "./pages/AccessDenied";
import AccountInactive from "./pages/AccountInactive";
import Logout from "@/pages/Logout.jsx";
import PermissionProvider from "@/context/PermissionProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/connexion" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<Decouverte />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/chaumont" element={<LandingPage />} />
          <Route path="/satisfaction" element={<SatisfactionForm />} />
          <Route path="/compte-inactif" element={<AccountInactive />} />
        </Route>

        {/* Privé avec permissions */}
        <Route element={<RequireAuth />}>
          <Route
            element={
              <PermissionProvider>
                <DashboardLayout />
              </PermissionProvider>
            }
          >
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute route="/dashboard">
                  <ToutVoir />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gestion-de-l-aire"
              element={
                <ProtectedRoute route="/gestion-de-l-aire">
                  <GestionAire />
                </ProtectedRoute>
              }
            />
            <Route
              path="/savon"
              element={
                <ProtectedRoute route="/savon">
                  <Savon />
                </ProtectedRoute>
              }
            />
            <Route
              path="/zone-inondable"
              element={
                <ProtectedRoute route="/zone-inondable">
                  <ZoneInondable />
                </ProtectedRoute>
              }
            />

            <Route path="/compte" element={<Account />} />
            <Route path="/compte/details" element={<DetailsAccount />} />

            <Route
              path="/admin/liste-utilisateurs"
              element={
                <ProtectedRoute route="/admin/liste-utilisateurs">
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/permissions"
              element={
                <ProtectedRoute route="/admin/permissions">
                  <GestionPermissions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analyse-satisfaction"
              element={
                <ProtectedRoute route="/analyse-satisfaction">
                  <AnalyseSatisfaction />
                </ProtectedRoute>
              }
            />

            <Route path="/acces-refuse" element={<AccessDenied />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>,
);
