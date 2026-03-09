import React, { useEffect, useState } from "react";
import GraphCardBar from "@/components/common/GraphCardBar.jsx";

function SourcesConnaissancesGraph({ isLoadingGeneralData, sourcesData }) {
  const [isLoading, setIsLoading] = useState(true);
  const [sourcesConnaissance, setSourcesConnaissances] = useState(null);
  const modeleSources = {
    titre: "Sources de découverte",
    texte: 'Comment avez-vous eu connaissance de "La Loire à Vélo" ?',
    reponses: [],
  };

  async function traitementSourcesDatas(datas) {
    const keys = Object.keys(datas);
    let tempLabel = "";
    let modele = { ...modeleSources };
    let count = 1;
    for (let i = 0; i < keys.length; i++) {
      if (count > 5) {
        count = 1;
      }
      tempLabel = keys[i];
      tempLabel = tempLabel.replace("-", " ");
      tempLabel = tempLabel.charAt(0).toUpperCase() + tempLabel.slice(1);
      modele.reponses.push({
        label: tempLabel,
        value: datas[keys[i]],
        color: "var(--chart-" + count + ")",
      });
      count++;
    }
    await setSourcesConnaissances(modele);
  }

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      await traitementSourcesDatas(sourcesData);
      setIsLoading(false);
    }

    if (!isLoadingGeneralData) {
      void fetchData();
    }
  }, []);

  if (isLoading || isLoadingGeneralData) {
    return <div>Chargement...</div>;
  }

  return (
    <GraphCardBar
      titre={sourcesConnaissance.titre}
      texte={sourcesConnaissance.texte}
      reponses={sourcesConnaissance.reponses}
    />
  );
}

export default SourcesConnaissancesGraph;
