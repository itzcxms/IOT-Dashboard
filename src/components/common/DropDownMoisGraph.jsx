import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";
import { useAuth } from "@/context/useAuth.jsx";
import { NumToMois } from "@/functions/GestionnaireDates.jsx";

function DropDownMoisGraph({ nom, data, getDataGraph }) {
  const { token } = useAuth();
  const [months, setMonths] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getListOfMonths() {
    return generateCallsAPI(token, "GET", "/api/graphs/capteurs/month/all");
  }

  useEffect(() => {
    async function fetchMonths(data) {
      let Months = await getListOfMonths();
      let monthsKeys = Object.keys(Months);
      let currentMonth = data[1];
      if (currentMonth < 10) {
        currentMonth = "0" + currentMonth;
      }
      console.log(typeof monthsKeys[monthsKeys.length - 1], typeof data[0]);
      if (
        Months[monthsKeys[monthsKeys.length - 1]].length === 1 &&
        parseInt(monthsKeys[monthsKeys.length - 1]) === parseInt(data[0])
      ) {
        delete Months[monthsKeys[monthsKeys.length - 1]];
        monthsKeys = Object.keys(Months);
      }
      let dataMonths = [monthsKeys, Months];
      dataMonths.push(currentMonth);
      dataMonths.push(data[0]);
      await setMonths(dataMonths);
      await setIsLoading(false);
    }
    if (isLoading) {
      void fetchMonths(data);
    }
  });

  console.log(data, months);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            "h-9 px-4 py-2 has-[>svg]:px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
          }
        >
          {isLoading
            ? "Chargement"
            : NumToMois(parseInt(months[2])) + " - " + months[3]}
        </button>
      </DropdownMenuTrigger>
      {isLoading ? (
        ""
      ) : (
        <DropdownMenuContent align="end">
          {months[0].map((key) => {
            console.log(key);
            return (
              <div key={key + "-div"}>
                <DropdownMenuLabel key={key + "-label"}>
                  {key}
                </DropdownMenuLabel>
                <DropdownMenuGroup key={key + "-group"}>
                  {months[1][key].map((mois) => {
                    if (
                      parseInt(months[3]) === parseInt(key) &&
                      months[2] === mois
                    ) {
                      console.log(mois);
                      return "";
                    } else {
                      console.log(mois);
                      return (
                        <DropdownMenuItem
                          onClick={async () => getDataGraph(nom, key, mois)}
                          key={key + "-" + mois}
                        >
                          {NumToMois(parseInt(mois))}
                        </DropdownMenuItem>
                      );
                    }
                  })}
                </DropdownMenuGroup>
                {months[0][months[0].length - 1] !== key ? (
                  <DropdownMenuSeparator />
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}

export default DropDownMoisGraph;
