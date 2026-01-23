import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";
import { useAuth } from "@/context/useAuth.jsx";

// Options pour la question "Comment avez-vous connu La Loire à Vélo"
const sourcesConnaissance = [
  { id: "presse", label: "Presse écrite" },
  { id: "television", label: "Télévision" },
  {
    id: "sites-institutionnels",
    label:
      "Sites Internet institutionnels (office de tourisme, Loire à vélo...)",
  },
  { id: "guides-voyage", label: "Guides de voyage (ex: le Routard)" },
  { id: "reseaux-sociaux", label: "Réseaux Sociaux" },
  { id: "recommandations", label: "Recommandations (amis, famille...)" },
  { id: "autre", label: "Autre" },
];

export default function SatisfactionForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  // État pour stocker toutes les données du formulaire
  const [donnees, setDonnees] = useState({
    satisfactionAire: "",
    satisfactionSecurite: "",
    satisfactionServices: "",
    sourcesConnaissance: [],
    autreSource: "",
    remarques: "",
  });

  async function setRating(rating) {
    return generateCallsAPI(token, "POST", "/api/questionnaires", rating);
  }

  // Fonction pour mettre à jour une valeur simple
  const changerValeur = (nom, valeur) => {
    setDonnees({
      ...donnees,
      [nom]: valeur,
    });
  };

  // Fonction pour gérer les checkboxes (sources de connaissance)
  const toggleSource = (sourceId) => {
    const sources = donnees.sourcesConnaissance;
    if (sources.includes(sourceId)) {
      changerValeur(
        "sourcesConnaissance",
        sources.filter((s) => s !== sourceId),
      );
    } else {
      changerValeur("sourcesConnaissance", [...sources, sourceId]);
    }
  };

  // Fonction appelée quand on clique sur "Envoyer"
  async function envoyerFormulaire(e) {
    e.preventDefault();

    // Validation simple
    if (
      !donnees.satisfactionAire ||
      !donnees.satisfactionSecurite ||
      !donnees.satisfactionServices
    ) {
      alert(
        "Veuillez répondre à toutes les questions de satisfaction obligatoires",
      );
      return;
    }

    let tempDonnees = { ...donnees };

    if (
      tempDonnees.sourcesConnaissance.includes("autre") &&
      tempDonnees.autreSource === ""
    ) {
      tempDonnees.sourcesConnaissance.filter((s) => s !== "autre");
    } else if (
      !tempDonnees.sourcesConnaissance.includes("autre") &&
      !tempDonnees.autreSource === ""
    ) {
      tempDonnees.autreSource = "";
    }

    const res = await setRating(tempDonnees);

    if (Object.keys(res).includes("status")) {
      alert("Une erreur est survenue lors de l'envoi du formulaire.");
    } else {
      alert("Merci ! Vos réponses ont été enregistrées.");
      navigate("/");
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif text-emerald-900 mb-2">
            La Loire à Vélo
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Votre avis compte ! Aidez-nous à améliorer votre expérience.
          </p>
        </div>

        <Card className="border-gray-200 bg-white shadow-sm rounded-2xl">
          <form onSubmit={(e) => envoyerFormulaire(e)}>
            <CardContent className="space-y-8 pt-6">
              {/* Question 1 : Satisfaction aire de repos */}
              <div className="space-y-3">
                <Label className="text-slate-800 text-base font-medium">
                  Évaluez votre niveau de satisfaction de l'aire de repos de
                  Chaumont-sur-Loire ?
                </Label>
                <RadioGroup
                  value={donnees.satisfactionAire}
                  onValueChange={(valeur) =>
                    changerValeur("satisfactionAire", valeur)
                  }
                  className="space-y-3"
                >
                  <Label
                    htmlFor="aire-excellent"
                    className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="excellent" id="aire-excellent" />
                    <span className="flex-1 text-slate-900">Excellent</span>
                  </Label>
                  <Label
                    htmlFor="aire-bon"
                    className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="bon" id="aire-bon" />
                    <span className="flex-1 text-slate-900">Bon</span>
                  </Label>
                  <Label
                    htmlFor="aire-passable"
                    className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="passable" id="aire-passable" />
                    <span className="flex-1 text-slate-900">Passable</span>
                  </Label>
                  <Label
                    htmlFor="aire-mauvais"
                    className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="mauvais" id="aire-mauvais" />
                    <span className="flex-1 text-slate-900">Mauvais</span>
                  </Label>
                </RadioGroup>
              </div>

              {/* Question 2 : Sécurité */}
              <div className="space-y-3">
                <Label className="text-slate-800 text-base font-medium">
                  Évaluez votre niveau de satisfaction sur la sécurité de
                  l'itinéraire "La Loire à Vélo" ?
                </Label>
                <RadioGroup
                  value={donnees.satisfactionSecurite}
                  onValueChange={(valeur) =>
                    changerValeur("satisfactionSecurite", valeur)
                  }
                  className="space-y-3"
                >
                  <Label
                    htmlFor="securite-excellent"
                    className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="excellent" id="securite-excellent" />
                    <span className="flex-1 text-slate-900">Excellent</span>
                  </Label>
                  <Label
                    htmlFor="securite-bon"
                    className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="bon" id="securite-bon" />
                    <span className="flex-1 text-slate-900">Bon</span>
                  </Label>
                  <Label
                    htmlFor="securite-passable"
                    className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="passable" id="securite-passable" />
                    <span className="flex-1 text-slate-900">Passable</span>
                  </Label>
                  <Label
                    htmlFor="securite-mauvais"
                    className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="mauvais" id="securite-mauvais" />
                    <span className="flex-1 text-slate-900">Mauvais</span>
                  </Label>
                </RadioGroup>
              </div>

              {/* Question 3 : Services */}
              <div className="space-y-3">
                <Label className="text-slate-800 text-base font-medium">
                  Évaluez votre satisfaction sur les services présents le long
                  de l'itinéraire "La Loire à Vélo" ?
                </Label>
                <RadioGroup
                  value={donnees.satisfactionServices}
                  onValueChange={(valeur) =>
                    changerValeur("satisfactionServices", valeur)
                  }
                  className="space-y-3"
                >
                  <Label
                    htmlFor="services-excellent"
                    className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="excellent" id="services-excellent" />
                    <span className="flex-1 text-slate-900">Excellent</span>
                  </Label>
                  <Label
                    htmlFor="services-bon"
                    className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="bon" id="services-bon" />
                    <span className="flex-1 text-slate-900">Bon</span>
                  </Label>
                  <Label
                    htmlFor="services-passable"
                    className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="passable" id="services-passable" />
                    <span className="flex-1 text-slate-900">Passable</span>
                  </Label>
                  <Label
                    htmlFor="services-mauvais"
                    className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <RadioGroupItem value="mauvais" id="services-mauvais" />
                    <span className="flex-1 text-slate-900">Mauvais</span>
                  </Label>
                </RadioGroup>
              </div>

              {/* Question 4 : Sources de connaissance (checkboxes) */}
              <div className="space-y-3">
                <Label className="text-slate-800 text-base font-medium flex flex-col items-start">
                  Comment avez-vous eu connaissance de "La Loire à Vélo", et qui
                  vous a donné envie de la découvrir ?
                  <span className="text-gray-500 font-normal text-xs block mt-1">
                    (plusieurs réponses possibles)
                  </span>
                </Label>
                <div className="space-y-3">
                  {sourcesConnaissance.map((source) => (
                    <Label
                      key={source.id}
                      htmlFor={`source-${source.id}`}
                      className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer"
                    >
                      <Checkbox
                        id={`source-${source.id}`}
                        checked={donnees.sourcesConnaissance.includes(
                          source.id,
                        )}
                        onCheckedChange={() => toggleSource(source.id)}
                      />
                      <span className="flex-1 text-slate-900">
                        {source.label}
                      </span>
                    </Label>
                  ))}
                </div>

                {/* Champ "Autre" conditionnel */}
                {donnees.sourcesConnaissance.includes("autre") && (
                  <Input
                    placeholder="Précisez..."
                    className="mt-3 !bg-white text-slate-800 border-gray-200 focus-visible:ring-emerald-500"
                    value={donnees.autreSource}
                    onChange={(e) =>
                      changerValeur("autreSource", e.target.value)
                    }
                  />
                )}
              </div>

              {/* Question 5 : Remarques et suggestions */}
              <div className="space-y-3">
                <Label className="text-slate-800 text-base font-medium">
                  Avez-vous des remarques ou suggestions sur votre expérience le
                  long de "La Loire à Vélo" ?
                </Label>
                <Textarea
                  placeholder="Partagez vos remarques et suggestions..."
                  className="min-h-[120px] text-slate-800 !bg-white border-gray-200 focus-visible:ring-emerald-500"
                  value={donnees.remarques}
                  onChange={(e) => changerValeur("remarques", e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-center mt-6 pb-8">
              <button
                type="submit"
                className="rounded-lg bg-emerald-800 px-12 py-3 text-base font-medium text-white hover:bg-emerald-900 transition-colors w-full sm:w-auto"
              >
                Envoyer le questionnaire
              </button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Merci de prendre le temps de nous faire part de votre avis !</p>
        </div>
      </div>
    </main>
  );
}
