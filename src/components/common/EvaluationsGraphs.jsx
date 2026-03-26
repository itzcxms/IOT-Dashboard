import React, { useEffect, useState } from "react";
import GraphCardBar from "@/components/common/GraphCardBar.jsx";
import generateCallsAPI from "@/functions/GestionnaireCallsAPI.jsx";
import { useAuth } from "@/context/useAuth.jsx";
import SourcesConnaissancesGraph from "@/components/common/SourcesConnaissancesGraph.jsx";

function EvaluationsGraphs({ isLoadingGeneral, periode, date }) {
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
  const periodeMap = {
    "Tout temps": "all",
    "Aujourd'hui": "day",
    "7 derniers jours": "week",
    "Ce mois-ci": "month",
    "Cette année": "year",
  };

  async function getEvaluationsData() {
    if (periode === "Tout temps") {
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
    let modele = [];
    let label = "";
    let dataKeys = [];
    const keys = Object.keys(datas);
    for (let i = 0; i < keys.length; i++) {
      dataKeys = Object.keys(datas[keys[i]]);
      for (let j = 0; j < dataKeys.length; j++) {
        label = dataKeys[j];
        label = label.replaceAll("-", " ");
        modele.push({
          label: label.charAt(0).toUpperCase() + label.slice(1),
          value: 0,
          color: "var(--chart-" + (j + 1) + ")",
        });
        modele[j].value = datas[keys[i]][dataKeys[j]];
      }
      tempDatas.push({
        titre: "Evaluations",
        texte: correspondanceQuestionTexteCarte[keys[i]],
        reponses: modele,
      });
      dataKeys = [];
      modele = [];
    }
    return tempDatas;
  }

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let data = await getEvaluationsData();
      let dataCards = await traitementEvaluationsDatas(data["distributions"]);

      setSourcesData(data["sourcesConnaissance"]);
      setCardsEvaluations(dataCards);
      setIsLoading(false);
    }

    void fetchData();
  }, [periode, date, token]);

  if (isLoading || isLoadingGeneral) {
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
