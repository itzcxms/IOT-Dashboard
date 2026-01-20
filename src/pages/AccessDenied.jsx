// src/pages/AccessDenied.jsx
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="rounded-full bg-destructive/10 p-6">
          <ShieldAlert className="h-16 w-16 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Accès refusé</h1>
          <p className="text-muted-foreground max-w-md">
            Vous n'avez pas les permissions nécessaires pour accéder à cette
            page. Contactez votre administrateur si vous pensez qu'il s'agit
            d'une erreur.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Retour au dashboard
        </button>
      </div>
    </div>
  );
}
