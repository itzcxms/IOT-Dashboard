import React, { useState } from "react";
import { Home } from "lucide-react";
import CardsList from "@/components/common/CardsList.jsx";
import Graphs from "@/components/common/Graphs.jsx";

import GraphCardPie from "@/components/common/GraphCardPie.jsx";
import GraphCardBar from "@/components/common/GraphCardBar.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import GraphRadar from "@/components/common/GraphRadar";
import EvaluationsGraphs from "@/components/common/EvaluationsGraphs.jsx";
import ListeSuggestions from "@/components/common/ListeSuggestions.jsx";
import SourcesConnaissancesGraph from "@/components/common/SourcesConnaissancesGraph.jsx";
import DropDownTempSatisfaction from "@/components/common/DropDownTempSatisfaction.jsx";

function AnalyseSatisfaction() {
  const [periode, setPeriode] = useState("Aujourd'hui");
  const [date] = useState(new Date().toISOString().split("T")[0]);
  const [isLoading, setIsLoading] = useState(false);
  const listePeriodes = [
    "Tout temps",
    "Aujourd'hui",
    "7 derniers jours",
    "Ce mois-ci",
    "Cette année",
  ];

  async function editPeriode(newPeriode) {
    if (listePeriodes.find((e) => e === newPeriode)) {
      await setIsLoading(true);
      await setPeriode(newPeriode);
      await setIsLoading(false);
    }
  }

  return (
    <>
      <div className="gap-5 flex flex-col">
        <div className={"flex justify-end"}>
          <DropDownTempSatisfaction
            periode={periode}
            listePeriodes={listePeriodes}
            editPeriode={editPeriode}
          />
        </div>
        {/* Questions 1-4 : Grille 2x2 (desktop) / 1x4 (mobile) */}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          <EvaluationsGraphs
            isLoadingGeneral={isLoading}
            periode={periode}
            date={date}
          />
        </div>

        {/* Retiré pour des questions de sécurité indirectes */}
        {/* Question 5 : Tableau des remarques et suggestions */}
        {/*<ListeSuggestions isLoadingGeneral={isLoading} />*/}
      </div>
    </>
  );
}

export default AnalyseSatisfaction;
