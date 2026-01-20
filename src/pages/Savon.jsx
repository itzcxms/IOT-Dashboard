import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppCard from "@/components/common/AppCard";
import { CanAccess } from "@/components/security/CanAccess.jsx";

function Savon() {
  return (
    <div className="flex flex-col gap-6">
      {/* Titre */}
      <div className="flex gap-2 flex-col">
        <h1 className="text-3xl font-bold">Gestion du savon</h1>
        {/* TODO API: Afficher la date de la dernière mise à jour */}
        <span className="text-sm font-normal text-muted-foreground">
          Dernière mise à jour : 16/01/2026 15:12
        </span>
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
      <CanAccess permission="savon.update">
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
            />
          </div>
        </div>
      </CanAccess>
    </div>
  );
}

export default Savon;
