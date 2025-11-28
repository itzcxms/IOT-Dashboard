// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/index.css";
import AuthProvider from "@/context/AuthProvider.jsx";
import RequireAuth from "@/context/RequireAuth.jsx";

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
import CreationsCompte from "@/pages/CreationsCompte.jsx";
import Account from "@/pages/Account.jsx";
import Users from "@/pages/Users.jsx";
import DetailsAccount from "@/pages/DetailsAccount.jsx";
import GestionPermissions from "@/pages/GestionPermissions.jsx";
import LandingPage from "./pages/LandingPage";
import SatisfactionForm from "./pages/SatisfactionForm";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/connexion" element={<Login />} />
          <Route path="/" element={<Decouverte />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/chaumont" element={<LandingPage />} />
          <Route path="/satisfaction" element={<SatisfactionForm />} />
        </Route>

        {/* Privé */}
        <Route element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<ToutVoir />} />
            <Route path="/gestion-de-l-aire" element={<GestionAire />} />
            <Route path="/savon" element={<Savon />} />
            <Route path="/zone-inondable" element={<ZoneInondable />} />
            <Route path="/compte" element={<Account />} />
            <Route path="/compte/details" element={<DetailsAccount />} />
            <Route path="/admin/liste-utilisateurs" element={<Users />} />
            <Route path="/admin/creer-compte" element={<CreationsCompte />} />
            <Route path="/admin/permissions" element={<GestionPermissions />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>,
);
