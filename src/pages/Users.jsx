import React, { useState } from "react";
import CardsList from "@/components/common/CardsList.jsx";
import { User2, UserPlus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./users/columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const cards = [
  {
    icone: User2,
    titre: "Total",
    texte: "5",
  },
];

// Données fictives (à remplacer par l'API)
const users = [
  {
    id: "USR001",
    nom: "Jean Dupont",
    email: "jean.dupont@email.com",
    role: { _id: "role001", name: "admin" },
    dateCreation: "15/01/2026",
    statut: "actif",
  },
  {
    id: "USR002",
    nom: "Marie Martin",
    email: "marie.martin@email.com",
    role: { _id: "role002", name: "user" },
    dateCreation: "14/01/2026",
    statut: "actif",
  },
  {
    id: "USR003",
    nom: "Pierre Bernard",
    email: "pierre.bernard@email.com",
    role: { _id: "role002", name: "user" },
    dateCreation: "13/01/2026",
    statut: "suspendu",
  },
  {
    id: "USR004",
    nom: "Sophie Petit",
    email: "sophie.petit@email.com",
    role: { _id: "role003", name: "guest" },
    dateCreation: "12/01/2026",
    statut: "actif",
  },
  {
    id: "USR005",
    nom: "Lucas Moreau",
    email: "lucas.moreau@email.com",
    role: { _id: "role002", name: "user" },
    dateCreation: "11/01/2026",
    statut: "inactif",
  },
];

function Users() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    prenom: "",
    nom: "",
    email: "",
    role: "",
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    // TODO: API call pour créer l'utilisateur
    console.log("Créer utilisateur:", newUser);
    setIsDialogOpen(false);
    setNewUser({ prenom: "", nom: "", email: "", role: "" });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header avec titre et bouton */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-col">
          <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
          <span className="text-sm font-normal text-muted-foreground">
            Dernière mise à jour : 16/01/2026 16:44
          </span>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Ajouter utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer un utilisateur</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouveau compte.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input
                      id="prenom"
                      value={newUser.prenom}
                      onChange={(e) =>
                        setNewUser({ ...newUser, prenom: e.target.value })
                      }
                      placeholder="Prénom"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      value={newUser.nom}
                      onChange={(e) =>
                        setNewUser({ ...newUser, nom: e.target.value })
                      }
                      placeholder="Nom"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="email@exemple.com"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="guest">Invité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Créer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cartes statistiques */}
      <div className="grid lg:grid-cols-3 grid-cols-2 gap-4">
        <CardsList cards={cards} />
      </div>

      {/* Tableau des utilisateurs */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Liste des utilisateurs</h2>
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
}

export default Users;
