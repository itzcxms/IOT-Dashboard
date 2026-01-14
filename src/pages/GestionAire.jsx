import React from "react";
import CardsList from "@/components/common/CardsList.jsx";
import { Home } from "lucide-react";
import Graphs from "@/components/common/Graphs.jsx";
import PageTitle from "../components/common/PageTitle";

function GestionAire() {
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
  ];
  return (
    <>
      {/* Nom de la page */}
      <PageTitle>Gestion de l'aire</PageTitle>

      {/* Cartes */}
      <div className="gap-4 flex flex-col">
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
          <CardsList cards={cards} />
        </div>

        {/* Graph */}
        <Graphs typeCapteur={"toilette"} />
      </div>
    </>
  );
}

export default GestionAire;
