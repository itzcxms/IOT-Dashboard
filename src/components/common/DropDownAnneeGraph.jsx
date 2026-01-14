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

function DropDownAnneeGraph({ nom, data, getDataGraph }) {
  const { token } = useAuth();
  const [years, setYears] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getListOfYears() {
    return generateCallsAPI(token, "GET", "/api/graphs/capteurs/year/all");
  }
  const currentSelected = data[1];

  useEffect(() => {
    async function fetchYears() {
      const Years = await getListOfYears();
      await setYears([Years, new Date().getFullYear()]);
      await setIsLoading(false);
    }
    if (isLoading) {
      void fetchYears();
    }
  });

  console.log(data, years);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            "h-9 px-4 py-2 has-[>svg]:px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
          }
        >
          {isLoading ? "Chargement" : years[1]}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup key={"Group"}>
          {isLoading
            ? ""
            : years[0].map((key) => {
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
