import React, { useEffect, useState, useCallback } from "react";
import CardsList from "@/components/common/CardsList.jsx";
import GraphsZoneInondable from "@/components/common/GraphsZoneInondable.jsx";
import { getObservationsVigicrues } from "@/functions/FonctionsAppelVigicrue.jsx";

function ZoneInondable() {
  const seuilPreco = 1.18;
  const seuilDanger = 1.68;
  const [vigicrueData, setVigicrueData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchVigicruesData = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const data = await getObservationsVigicrues("K447001001", "H");

      // Validation basique des données
      if (!data?.Serie?.ObssHydro || data.Serie.ObssHydro.length === 0) {
        throw new Error("Les données Vigicrues sont invalides ou vides");
      }

      setVigicrueData(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données Vigicrues:",
        error,
      );
      setHasError(true);
      setVigicrueData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVigicruesData();
  }, [fetchVigicruesData]);

  return (
    <>
      <div className="gap-4 flex flex-col">
        {hasError && (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800">
            <p className="font-semibold">
              Erreur lors de la récupération des données
            </p>
            <p className="text-sm">
              Impossible de charger les données de Vigicrues. Veuillez
              réessayer.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
          <CardsList
            type={"sonde"}
            seuilPreco={seuilPreco}
            seuilDanger={seuilDanger}
            vigicrueData={vigicrueData}
            isLoading={isLoading}
            onRefresh={fetchVigicruesData}
          />
        </div>

        {vigicrueData && !hasError && (
          <GraphsZoneInondable
            seuilDanger={seuilDanger}
            vigicrueData={vigicrueData}
          />
        )}
      </div>
    </>
  );
}

export default ZoneInondable;
