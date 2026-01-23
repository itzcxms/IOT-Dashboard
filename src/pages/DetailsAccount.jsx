import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/useAuth.jsx";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Sun,
  ChevronDown,
} from "lucide-react";

function DetailsAccount() {
  const { theme } = useTheme();
  const { user, token } = useAuth();

  // États pour les dropdowns
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);

  // États pour la modification de l'email
  const [email, setEmail] = useState(user?.email || "");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState("");
  const [emailError, setEmailError] = useState("");

  // États pour la modification du mot de passe
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Gestion de la mise à jour de l'email
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError("");
    setEmailSuccess("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/update-email`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Erreur lors de la mise à jour de l'email",
        );
      }

      setEmailSuccess("Email mis à jour avec succès !");
      setIsEditingEmail(false);
    } catch (error) {
      setEmailError(error.message);
    } finally {
      setEmailLoading(false);
    }
  };

  // Gestion de la mise à jour du mot de passe
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères");
      setPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/update-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Erreur lors de la mise à jour du mot de passe",
        );
      }

      setPasswordSuccess("Mot de passe mis à jour avec succès !");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError(error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
        <p className="text-muted-foreground">
          Gérez vos préférences et paramètres de l'application
        </p>
      </div>

      {/* Section Paramètres du compte */}
      <Collapsible open={isAccountOpen} onOpenChange={setIsAccountOpen}>
        <Card>
          <CollapsibleTrigger className="w-full h-full block">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors rounded-lg p-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5" />
                  <div className="flex flex-col gap-1 text-left">
                    <CardTitle>Paramètres du compte</CardTitle>
                    <CardDescription>
                      Modifiez vos informations personnelles et vos identifiants
                      de connexion
                    </CardDescription>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                    isAccountOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Modification de l'email */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base font-medium">Adresse email</Label>
                </div>

                {!isEditingEmail ? (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {user?.email || "Non défini"}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingEmail(true)}
                    >
                      Modifier
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleEmailUpdate} className="space-y-3">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nouvel email"
                      required
                    />
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" disabled={emailLoading}>
                        <Save className="h-4 w-4 mr-1" />
                        {emailLoading ? "Enregistrement..." : "Enregistrer"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditingEmail(false);
                          setEmail(user?.email || "");
                          setEmailError("");
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                )}

                {emailSuccess && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {emailSuccess}
                  </p>
                )}
                {emailError && (
                  <p className="text-sm text-destructive">{emailError}</p>
                )}
              </div>

              <hr className="border-border" />

              {/* Modification du mot de passe */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base font-medium">Mot de passe</Label>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-3">
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Mot de passe actuel"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nouveau mot de passe"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmer le nouveau mot de passe"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Le mot de passe doit contenir au moins 8 caractères
                  </p>

                  <Button type="submit" size="sm" disabled={passwordLoading}>
                    <Lock className="h-4 w-4 mr-1" />
                    {passwordLoading
                      ? "Mise à jour..."
                      : "Mettre à jour le mot de passe"}
                  </Button>
                </form>

                {passwordSuccess && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {passwordSuccess}
                  </p>
                )}
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Section Apparence */}
      <Collapsible open={isAppearanceOpen} onOpenChange={setIsAppearanceOpen}>
        <Card>
          <CollapsibleTrigger className="w-full h-full block">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors rounded-lg p-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Sun className="h-5 w-5" />
                  <div className="flex flex-col gap-1 text-left">
                    <CardTitle>Apparence</CardTitle>
                    <CardDescription>
                      Personnalisez l'apparence de l'application selon vos
                      préférences
                    </CardDescription>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                    isAppearanceOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Thème</Label>
                  <p className="text-sm text-muted-foreground">
                    Mode actuel : {theme === "dark" ? "Sombre" : "Clair"}
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}

export default DetailsAccount;
