import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";

function AppCard({ titre, sousTitre, texte }) {
  return (
    <Card>
      <CardHeader className={"flex flex-col"}>
        <CardTitle className={"text-base font-semibold capitalize"}>
          {titre}
        </CardTitle>
        <span className="text-sm font-normal text-muted-foreground">
          {sousTitre}
        </span>
      </CardHeader>
      <CardContent>
        <span className={"text-2xl font-medium"}>{texte}</span>
      </CardContent>
    </Card>
  );
}

export default AppCard;
