import React from "react";
import CardsList from "@/components/common/CardsList.jsx";
import Graphs from "@/components/common/Graphs.jsx";
import PageTitle from "../components/common/PageTitle";

function GestionAire() {
  return (
    <>
      {/* Nom de la page */}
      <PageTitle>Gestion de l'aire</PageTitle>

      {/* Cartes */}
      <div className="gap-4 flex flex-col">
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
          <CardsList type={"toilette"} />
        </div>

        {/* Graph */}
        <Graphs typeCapteur={"toilette"} />
      </div>
    </>
  );
}

export default GestionAire;
