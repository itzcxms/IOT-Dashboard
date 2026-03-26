import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AppCard from "@/components/common/AppCard";
import { useAuth } from "@/context/useAuth.jsx";
import { CanAccess } from "@/components/security/CanAccess.jsx";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";

function Savon() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState(null);
  const [selectedSavonId, setSelectedSavonId] = useState(null);
  const [seuil, setSeuil] = useState("");
  const [contenance, setContenance] = useState("");
  const [error, setError] = useState(null);

  // Récupérer les données des distributeurs de savon
  const getDataSavon = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await generateCallsAPI(token, "GET", "/api/savon");
      setData(response);

      // Sélectionner le premier distributeur par défaut
      if (response && response.length > 0) {
        const firstSavon = response[0];
        setSelectedSavonId(firstSavon._id); // Toujours utiliser _id de MongoDB
        setSeuil(firstSavon.seuils?.alert || "");
        setContenance(firstSavon.contenance || "");
      }
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Charger les données au montage
  useEffect(() => {
    getDataSavon();
  }, [getDataSavon]);

  // Fonction pour réinitialiser le savon (remplissage)
  const handleReset = async () => {
    if (!selectedSavonId) {
      alert("Aucun distributeur sélectionné");
      return;
    }

    setIsLoading(true);
    try {
      // Appel API pour marquer un remplissage
      await generateCallsAPI(
        token,
        "POST",
        `/api/savon/${selectedSavonId}/remplissage`,
        {},
      );

      // Recharger les données
      await getDataSavon();
      alert(
        "Le savon a bien été réinitialisé. Le compteur de passages a été remis à zéro.",
      );
    } catch (err) {
      console.error("Erreur lors de la réinitialisation:", err);
      alert("Erreur lors de la réinitialisation du savon");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour sauvegarder les paramètres
  const handleSaveSettings = async () => {
    if (!selectedSavonId) {
      alert("Aucun distributeur sélectionné");
      return;
    }

    setIsSaving(true);
    try {
      const updateData = {
        seuils: {
          alert: parseInt(seuil) || null,
        },
        contenance: parseInt(contenance) || null,
      };

      await generateCallsAPI(
        token,
        "PUT",
        `/api/savon/${selectedSavonId}`,
        updateData,
      );

      // Recharger les données
      await getDataSavon();
      alert("Paramètres mis à jour avec succès");
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      alert("Erreur lors de la mise à jour des paramètres");
    } finally {
      setIsSaving(false);
    }
  };

  // Récupérer le distributeur sélectionné
  const selectedSavon = data && data.find((s) => s._id === selectedSavonId);

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        Chargement...
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Titre */}
      <div className="flex justify-between items-start">
        <div className="flex gap-2 flex-col">
          <h1 className="text-3xl font-bold">Gestion du savon</h1>
          <span className="text-sm font-normal text-muted-foreground">
            Dernière mise à jour :{" "}
            {selectedSavon?.updatedAt
              ? new Date(selectedSavon.updatedAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </span>
        </div>
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isLoading || !selectedSavon}
        >
          {isLoading ? "Réinitialisation..." : "Réinitialiser"}
        </Button>
      </div>

      {/* Cartes */}
      <div className="grid grid-cols-3 gap-4">
        {/* Carte + barre de progression */}
        <Card className="col-span-1">
          <CardHeader className={"flex-col"}>
            <CardTitle className={"text-base font-semibold"}>
              Contenue estimée
            </CardTitle>
            <span className="text-sm font-normal text-muted-foreground">
              (en mL)
            </span>
          </CardHeader>
          <CardContent>
            <span className={"text-2xl font-medium"}>
              {selectedSavon?.contenance -
                selectedSavon?.dernierRemplissage?.compteurPassages *
                  selectedSavon?.consommationParPassage || "—"}{" "}
              mL
            </span>
          </CardContent>

          <div className="px-6">
            <Progress
              value={
                selectedSavon
                  ? ((selectedSavon?.contenance -
                      selectedSavon?.dernierRemplissage?.compteurPassages *
                        selectedSavon?.consommationParPassage) /
                      selectedSavon.contenance) *
                    100
                  : 0
              }
            />
          </div>
        </Card>

        <AppCard
          titre="Nombre de passages"
          texte={selectedSavon?.dernierRemplissage?.compteurPassages || "0"}
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
            <Label htmlFor="seuil">Seuil d'envoi de la notification</Label>
            <Input
              type="number"
              id="seuil"
              placeholder="Seuil (en mL)"
              value={seuil}
              onChange={(e) => setSeuil(e.target.value)}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="contenanceInput">Contenance du distributeur</Label>
            <Input
              type="number"
              id="contenanceInput"
              placeholder="Contenance (en mL)"
              value={contenance}
              onChange={(e) => setContenance(e.target.value)}
              className={"ring-primary focus:ring-primary"}
            />
          </div>

          <div>
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving || !selectedSavon}
            >
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </CanAccess>
    </div>
  );
}

export default Savon;
