import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";



// Composant simple pour les étoiles
const NotationEtoiles = ({ valeur, surChangement }) => {
  const [valeurSurvol, setValeurSurvol] = useState(0);

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((etoile) => (
        <button
          key={etoile}
          type="button"
          // On appelle la fonction pour changer la note
          onClick={() => surChangement(etoile)}
          // Gestion du survol pour l'effet visuel
          onMouseEnter={() => setValeurSurvol(etoile)}
          onMouseLeave={() => setValeurSurvol(0)}
          className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
        >
          <Star
            className={`h-10 w-10 transition-colors ${
              // Si l'étoile est inférieure ou égale à la note (ou au survol), elle est jaune
              etoile <= (valeurSurvol || valeur)
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default function SatisfactionForm() {
  // État pour stocker toutes les données du formulaire
  const [donnees, setDonnees] = useState({
    noteGlobale: 0,
    proprete: "",
    equipements: "",
    recommandation: "",
    commentaires: "",
    nom: "",
    email: "",
  });

  // Fonction pour mettre à jour une valeur
  const changerValeur = (nom, valeur) => {
    setDonnees({
      ...donnees, // On garde les anciennes valeurs
      [nom]: valeur, // On met à jour celle qui a changé
    });
  };

  // Fonction appelée quand on clique sur "Envoyer"
  const envoyerFormulaire = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Petite validation simple
    if (donnees.noteGlobale === 0) {
      alert("Veuillez mettre une note globale (étoiles)");
      return;
    }
    if (!donnees.proprete || !donnees.equipements || !donnees.recommandation) {
      alert("Veuillez répondre à toutes les questions obligatoires");
      return;
    }

    // Tout est bon, on affiche dans la console
    console.log("Données envoyées :", donnees);
    alert("Merci ! Vos réponses ont été enregistrées (voir console).");
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif text-emerald-900 mb-2">
            Aire de Chaumont-sur-Loire
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Votre avis compte ! Aidez-nous à améliorer votre expérience.
          </p>
        </div>

        <Card className="border-gray-200 bg-white shadow-sm rounded-2xl">
          <form onSubmit={envoyerFormulaire}>
            <CardContent className="space-y-8 pt-6">
              
              {/* Question 1 : Note globale */}
              <div className="space-y-3">
                <Label className="text-slate-800 text-base font-medium">
                  Comment évaluez-vous votre expérience globale ?
                </Label>
                <NotationEtoiles
                  valeur={donnees.noteGlobale}
                  surChangement={(valeur) => changerValeur("noteGlobale", valeur)}
                />
              </div>

              {/* Question 2 : Propreté */}
              <div className="space-y-3">
                <Label className="text-slate-800 text-base font-medium">
                  Comment évaluez-vous la propreté des lieux ?
                </Label>
                <RadioGroup
                  value={donnees.proprete}
                  onValueChange={(valeur) => changerValeur("proprete", valeur)}
                  className="space-y-3"
                >
                  <Label htmlFor="proprete-excellent" className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="excellent" id="proprete-excellent" />
                    <span className="flex-1 text-slate-900">Excellent</span>
                  </Label>
                  <Label htmlFor="proprete-bon" className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="bon" id="proprete-bon" />
                    <span className="flex-1 text-slate-900">Bon</span>
                  </Label>
                  <Label htmlFor="proprete-passable" className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="passable" id="proprete-passable" />
                    <span className="flex-1 text-slate-900">Passable</span>
                  </Label>
                  <Label htmlFor="proprete-mediocre" className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="mediocre" id="proprete-mediocre" />
                    <span className="flex-1 text-slate-900">Médiocre</span>
                  </Label>
                </RadioGroup>
              </div>

              {/* Question 3 : Équipements */}
              <div className="space-y-3">
                <Label className="text-slate-800 text-base font-medium">
                  Comment évaluez-vous les équipements et installations ?
                </Label>
                <RadioGroup
                  value={donnees.equipements}
                  onValueChange={(valeur) => changerValeur("equipements", valeur)}
                  className="space-y-3"
                >
                  <Label htmlFor="equipements-excellent" className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="excellent" id="equipements-excellent" />
                    <span className="flex-1 text-slate-900">Excellent</span>
                  </Label>
                  <Label htmlFor="equipements-bon" className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="bon" id="equipements-bon" />
                    <span className="flex-1 text-slate-900">Bon</span>
                  </Label>
                  <Label htmlFor="equipements-passable" className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="passable" id="equipements-passable" />
                    <span className="flex-1 text-slate-900">Passable</span>
                  </Label>
                  <Label htmlFor="equipements-mediocre" className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="mediocre" id="equipements-mediocre" />
                    <span className="flex-1 text-slate-900">Médiocre</span>
                  </Label>
                </RadioGroup>
              </div>

              {/* Question 4 : Recommandation */}
              <div className="space-y-3">
                <Label className="text-slate-800 text-base font-medium">
                  Recommanderiez-vous cet endroit à vos proches ?
                </Label>
                <RadioGroup
                  value={donnees.recommandation}
                  onValueChange={(valeur) => changerValeur("recommandation", valeur)}
                  className="space-y-3"
                >
                  <Label htmlFor="recommandation-oui" className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="oui" id="recommandation-oui" />
                    <span className="flex-1 text-slate-900">Oui, certainement</span>
                  </Label>
                  <Label htmlFor="recommandation-non" className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="non" id="recommandation-non" />
                    <span className="flex-1 text-slate-900">Non</span>
                  </Label>
                </RadioGroup>
              </div>

              {/* Question 5 : Commentaires */}
              <div className="space-y-3">
                <Label className="text-slate-800 text-base font-medium">
                  Commentaires ou suggestions (optionnel)
                </Label>
                <Textarea
                  placeholder="Partagez vos commentaires..."
                  className="min-h-[120px] text-slate-800 bg-white border-gray-200 focus-visible:ring-emerald-500"
                  value={donnees.commentaires}
                  onChange={(e) => changerValeur("commentaires", e.target.value)}
                />
              </div>

              {/* Section optionnelle */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-slate-800 mb-4">
                  Informations optionnelles
                </h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-slate-700">Nom (optionnel)</Label>
                    <Input
                      placeholder="Votre nom"
                      className="bg-white text-slate-800 border-gray-200 focus-visible:ring-emerald-500"
                      value={donnees.nom}
                      onChange={(e) => changerValeur("nom", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">Email (optionnel)</Label>
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      className="bg-white text-slate-800 border-gray-200 focus-visible:ring-emerald-500"
                      value={donnees.email}
                      onChange={(e) => changerValeur("email", e.target.value)}
                    />
                  </div>
                </div>
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
