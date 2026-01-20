import React, { useState, useEffect } from "react";
import {
  User2,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Shield,
  Calendar,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { CanAccess } from "@/components/security/CanAccess.jsx";

// Dialog simplifié (car pas de dialog dans vos composants)
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50">{children}</div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }) => (
  <div
    className={`relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-lg ${className}`}
  >
    {children}
  </div>
);

const DialogHeader = ({ children }) => (
  <div className="flex flex-col space-y-1.5 mb-4">{children}</div>
);

const DialogTitle = ({ children }) => (
  <h2 className="text-xl font-semibold">{children}</h2>
);

const DialogDescription = ({ children }) => (
  <p className="text-sm text-muted-foreground">{children}</p>
);

const DialogFooter = ({ children }) => (
  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
    {children}
  </div>
);

// Composant StatCard
export const StatCard = ({ icon: Icon, title, value, gradient }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Composant UserAvatar
export const UserAvatar = ({ firstName, lastName, isActive }) => (
  <div className="relative">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
      <span className="text-sm font-semibold text-white">
        {firstName[0]}
        {lastName[0]}
      </span>
    </div>
    {isActive && (
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
    )}
  </div>
);

// Composant UserFormDialog
export const UserFormDialog = ({
  open,
  onOpenChange,
  user,
  onSubmit,
  roles,
}) => {
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

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        password: "",
        role_id: user.role_id?._id || "",
        actif: user.actif,
      });
    } else {
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        role_id: roles[0]?._id || "",
        actif: true,
      });
    }
    setError("");
  }, [user, open, roles]);

  const handleSubmit = () => {
    if (
      !formData.nom ||
      !formData.prenom ||
      !formData.email ||
      !formData.role_id
    ) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!user && !formData.password) {
      setError("Le mot de passe est obligatoire pour un nouvel utilisateur");
      return;
    }

    onSubmit(formData, user);
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          </DialogTitle>
          <DialogDescription>
            {user
              ? "Modifiez les informations de l'utilisateur"
              : "Créez un nouveau compte utilisateur"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
                placeholder="Jean"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                placeholder="Dupont"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="jean.dupont@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Mot de passe {user ? "(laisser vide pour ne pas changer)" : "*"}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="pr-10"
                placeholder="••••••••"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle *</Label>
            <Select
              value={formData.role_id}
              onValueChange={(value) =>
                setFormData({ ...formData, role_id: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role._id} value={role._id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
            <Checkbox
              id="actif"
              checked={formData.actif}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, actif: checked })
              }
            />
            <Label htmlFor="actif" className="font-normal cursor-pointer">
              Compte actif
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {user ? "Enregistrer" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Composant DeleteConfirmDialog
export const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  user,
  onConfirm,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <div className="text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserX className="w-8 h-8 text-destructive" />
        </div>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
            <strong className="text-foreground">
              {user?.prenom} {user?.nom}
            </strong>{" "}
            ?
            <br />
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Annuler
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          <UserX className="w-4 h-4" />
          Supprimer
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Composant UserTableRow
export const UserTableRow = ({ user, onEdit, onDelete, getRoleColor }) => (
  <tr className="border-b border-border transition-colors hover:bg-muted/50">
    <td className="p-4">
      <div className="flex items-center gap-3">
        <UserAvatar
          firstName={user.prenom}
          lastName={user.nom}
          isActive={user.actif}
        />
        <div>
          <div className="font-semibold">
            {user.prenom} {user.nom}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Mail className="w-3 h-3" />
            {user.email}
          </div>
        </div>
      </div>
    </td>
    <td className="p-4">
      <div className="flex flex-col gap-2">
        <Badge variant={getRoleColor(user.role_id?.name)}>
          <Shield className="w-3 h-3" />
          {user.role_id?.name || "N/A"}
        </Badge>
        <Badge
          variant={user.actif ? "default" : "destructive"}
          className={user.actif ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {user.actif ? (
            <UserCheck className="w-3 h-3" />
          ) : (
            <UserX className="w-3 h-3" />
          )}
          {user.actif ? "Actif" : "Inactif"}
        </Badge>
      </div>
    </td>
    <td className="p-4 hidden md:table-cell">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4" />
        {new Date(user.createdAt).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </div>
    </td>
    <td className="p-4 text-right">
      <div className="flex items-center justify-end gap-2">
        <CanAccess permission={"users.update"}>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(user)}
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </CanAccess>
        <CanAccess permission={"users.delete"}>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(user)}
            title="Supprimer"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CanAccess>
      </div>
    </td>
  </tr>
);

// Composant EmptyState
export const EmptyState = () => (
  <tr>
    <td colSpan={4} className="p-16 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="p-4 bg-muted rounded-full">
          <User2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="font-medium">Aucun utilisateur trouvé</p>
        <p className="text-sm text-muted-foreground">
          Essayez de modifier vos filtres de recherche
        </p>
      </div>
    </td>
  </tr>
);
