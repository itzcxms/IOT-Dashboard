import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import AppCard from "@/components/common/AppCard";
import { useAuth } from "@/context/useAuth.jsx";
import { CanAccess } from "@/components/security/CanAccess.jsx";

function Savon() {
  const { token } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour réinitialiser le savon
  // TODO: Réactiver l'appel API quand le backend sera prêt
  const handleReset = async () => {
    setIsLoading(true);
    
    // Simulation d'un délai pour le feedback utilisateur
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Afficher la boîte de dialogue de confirmation
    setIsDialogOpen(true);
    setIsLoading(false);

    /* Code API à réactiver plus tard:
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/savon/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la réinitialisation");
      }

      setIsDialogOpen(true);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la réinitialisation du savon");
    } finally {
      setIsLoading(false);
    }
    */
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Titre */}
      <div className="flex justify-between items-start">
        <div className="flex gap-2 flex-col">
          <h1 className="text-3xl font-bold">Gestion du savon</h1>
          {/* TODO API: Afficher la date de la dernière mise à jour */}
          <span className="text-sm font-normal text-muted-foreground">
            Dernière mise à jour : 16/01/2026 15:12
          </span>
        </div>
        <Button  onClick={handleReset} disabled={isLoading}>
          {isLoading ? "Réinitialisation..." : "Réinitialiser"}
        </Button>
      </div>

      {/* Cartes */}
      <div className="grid grid-cols-3 gap-4">
        {/* Carte + barre de progression */}
        <Card className="col-span-1">
          <CardHeader className={"flex-col"}>
            <CardTitle className={"text-base font-semibold"}>
              Contenance estimée
            </CardTitle>
            <span className="text-sm font-normal text-muted-foreground">
              (en mL)
            </span>
          </CardHeader>
          <CardContent>
            {/* TODO: API: Connecter contenance du savon */}
            <span className={"text-2xl font-medium"}>175 mL</span>
          </CardContent>

          {/* TODO API : Barre de progression en fonction de la contenance du savon */}
          <div className="px-6">
            <Progress value={80.5} className="h-2 px-2" />
          </div>
        </Card>

        <AppCard
          titre="Nombre de passages"
          texte="152"
          sousTitre="Depuis le dernier remplissage"
        />
      </div>
      <CanAccess
        permission="savon.update"
        loadingFallback={<div>Chargement…</div>}
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Paramètres</h2>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="contenance">Seuil d'envoi de la notification</Label>
            <Input type="number" id="contenance" placeholder="Seuil (en mL)" />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="contenance">Contenance du distributeur</Label>
            <Input
              type="number"
              id="contenance"
              placeholder="Contenance (en mL)"
              className={"ring-primary focus:ring-primary"}
            />
          </div>

          <div>
            <Button>Enregistrer</Button>
          </div>
        </div>

        {/* Boîte de dialogue de confirmation */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Réinitialisation effectuée</DialogTitle>
              <DialogDescription>
                Le savon a bien été réinitialisé. Le compteur de passages a été
                remis à zéro.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CanAccess>
    </div>
  );
}

export default Savon;
