import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";

function AppCard({ icone, titre, texte }) {
  return (
    <Card>
      <CardHeader className={"flex items-center"}>
        {icone}
        <CardTitle className={"text-sm capitalize"}>{titre}</CardTitle>
      </CardHeader>
      <CardContent>
        <span className={"text-2xl"}>{texte}</span>
      </CardContent>
    </Card>
  );
}

export default AppCard;
