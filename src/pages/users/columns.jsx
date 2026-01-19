/**
 * Définition des colonnes pour la table des utilisateurs
 */

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Ban, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

/**
 * Composant Avatar avec initiales
 */
function UserAvatar({ nom }) {
  const initials = nom
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Couleurs basées sur les initiales
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-cyan-500",
    "bg-indigo-500",
  ];
  const colorIndex = nom.charCodeAt(0) % colors.length;

  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-full ${colors[colorIndex]} text-white text-sm font-medium`}
    >
      {initials}
    </div>
  );
}

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Tout sélectionner"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nom",
    header: "Nom",
    cell: ({ row }) => {
      const nom = row.getValue("nom");
      const email = row.original.email;
      return (
        <div className="flex items-center gap-3">
          <UserAvatar nom={nom} />
          <div className="flex flex-col">
            <span className="font-medium">{nom}</span>
            <span className="text-sm text-muted-foreground">{email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => {
      const role = row.getValue("role");
      const roleName = role?.name || role;
      const roleStyles = {
        admin: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        user: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        guest: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      };
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${roleStyles[roleName] || "bg-slate-500/20 text-slate-300 border-slate-500/30"}`}
        >
          {roleName}
        </span>
      );
    },
  },
  {
    accessorKey: "dateCreation",
    header: "Date de création",
  },
  {
    accessorKey: "statut",
    header: "Statut",
    cell: ({ row }) => {
      const statut = row.original.statut || "actif";
      const statutStyles = {
        actif: "bg-green-500/20 text-green-400 border-green-500/30",
        suspendu: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        inactif: "bg-red-500/20 text-red-400 border-red-500/30",
      };
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${statutStyles[statut] || statutStyles.actif}`}
        >
          {statut}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menu actions</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => console.log("Modifier", user.id)}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Suspendre", user.id)}
              className="flex items-center gap-2 text-orange-400"
            >
              <Ban className="h-4 w-4" />
              Suspendre
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => console.log("Supprimer", user.id)}
              className="flex items-center gap-2 text-red-400"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
