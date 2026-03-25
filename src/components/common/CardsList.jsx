import React, { useState, useEffect, useCallback } from "react";
import AppCard from "@/components/common/AppCard.jsx";
import { Home, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/useAuth.jsx";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";
import { Card, CardHeader } from "@/components/ui/card.jsx";
import { Button } from "../ui/button";

function CardsList({ type, seuilPreco = null, seuilDanger = null, vigicrueData = null, isLoading = false, onRefresh = null }) {
  const { token } = useAuth();
  const [cards, setCards] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isFetchingFallback, setIsFetchingFallback] = useState(false);

  const fetchCardData = useCallback(async () => {
    try {
      setHasError(false);
      let tempCards = [];
      let hauteur = null;

      // Si vigicrueData est fourni ET contient des données, l'utiliser directement
      if (vigicrueData?.Serie?.ObssHydro && vigicrueData.Serie.ObssHydro.length > 0) {
        const lastObs = vigicrueData.Serie.ObssHydro[vigicrueData.Serie.ObssHydro.length - 1];
        if (lastObs?.ResObsHydro !== undefined) {
          hauteur = parseFloat(lastObs.ResObsHydro);
          tempCards.push({
            titre: "Hauteur",
            texte: hauteur + " m",
            sousTitre: ""
          });
        }
      } else if (vigicrueData === null && token) {
        // Fallback: uniquement si vigicrueData n'est pas disponible ET token existe
        // (i.e., composant utilisé en dehors de ZoneInondable)
        setIsFetchingFallback(true);
        const data = await generateCallsAPI(
          token,
          "POST",
          "/api/graphs/capteurs/lastinfo",
          { type: type },
        );
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          let tempTexte = "";
          if (keys[i] === "haut") {
            hauteur = data[keys[i]];
            tempTexte = data[keys[i]] + " m";
          } else {
            tempTexte = data[keys[i]];
          }
          tempCards.push({ titre: keys[i], texte: tempTexte, sousTitre: "" });
        }
        setIsFetchingFallback(false);
      } else if (!vigicrueData?.Serie?.ObssHydro) {
        // Pas de données et pas de fallback possible
        tempCards.push({
          titre: "Hauteur",
          texte: "N/A",
          sousTitre: "Aucune donnée"
        });
      }

      // Ajouter le statut de zone inondable
      if (seuilPreco !== null && seuilDanger !== null && hauteur !== null) {
        tempCards.push({
          titre: "Zone inondable",
          texte:
            seuilPreco <= hauteur
              ? seuilDanger <= hauteur
                ? "Dangereux"
                : "Attention"
              : "Ok",
          sousTitre: "",
        });
      }
      setCards(tempCards);
    } catch (error) {
      console.error("Erreur lors de la récupération des données CardsList:", error);
      setHasError(true);
      setCards([
        {
          titre: "Erreur",
          texte: "Impossible de récupérer les données",
          sousTitre: ""
        }
      ]);
    }
  }, [vigicrueData, token, type, seuilPreco, seuilDanger]);

  useEffect(() => {
    if (!isLoading && !isFetchingFallback) {
      fetchCardData();
    }
  }, [vigicrueData, isLoading, isFetchingFallback, fetchCardData]);

  return (
    <>
      {cards.map((item, key) => (
        <AppCard
          key={key}
          titre={item.titre}
          texte={item.texte}
          sousTitre={item.sousTitre}
        />
      ))}
      <div
        className={"flex items-end"}
        data-slot="refresh-slot"
        data-slot-refresh="true"
      >
        <Button
          onClick={() => onRefresh ? onRefresh() : fetchCardData()}
          disabled={isLoading || isFetchingFallback}
          className={"border-1 border-button-border bg-primary"}
        >
          <RefreshCw size={16} />
        </Button>
      </div>
    </>
  );
}

export default CardsList;
