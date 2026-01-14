import React from "react";
import { Home } from "lucide-react";
import CardsList from "@/components/common/CardsList.jsx";
import Graphs from "@/components/common/Graphs.jsx";
import PageTitle from "../components/common/PageTitle";

function ZoneInondable() {
  const cards = [
    {
      icone: Home,
      titre: "Dernière mesure",
      texte: "4,18m",
    },
    {
      icone: Home,
      titre: "Date et heure de la mesure",
      texte: "20/10/2025 14:27",
    },
    {
      icone: Home,
      titre: "État global",
      texte: "Critique",
    },
    {
      icone: Home,
      titre: "Batterie du capteur",
      texte: "72%",
    },
  ];

  return (
    <>
      {/* Nom de la page */}
      <PageTitle>Zone inondable</PageTitle>

      <div className="gap-4 flex flex-col">
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
          <CardsList cards={cards} />
        </div>

        <Graphs typeCapteur={"sonde"} />
      </div>
    </>
  );
}

export default ZoneInondable;
