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

function AnalyseSatisfaction() {
  const [periode, setPeriode] = useState("Tout temps");
  return (
    <>
      <div className="gap-5 flex flex-col">
        {/* Questions 1-4 : Grille 2x2 (desktop) / 1x4 (mobile) */}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          <EvaluationsGraphs periode={periode} />
        </div>

        {/* Question 5 : Tableau des remarques et suggestions */}
        <ListeSuggestions />
      </div>
    </>
  );
}

export default AnalyseSatisfaction;
