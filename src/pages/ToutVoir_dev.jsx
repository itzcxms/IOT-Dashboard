import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

function ToutVoir() {
  return (
    <>
      {/* TODO: Ajouter le nom de l'utilisateur */}
      <h1>Bonjour, Sacha Touille</h1>

      <div className="grid grid-cols-8 gap-4">
        <div className="col-span-4">
          <Card className={"p-6"}>
            <CardHeader className={"flex flex-row justify-between"}>
              <div className="flex flex-row">
                <MapPin className="h-6 w-6" />
                <CardTitle className={"text-sm"}>Chaumont-sur-Loire</CardTitle>
              </div>

              <div className="flex flex-col text-right">
                <span className={"text-xs"}>Jeudi, 22 janvier 2026</span>
                <span className={"text-xs"}>11:36</span>
              </div>
            </CardHeader>

            <CardContent>
              <span>175 mL</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default ToutVoir;
