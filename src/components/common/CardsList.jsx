import React, { useState } from "react";
import AppCard from "@/components/common/AppCard.jsx";
import { Home, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/useAuth.jsx";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";
import { Card, CardHeader } from "@/components/ui/card.jsx";
import { Button } from "../ui/button";

function CardsList({ type }) {
  const { token } = useAuth();
  const [cards, setCards] = useState([]);

  async function fetchCardData() {
    let tempCards = [];
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
        tempTexte = data[keys[i]] + " m";
      } else {
        tempTexte = data[keys[i]];
      }
      tempCards.push({ titre: keys[i], texte: tempTexte, sousTitre: "" });
    }
    setCards(tempCards);
  }

  if (cards.length === 0) {
    void fetchCardData();
  }

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

        <Button onClick={() => fetchCardData()}>
          <RefreshCw size={16} />
        </Button>
      </div>
    </>
  );
}

export default CardsList;
