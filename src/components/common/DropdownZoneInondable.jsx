import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { ChevronDown, Clock } from "lucide-react";

/**
 * Composant de dropdown pour sélectionner une période d'affichage des graphiques
 * Adapté pour fonctionner avec les nouvelles fonctions Vigicrues
 *
 * @param {Object} props - Les propriétés du composant
 * @param {string|null} props.nomSelection - L'option actuellement sélectionnée
 * @param {Object} props.data - Objet contenant les options disponibles (clé = libellé, valeur = identifiant)
 * @param {Function} props.getDataGraph - Fonction appelée lors de la sélection d'une option
 * @returns {JSX.Element} Menu déroulant pour la sélection de période
 */
function DropDownTempGraph({ nomSelection, data, getDataGraph }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
        >
          <Clock className="h-4 w-4" />
          <span>{data[nomSelection] || "Sélectionner une période"}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          {Object.entries(data).map(([label, value]) => {
            // Ne pas afficher l'option actuellement sélectionnée
            if (label !== nomSelection) {
              return (
                <DropdownMenuItem
                  key={value}
                  onClick={async () => await getDataGraph(label)}
                  className="cursor-pointer"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{value}</span>
                </DropdownMenuItem>
              );
            }
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropDownTempGraph;
