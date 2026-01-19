import React, { useState, useEffect } from "react";
import { User2, Plus, UserCheck, X } from "lucide-react";
import generateCallsAPI from "../functions/GestionnaireCallsAPI";
import { useAuth } from "@/context/useAuth.jsx";

// Import des composants UI
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import des composants Users
import {
  StatCard,
  UserFormDialog,
  DeleteConfirmDialog,
} from "../components/users/UserComponents";
import { UsersFilters } from "../components/users/UsersFilters";
import { UsersTable } from "../components/users/UsersTable";

function Users() {
  const { token } = useAuth();

  // États
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Charger les utilisateurs
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await generateCallsAPI(token, "GET", "/api/users/all");

      if (response && Array.isArray(response)) {
        setUsers(response);
      } else {
        console.error("Format de réponse inattendu:", response);
        setUsers([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  // Charger les rôles
  const loadRoles = async () => {
    try {
      const response = await generateCallsAPI(token, "GET", "/api/roles/all");

      if (response && Array.isArray(response)) {
        setRoles(response);
      } else {
        console.error("Format de réponse inattendu pour les rôles:", response);
        setRoles([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des rôles:", error);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    void loadUsers();
    void loadRoles();
  }, []);

  // Filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole = !filterRole || user.role_id?._id === filterRole;
    const matchStatus =
      filterStatus === "" ||
      (filterStatus === "actif" && user.actif) ||
      (filterStatus === "inactif" && !user.actif);

    return matchSearch && matchRole && matchStatus;
  });

  // Handlers
  const handleCreate = () => {
    setEditingUser(null);
    setShowUserDialog(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowUserDialog(true);
  };

  const handleSubmit = async (formData, user) => {
    setError("");
    setSuccessMessage("");

    try {
      let response;

      if (user) {
        // Modification
        const dataToSend = { ...formData };
        if (!dataToSend.password) {
          delete dataToSend.password;
        }

        response = await generateCallsAPI(
          token,
          "PUT",
          `/api/users/update/${user._id}`,
          dataToSend,
        );
      } else {
        // Création
        response = await generateCallsAPI(
          token,
          "POST",
          "/api/users/create",
          formData,
        );
      }

      if (response && !response.message?.includes("Erreur")) {
        setSuccessMessage(
          user
            ? "Utilisateur modifié avec succès"
            : "Utilisateur créé avec succès",
        );
        setShowUserDialog(false);
        void loadUsers();
      } else {
        setError(response?.message || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      setError("Erreur lors de l'enregistrement de l'utilisateur");
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;

    try {
      const response = await generateCallsAPI(
        token,
        "DELETE",
        `/api/users/delete/user/${deletingUser._id}`,
      );

      if (response && response.message === "Supprimé") {
        setSuccessMessage("Utilisateur supprimé avec succès");
        setShowDeleteDialog(false);
        setDeletingUser(null);
        void loadUsers();
      } else {
        setError(response?.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setError("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const getRoleColor = (roleName) => {
    const colors = {
      Admin: "destructive",
      Manager: "default",
      Utilisateur: "secondary",
    };
    return colors[roleName] || "secondary";
  };

  // Masquer les messages de succès après 3 secondes
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-lg text-muted-foreground font-medium">
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Message de succès */}
        {successMessage && (
          <Alert className="bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100">
            <UserCheck className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between w-full">
              <span>{successMessage}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSuccessMessage("")}
                className="h-5 w-5 -mr-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Message d'erreur global */}
        {error && !showUserDialog && !showDeleteDialog && (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  !
                </div>
                <span>{error}</span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setError("")}
                className="h-5 w-5 -mr-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Gestion des utilisateurs
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez les comptes et les permissions
            </p>
          </div>
          <Button onClick={handleCreate} size="lg">
            <Plus className="w-4 h-4" />
            Nouvel utilisateur
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={User2}
            title="Total utilisateurs"
            value={users.length}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            icon={UserCheck}
            title="Actifs"
            value={users.filter((u) => u.actif).length}
            gradient="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            icon={UserCheck}
            title="Inactifs"
            value={users.filter((u) => !u.actif).length}
            gradient="bg-gradient-to-br from-red-500 to-red-600"
          />
        </div>

        {/* Filtres */}
        <UsersFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          roles={roles}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {/* Table des utilisateurs */}
        <UsersTable
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={(user) => {
            setDeletingUser(user);
            setShowDeleteDialog(true);
          }}
          getRoleColor={getRoleColor}
        />

        {/* Dialogs */}
        <UserFormDialog
          open={showUserDialog}
          onOpenChange={setShowUserDialog}
          user={editingUser}
          onSubmit={handleSubmit}
          roles={roles}
        />

        <DeleteConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          user={deletingUser}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}

export default Users;
