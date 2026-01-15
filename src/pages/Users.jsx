import React, { useState, useEffect } from "react";
import {
  User2,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  Mail,
  Shield,
  Calendar,
  X,
  Filter,
} from "lucide-react";
import generateCallsAPI from "../functions/GestionnaireCallsAPI";
import { useAuth } from "@/context/useAuth.jsx";

function Users() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    role_id: "",
    actif: true,
  });
  const [showPassword, setShowPassword] = useState(false);
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

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      password: "",
      role_id: roles[0]?._id || "",
      actif: true,
    });
    setError("");
    setSuccessMessage("");
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      password: "",
      role_id: user.role_id?._id || "",
      actif: user.actif,
    });
    setError("");
    setSuccessMessage("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");
    console.log(formData, editingUser);

    // Validation
    if (
      !formData.nom ||
      !formData.prenom ||
      !formData.email ||
      !formData.role_id
    ) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!editingUser && !formData.password) {
      setError("Le mot de passe est obligatoire pour un nouvel utilisateur");
      return;
    }

    try {
      let response;

      if (editingUser) {
        const dataToSend = { ...formData };

        if (!dataToSend.password) {
          delete dataToSend.password;
        }

        response = await generateCallsAPI(
          token,
          "PUT",
          `/api/users/update/${editingUser._id}`,
          dataToSend,
        );
      } else {
        response = await generateCallsAPI(
          token,
          "POST",
          "/api/users/create",
          formData,
        );
      }

      if (response && !response.message?.includes("Erreur")) {
        setSuccessMessage(
          editingUser
            ? "Utilisateur modifié avec succès"
            : "Utilisateur créé avec succès",
        );
        setShowModal(false);
        void loadUsers(); // Recharger la liste
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
        setShowDeleteModal(false);
        setDeletingUser(null);
        loadUsers(); // Recharger la liste
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
      Admin: "bg-purple-500 text-white",
      Manager: "bg-blue-500 text-white",
      Utilisateur: "bg-gray-500 text-white",
    };
    return colors[roleName] || "bg-gray-500 text-white";
  };

  // Masquer les messages de succès après 3 secondes
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-lg text-slate-600 font-medium">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Message de succès global */}
        {successMessage && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
            <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
              <UserCheck className="w-5 h-5" />
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Message d'erreur global */}
        {error && !showModal && !showDeleteModal && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                !
              </div>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Gestion des utilisateurs
            </h1>
            <p className="text-slate-600 mt-1">
              Gérez les comptes et les permissions
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Nouvel utilisateur
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg p-6 border border-slate-100 hover:shadow-xl transition-shadow duration-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <User2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total utilisateurs
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg p-6 border border-slate-100 hover:shadow-xl transition-shadow duration-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Actifs</p>
                <p className="text-3xl font-bold text-slate-900">
                  {users.filter((u) => u.actif).length}
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg p-6 border border-slate-100 hover:shadow-xl transition-shadow duration-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <UserX className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Inactifs</p>
                <p className="text-3xl font-bold text-slate-900">
                  {users.filter((u) => !u.actif).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par nom, prénom ou email..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filtres
            </button>

            <div
              className={`flex flex-col lg:flex-row gap-4 ${showFilters ? "flex" : "hidden lg:flex"}`}
            >
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              >
                <option value="">Tous les rôles</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              >
                <option value="">Tous les statuts</option>
                <option value="actif">Actifs</option>
                <option value="inactif">Inactifs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Rôle & Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider hidden md:table-cell">
                    Création
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-slate-100 rounded-full">
                          <User2 className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-medium">
                          Aucun utilisateur trouvé
                        </p>
                        <p className="text-sm text-slate-500">
                          Essayez de modifier vos filtres de recherche
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-lg">
                                {user.prenom[0]}
                                {user.nom[0]}
                              </span>
                            </div>
                            {user.actif && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {user.prenom} {user.nom}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-slate-600 mt-0.5">
                              <Mail className="w-3.5 h-3.5" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg w-fit ${getRoleColor(user.role_id?.name)}`}
                          >
                            <Shield className="w-3.5 h-3.5" />
                            {user.role_id?.name || "N/A"}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg w-fit ${
                              user.actif
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.actif ? (
                              <UserCheck className="w-3.5 h-3.5" />
                            ) : (
                              <UserX className="w-3.5 h-3.5" />
                            )}
                            {user.actif ? "Actif" : "Inactif"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(user.createdAt).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingUser(user);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Créer/Modifier */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingUser
                    ? "Modifier l'utilisateur"
                    : "Nouvel utilisateur"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
                    <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      !
                    </div>
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) =>
                        setFormData({ ...formData, prenom: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) =>
                        setFormData({ ...formData, nom: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mot de passe{" "}
                    {editingUser ? "(laisser vide pour ne pas changer)" : "*"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-slate-600" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Rôle *
                  </label>
                  <select
                    value={formData.role_id}
                    onChange={(e) =>
                      setFormData({ ...formData, role_id: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  >
                    <option value="">Sélectionner un rôle</option>
                    {roles.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="actif"
                    checked={formData.actif}
                    onChange={(e) =>
                      setFormData({ ...formData, actif: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="actif"
                    className="text-sm font-medium text-slate-700"
                  >
                    Compte actif
                  </label>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-slate-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                >
                  {editingUser ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Suppression */}
        {showDeleteModal && deletingUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
                  Confirmer la suppression
                </h2>
                <p className="text-slate-600 text-center mb-6">
                  Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
                  <strong className="text-slate-900">
                    {deletingUser.prenom} {deletingUser.nom}
                  </strong>{" "}
                  ? Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeletingUser(null);
                    }}
                    className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
