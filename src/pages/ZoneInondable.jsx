import React from "react";
import { Home } from "lucide-react";
import CardsList from "@/components/common/CardsList.jsx";
import Graphs from "@/components/common/Graphs.jsx";
import PageTitle from "../components/common/PageTitle";

function ZoneInondable() {
  return (
    <>
      {/* Nom de la page */}
      <PageTitle>Zone inondable</PageTitle>

      <div className="gap-4 flex flex-col">
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
          <CardsList type={"sonde"} />
        </div>

        <Graphs typeCapteur={"sonde"} />
      </div>
    </>
  );
}

export default ZoneInondable;
