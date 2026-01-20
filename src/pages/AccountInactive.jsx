// src/pages/AccountInactive.jsx
import { UserX, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccountInactive() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center max-w-md px-4">
        <div className="rounded-full bg-orange-100 p-6">
          <UserX className="h-16 w-16 text-orange-600" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Compte désactivé
          </h1>
          <p className="text-muted-foreground">
            Votre compte a été désactivé par un administrateur. Vous ne pouvez
            plus accéder à l'application pour le moment.
          </p>
        </div>

        <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-left">
          <div className="flex items-start gap-2">
            <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-900 mb-1">Besoin d'aide ?</p>
              <p className="text-blue-700">
                Contactez votre administrateur pour réactiver votre compte ou
                obtenir plus d'informations.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/connexion")}
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Retour à la connexion
        </button>
      </div>
    </div>
  );
}
