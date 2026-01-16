import React from "react";
import { Home } from "lucide-react";
import CardsList from "@/components/common/CardsList.jsx";
import Graphs from "@/components/common/Graphs.jsx";
import PageTitle from "../components/common/PageTitle";
import GraphCardPie from "@/components/common/GraphCardPie.jsx";
import GraphCardBar from "@/components/common/GraphCardBar.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import GraphRadar from "@/components/common/GraphRadar";

function AnalyseSatisfaction() {
  // Questions 1-3 : Évaluations (Pie charts)
  const cardsEvaluations = [
    {
      titre: "Évaluations",
      texte: "Évaluez votre niveau de satisfaction de l'aire de repos de Chaumont-sur-Loire ?",
      reponses: [
        { label: "Excellent", value: 275, color: "var(--chart-1)" },
        { label: "Bon", value: 200, color: "var(--chart-2)" },
        { label: "Passable", value: 187, color: "var(--chart-3)" },
        { label: "Médiocre", value: 173, color: "var(--chart-4)" },
      ]
    },
    {
      titre: "Évaluations",
      texte: "Évaluez votre niveau de satisfaction sur la sécurité de l'itinéraire \"La Loire à Vélo\" ?",
      reponses: [
        { label: "Excellent", value: 275, color: "var(--chart-1)" },
        { label: "Bon", value: 200, color: "var(--chart-2)" },
        { label: "Passable", value: 187, color: "var(--chart-3)" },
        { label: "Médiocre", value: 173, color: "var(--chart-4)" },
      ]
    },
    {
      titre: "Évaluations",
      texte: "Évaluez votre satisfaction sur les services présents le long de l'itinéraire \"La Loire à Vélo\" ?",
      reponses: [
        { label: "Excellent", value: 275, color: "var(--chart-1)" },
        { label: "Bon", value: 200, color: "var(--chart-2)" },
        { label: "Passable", value: 187, color: "var(--chart-3)" },
        { label: "Médiocre", value: 173, color: "var(--chart-4)" },
      ]
    },
  ];

  // Question 4 : Sources de connaissance (Bar chart)
  const sourcesConnaissance = {
    titre: "Sources de découverte",
    texte: "Comment avez-vous eu connaissance de \"La Loire à Vélo\" ?",
    reponses: [
      { label: "Presse écrite", value: 45, color: "var(--chart-1)" },
      { label: "Télévision", value: 32, color: "var(--chart-2)" },
      { label: "Sites institutionnels", value: 128, color: "var(--chart-3)" },
      { label: "Guides de voyage", value: 67, color: "var(--chart-4)" },
      { label: "Réseaux Sociaux", value: 89, color: "var(--chart-5)" },
      { label: "Recommandations", value: 156, color: "var(--chart-1)" },
      { label: "Autre", value: 23, color: "var(--chart-2)" },
    ]
  };

  // Question 5 : Remarques et suggestions
  const suggestions = [
    { id: 1, date: "15/01/2026", texte: "Super expérience sur la Loire à Vélo ! Les paysages sont magnifiques." },
    { id: 2, date: "14/01/2026", texte: "La signalétique pourrait être améliorée à certains endroits." },
    { id: 3, date: "13/01/2026", texte: "Aire de repos très propre et bien entretenue, merci !" },
    { id: 4, date: "12/01/2026", texte: "Il manque des points d'eau potable sur le parcours." },
    { id: 5, date: "11/01/2026", texte: "Excellent itinéraire, je recommande vivement." },
  ];

  return (
    <>
      {/* Nom de la page */}
      <PageTitle>Analyse Satisfaction</PageTitle>

      <div className="gap-5 flex flex-col">
        {/* Questions 1-4 : Grille 2x2 (desktop) / 1x4 (mobile) */}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          {cardsEvaluations.map((item, index) => (
            <GraphCardBar key={index} titre={item.titre} texte={item.texte} reponses={item.reponses} />
          ))}
          <GraphCardBar 
            titre={sourcesConnaissance.titre} 
            texte={sourcesConnaissance.texte} 
            reponses={sourcesConnaissance.reponses} 
          />
        </div>

        {/* Question 5 : Tableau des remarques et suggestions */}
        <Card>
          <CardContent className="gap-4 flex flex-col">
            <div className="flex-col flex gap-2">
              <span className="text-base font-semibold">Remarques et suggestions</span>
              <span className="text-sm font-normal text-muted-foreground">
                Avez-vous des remarques ou suggestions sur votre expérience le long de "La Loire à Vélo" ?
              </span>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">N°</TableHead>
                    <TableHead className="w-30">Date</TableHead>
                    <TableHead>Commentaire</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestions.length > 0 ? (
                    suggestions.map((suggestion) => (
                      <TableRow key={suggestion.id}>
                        <TableCell className="font-medium">{suggestion.id}</TableCell>
                        <TableCell>{suggestion.date}</TableCell>
                        <TableCell>{suggestion.texte}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        Aucune remarque pour le moment.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-center">
              <span className="text-sm font-medium">
                Total : {suggestions.length} remarque{suggestions.length > 1 ? "s" : ""}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default AnalyseSatisfaction;
