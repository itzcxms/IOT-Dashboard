// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "@/context/useAuth";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx"; // ✅ on récupère login via le hook
function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ vient du AuthProvider

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await generateCallsAPI(null, "POST", "/api/auth/login", {
        email,
        password,
      });

      const token = data?.token;

      if (!token) {
        throw new Error("Token manquant dans la réponse du serveur.");
      }

      login(token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login KO:", err);
      setError(err.message || "Une erreur est survenue lors de la connexion.");
    }
  };

  return (
    <main className="flex min-h-screen w-screen overflow-x-hidden bg-primary">
      <div className="relative flex-[7] h-screen overflow-hidden">
        <img
          src="/login/val-de-loir-bg.png"
          alt="img-bg"
          className="h-full w-full object-cover"
        />
        <img
          src="/login/logo.png"
          alt="Logo"
          className="absolute left-6 top-6 w-64"
        />
      </div>

      <div className="flex flex-[3] w-full max-w-[50vw] min-h-screen items-center justify-center bg-background px-6 sm:px-10">
        <Card className="w-full max-w-md bg-card backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">
              Heureux de vous retrouver !
            </CardTitle>
            <CardDescription className="">
              Connectez-vous pour accéder à votre espace.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="">
                  Adresse e-mail
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@exemple.com"
                  className="placeholder:text-slate-500 focus-visible:ring-primary/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Mot de passe */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="">
                  Mot de passe
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Votre mot de passe"
                  className="placeholder:text-slate-500 focus-visible:ring-primary/60"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="flex justify-end">
                  <a
                    href="/mot-de-passe-oublie"
                    className="mt-1 flex justify-end text-right text-xs text-primary"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>

              {/* Erreur */}
              {error && (
                <Alert
                  variant="destructive"
                  className="border-red-900/60 bg-red-950/40"
                >
                  <AlertDescription className="text-sm text-red-200">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>

            <br />

            <CardFooter>
              <button
                type="submit"
                className="w-full rounded-md bg-primary py-2 text-sm font-medium text-white transition-colors"
              >
                Connexion
              </button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}

export default Login;
