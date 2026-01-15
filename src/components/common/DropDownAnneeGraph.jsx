import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { useAuth } from "@/context/useAuth.jsx";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";

/**
 * Renders a dropdown menu for selecting a year for graph data visualization.
 *
 * @param {Object} params - The parameters for the component.
 * @param {string} params.nom - The name identifier of the graph.
 * @param {Array} params.data - The current data set which includes the selected year.
 * @param {Function} params.getDataGraph - A function to retrieve the data for the graph based on the selected year.
 * @return {JSX.Element} A dropdown menu that displays available years and allows selection for graph updates.
 */
function DropDownAnneeGraph({ nom, data, getDataGraph }) {
  const { token } = useAuth();
  const [years, setYears] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentSelected = data[0];

  useEffect(() => {
    /**
     * Récupère la liste des années disponibles depuis l'API.
     *
     * @returns {Promise<void>}
     */
    async function fetchYears() {
      await setYears(
        await generateCallsAPI(token, "GET", "/api/graphs/capteurs/year/all"),
      );
      await setIsLoading(false);
    }
    if (isLoading) {
      void fetchYears();
    }
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            "h-9 px-4 py-2 has-[>svg]:px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
          }
        >
          {isLoading ? "Chargement" : currentSelected}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup key={"Group"}>
          {isLoading
            ? ""
            : years.map((key) => {
                if (parseInt(currentSelected) !== parseInt(key)) {
                  return (
                    <DropdownMenuItem
                      onClick={async () => getDataGraph(nom, key)}
                      key={key}
                    >
                      {key}
                    </DropdownMenuItem>
                  );
                }
              })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropDownAnneeGraph;
