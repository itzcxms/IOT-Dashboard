import React from "react";
import { Search, Filter, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const UsersFilters = ({
  searchTerm,
  setSearchTerm,
  filterRole,
  setFilterRole,
  filterStatus,
  setFilterStatus,
  roles,
  showFilters,
  setShowFilters,
}) => {
  const hasActiveFilters = filterRole || filterStatus;

  const resetFilters = () => {
    setFilterRole("");
    setFilterStatus("");
  };
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, prénom ou email..."
              className="pl-10"
            />
          </div>

          {/* Bouton filtres mobile */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="w-4 h-4" />
            Filtres
          </Button>

          {/* Filtres */}
          <div
            className={`flex flex-col lg:flex-row gap-4 ${
              showFilters ? "flex" : "hidden lg:flex"
            }`}
          >
            <Select
              value={filterRole || undefined}
              onValueChange={(value) => setFilterRole(value || "")}
            >
              <SelectTrigger className="lg:w-48">
                <SelectValue placeholder="Tous les rôles" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role._id} value={role._id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filterStatus || undefined}
              onValueChange={(value) => setFilterStatus(value || "")}
            >
              <SelectTrigger className="lg:w-48">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actif">Actifs</SelectItem>
                <SelectItem value="inactif">Inactifs</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={resetFilters}
                title="Réinitialiser les filtres"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
