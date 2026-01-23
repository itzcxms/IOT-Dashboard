import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col md:flex-row min-h-screen w-screen overflow-x-hidden bg-slate-900">
      {/* Gauche */}
      <div className="hidden md:block relative md:flex-[7] h-screen overflow-hidden">
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
        {/* petit voile pour lisibilité optionnel */}
      </div>

      {/* Droite */}
      <div className="flex flex-1 md:flex-[3] w-full md:max-w-[50vw] min-h-screen items-center justify-center bg-background px-6 sm:px-10">
        <Card className="w-full max-w-md bg-card backdrop-blur">
          <CardHeader>
            <CardTitle className="text-3xl ">
              404 — Oups !
            </CardTitle>
            <CardDescription className="">
              La page que vous cherchez n’existe pas ou a été déplacée.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm">
              Vérifiez l’URL, ou utilisez un des raccourcis ci-dessous.
            </p>

            <div className="flex flex-col gap-2">
              <Link
                onClick={() => navigate(-1)}
                className="w-full rounded-md border border-primary/50 bg-transparent px-4 py-2 text-center text-primary hover:bg-primary/10"
              >
                Revenir en arrière
              </Link>

              <Link
                to="/dashboard"
                className="w-full rounded-md border border-primary/50 bg-primary px-4 py-2 text-center text-white hover:bg-primary/10"
              >
                Retour à l’accueil
              </Link>
            </div>
          </CardContent>

          <CardFooter className="text-xs text-slate-500">
            Si le problème persiste, contactez l’administrateur.
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

export default NotFound;
