import React, { useEffect, useState } from "react";
import GraphCardBar from "@/components/common/GraphCardBar.jsx";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";
import { useAuth } from "@/context/useAuth.jsx";
import SourcesConnaissancesGraph from "@/components/common/SourcesConnaissancesGraph.jsx";

function EvaluationsGraphs({ periode, date = null }) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [cardsEvaluations, setCardsEvaluations] = useState(null);
  const [sourcesData, setSourcesData] = useState(null);
  const correspondanceQuestionTexteCarte = {
    satisfactionAire:
      "Évaluez votre niveau de satisfaction de l'aire de repos de Chaumont-sur-Loire ?",
    satisfactionSecurite:
      'Évaluez votre niveau de satisfaction sur la sécurité de l\'itinéraire "La Loire à Vélo" ?',
    satisfactionServices:
      'Évaluez votre satisfaction sur les services présents le long de l\'itinéraire "La Loire à Vélo" ?',
  };
  const modeleReponse = [
    { label: "Excellent", value: 0, color: "var(--chart-1)" },
    { label: "Bon", value: 0, color: "var(--chart-2)" },
    { label: "Passable", value: 0, color: "var(--chart-3)" },
    { label: "Mauvais", value: 0, color: "var(--chart-4)" },
  ];
  const periodeMap = {
    "Tout temps": "all",
    "Aujourd'hui": "day",
    "7 derniers jours": "week",
    "Ce mois-ci": "month",
    "Cette année": "year",
  };

  async function getEvaluationsData() {
    if (date === null) {
      return generateCallsAPI(
        token,
        "GET",
        "/api/questionnaires/stats/" + periodeMap[periode],
      );
    } else {
      return generateCallsAPI(
        token,
        "POST",
        "/api/questionnaires/stats/" + periodeMap[periode],
        { date: date },
      );
    }
  }

  async function traitementEvaluationsDatas(datas) {
    let tempDatas = [];
    let modele = [...modeleReponse];
    const keys = Object.keys(datas);
    for (let i = 0; i < keys.length; i++) {
      for (let j = 0; j < modele.length; j++) {
        modele[j].value = datas[keys[i]][modele[j].label.toLowerCase()];
      }
      tempDatas.push({
        titre: "Evaluations",
        texte: correspondanceQuestionTexteCarte[keys[i]],
        reponses: modele,
      });
      modele = [...modeleReponse];
    }
    return tempDatas;
  }

  useEffect(() => {
    async function fetchData() {
      let data = await getEvaluationsData();
      let dataCards = await traitementEvaluationsDatas(data["distributions"]);
      console.log(data);

      setSourcesData(data["sourcesConnaissance"]);
      setCardsEvaluations(dataCards);
      setIsLoading(false);
    }

    if (isLoading) {
      void fetchData();
    }
  }, []);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      {cardsEvaluations.map((item, index) => (
        <GraphCardBar
          key={index}
          titre={item.titre}
          texte={item.texte}
          reponses={item.reponses}
        />
      ))}
      <SourcesConnaissancesGraph
        isLoadingGeneralData={isLoading}
        sourcesData={sourcesData}
      />
    </>
  );
}

export default EvaluationsGraphs;
