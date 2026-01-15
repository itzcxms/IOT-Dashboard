import React from "react";
import DropDownAnneeGraph from "@/components/common/DropDownAnneeGraph.jsx";
import DropDownMoisGraph from "@/components/common/DropDownMoisGraph.jsx";

/**
 * Renders a dropdown selector component based on the provided `nom` value.
 * The component can render either a month-based or year-based dropdown selector.
 *
 * @param {Object} props - The properties for the dropdown selector.
 * @param {string} props.nom - The type of dropdown selector to render, either "Mois" or "Année".
 * @param {Array} props.data - The data used to populate the dropdown options.
 * @param {Function} props.getDataGraph - A callback function used to retrieve data for graphing purposes.
 * @return {JSX.Element} The rendered dropdown selector component.
 */
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
