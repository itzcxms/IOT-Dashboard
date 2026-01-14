import React from "react";
import DropDownAnneeGraph from "@/components/common/DropDownAnneeGraph.jsx";
import DropDownMoisGraph from "@/components/common/DropDownMoisGraph.jsx";

function DropDown2Selector({ nom, data, getDataGraph }) {
  if (nom === "Mois") {
    return (
      <DropDownMoisGraph nom={nom} data={data} getDataGraph={getDataGraph} />
    );
  } else if (nom === "Année") {
    return (
      <DropDownAnneeGraph nom={nom} data={data} getDataGraph={getDataGraph} />
    );
  }
}

export default DropDown2Selector;
