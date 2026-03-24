/**
 * Service pour interagir avec l'API Vigicrues
 */

const VIGICRUES_BASE_URL = "https://www.vigicrues.gouv.fr/services";

/**
 * Récupère les données d'observation pour une station donnée
 * @param {string} codeStation - Code de la station (ex: 'K437001001')
 * @param {string} grandeurHydro - Type de mesure ('H' pour hauteur, 'Q' pour débit)
 * @returns {Promise<Object>} Données d'observation
 */
export async function getObservationsVigicrues(
  codeStation,
  grandeurHydro = "H",
  debut = null,
  fin = null,
) {
  if (debut === null) {
    debut = new Date().setHours(0, 0, 0, 0);
    debut = new Date(debut);
  }
  if (fin === null) {
    fin = new Date();
  }
  console.log(debut, fin);
  try {
    // Format de date requis par Vigicrues: YYYY-MM-DDTHH:mm:ss.sssZ
    const formatDate = (date) => {
      return date.toISOString();
    };

    const url = `${VIGICRUES_BASE_URL}/observations.json?CdStationHydro=${codeStation}&GrdSerie=${grandeurHydro}&DtObsDebut=${formatDate(debut)}&DtObsFin=${formatDate(fin)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des observations Vigicrues:",
      error,
    );
    throw error;
  }
}

/**
 * Récupère les prévisions pour une station donnée
 * @param {string} codeStation - Code de la station
 * @param {string} grandeurHydro - Type de mesure ('H' pour hauteur, 'Q' pour débit)
 * @returns {Promise<Object>} Données de prévisions
 */
export async function getPrevisions(codeStation, grandeurHydro = "H") {
  try {
    const url = `${VIGICRUES_BASE_URL}/previsions.json?CdStationHydro=${codeStation}&GrdSerie=${grandeurHydro}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des prévisions Vigicrues:",
      error,
    );
    throw error;
  }
}

/**
 * Récupère la liste des stations disponibles
 * @returns {Promise<Object>} Liste des stations
 */
export async function getStationsVigicrues() {
  try {
    const url = `${VIGICRUES_BASE_URL}/stations.json`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des stations Vigicrues:",
      error,
    );
    throw error;
  }
}

/**
 * Traite les données d'observation pour les adapter au format du graphique
 * @param {Object} data - Données brutes de Vigicrues
 * @returns {Array} Données formatées pour le graphique
 */
export function formatObservationsForChart(data) {
  if (!data?.Serie?.ObssHydro) {
    return [];
  }

  return data.Serie.ObssHydro.map((obs) => ({
    heure: new Date(obs.DtObsHydro).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    haut: parseFloat(obs.ResObsHydro),
    timestamp: obs.DtObsHydro,
  }));
}

/**
 * Obtient la dernière valeur d'observation
 * @param {Object} data - Données brutes de Vigicrues
 * @returns {number|null} Dernière valeur ou null
 */
export function getLatestObservation(data) {
  if (!data?.Serie?.ObssHydro || data.Serie.ObssHydro.length === 0) {
    return null;
  }

  const latest = data.Serie.ObssHydro[data.Serie.ObssHydro.length - 1];
  return parseFloat(latest.ResObsHydro);
}

/**
 * Agrège les données par heure (moyenne)
 * @param {Object} data - Données brutes de Vigicrues
 * @returns {Array} Données agrégées par heure
 */
export function aggregateByHour(data) {
  return aggregateObservationsByInterval(data, "hour", "average");
}

/**
 * Agrège les données par jour (moyenne)
 * @param {Object} data - Données brutes de Vigicrues
 * @returns {Array} Données agrégées par jour
 */
export function aggregateByDay(data) {
  return aggregateObservationsByInterval(data, "day", "average");
}

/**
 * Agrège les données par tranche de 15 minutes (moyenne)
 * @param {Object} data - Données brutes de Vigicrues
 * @returns {Array} Données agrégées par 15 minutes
 */
export function aggregateBy15Minutes(data) {
  return aggregateObservationsByInterval(data, "15min", "average");
}

/**
 * Obtient les valeurs min/max par jour
 * @param {Object} data - Données brutes de Vigicrues
 * @returns {Array} Données avec min et max par jour
 */
export function getDailyMinMax(data) {
  if (!data?.Serie?.ObssHydro) {
    return [];
  }

  const dailyData = {};

  data.Serie.ObssHydro.forEach((obs) => {
    const date = new Date(obs.DtObsHydro).toISOString().split("T")[0];
    const value = parseFloat(obs.ResObsHydro);

    if (!dailyData[date]) {
      dailyData[date] = {
        min: value,
        max: value,
        values: [],
      };
    }

    dailyData[date].min = Math.min(dailyData[date].min, value);
    dailyData[date].max = Math.max(dailyData[date].max, value);
    dailyData[date].values.push(value);
  });

  return Object.entries(dailyData).map(([date, stats]) => ({
    date,
    min: Number(stats.min.toFixed(2)),
    max: Number(stats.max.toFixed(2)),
    average: Number(
      (
        stats.values.reduce((sum, v) => sum + v, 0) / stats.values.length
      ).toFixed(2),
    ),
    count: stats.values.length,
  }));
}

/**
 * Agrège les données d'observation par intervalle de temps
 * @param {Object} data - Données brutes de Vigicrues
 * @param {string} interval - Intervalle d'agrégation ('hour', 'day', '15min', '30min', etc.)
 * @param {string} aggregationType - Type d'agrégation ('average', 'min', 'max', 'first', 'last')
 * @returns {Array} Données agrégées
 */
/**
 * Agrège les données d'observation par intervalle de temps
 * @param {Object} data - Données brutes de Vigicrues
 * @param {string} interval - Intervalle d'agrégation ('hour', 'day', '15min', '30min', etc.)
 * @param {string} aggregationType - Type d'agrégation ('average', 'min', 'max', 'first', 'last')
 * @returns {Array} Données agrégées
 */
export function aggregateObservationsByInterval(
  data,
  interval = "hour",
  aggregationType = "average",
) {
  if (!data?.Serie?.ObssHydro) {
    return [];
  }

  // Fonction pour obtenir la clé d'intervalle (pour le regroupement)
  const getIntervalKey = (date, interval) => {
    const d = new Date(date);

    switch (interval) {
      case "hour":
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:00`;

      case "day":
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      case "month":
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      case "15min":
        const minutes15 = Math.floor(d.getMinutes() / 15) * 15;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(minutes15).padStart(2, "0")}`;

      case "30min":
        const minutes30 = Math.floor(d.getMinutes() / 30) * 30;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(minutes30).padStart(2, "0")}`;

      default:
        return date; // Pas d'agrégation
    }
  };

  // Fonction pour formater l'affichage selon l'intervalle
  const formatDisplayLabel = (key, interval, timestamp) => {
    const d = new Date(timestamp);

    switch (interval) {
      case "hour":
        // Format: "14h00"
        return `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`;

      case "day":
        // Format: "24" (numéro du jour)
        return String(d.getDate());

      case "month":
        // Format: "03" (numéro du mois)
        return String(d.getMonth() + 1).padStart(2, "0");

      case "15min":
        // Format: "14h15"
        const minutes15 = Math.floor(d.getMinutes() / 15) * 15;
        return `${String(d.getHours()).padStart(2, "0")}h${String(minutes15).padStart(2, "0")}`;

      case "30min":
        // Format: "14h30"
        const minutes30 = Math.floor(d.getMinutes() / 30) * 30;
        return `${String(d.getHours()).padStart(2, "0")}h${String(minutes30).padStart(2, "0")}`;

      default:
        // Fallback: afficher l'heure
        return d.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
    }
  };

  // Grouper par intervalle
  const grouped = data.Serie.ObssHydro.reduce((acc, obs) => {
    const key = getIntervalKey(obs.DtObsHydro, interval);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push({
      value: parseFloat(obs.ResObsHydro),
      timestamp: obs.DtObsHydro,
    });

    return acc;
  }, {});

  // Appliquer l'agrégation
  const aggregated = Object.entries(grouped).map(([key, values]) => {
    let aggregatedValue;

    switch (aggregationType) {
      case "average":
        aggregatedValue =
          values.reduce((sum, v) => sum + v.value, 0) / values.length;
        break;
      case "min":
        aggregatedValue = Math.min(...values.map((v) => v.value));
        break;
      case "max":
        aggregatedValue = Math.max(...values.map((v) => v.value));
        break;
      case "first":
        aggregatedValue = values[0].value;
        break;
      case "last":
        aggregatedValue = values[values.length - 1].value;
        break;
      default:
        aggregatedValue =
          values.reduce((sum, v) => sum + v.value, 0) / values.length;
    }

    return {
      heure: formatDisplayLabel(key, interval, values[0].timestamp), // Formatage adapté
      haut: Number(aggregatedValue.toFixed(2)),
      timestamp: values[0].timestamp,
      count: values.length,
    };
  });

  // Trier par timestamp
  return aggregated.sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  );
}

/**
 * Filtre les observations pour ne garder que celles d'aujourd'hui
 * @param {Object} data - Données brutes de Vigicrues
 * @returns {Object} Données filtrées
 */
export function filterObservationsToday(data) {
  if (!data?.Serie?.ObssHydro) {
    return data;
  }

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // Format YYYY-MM-DD

  const filteredObservations = data.Serie.ObssHydro.filter((obs) => {
    const obsDate = new Date(obs.DtObsHydro).toISOString().split("T")[0];
    return obsDate === todayStr;
  });

  return {
    ...data,
    Serie: {
      ...data.Serie,
      ObssHydro: filteredObservations,
    },
  };
}

/**
 * Filtre les observations pour les X dernières heures
 * @param {Object} data - Données brutes de Vigicrues
 * @param {number} hours - Nombre d'heures
 * @returns {Object} Données filtrées
 */
export function filterObservationsLastHours(data, hours = 24) {
  if (!data?.Serie?.ObssHydro) {
    return data;
  }

  const cutoffTime = new Date();
  cutoffTime.setHours(cutoffTime.getHours() - hours);

  const filteredObservations = data.Serie.ObssHydro.filter((obs) => {
    return new Date(obs.DtObsHydro) >= cutoffTime;
  });

  return {
    ...data,
    Serie: {
      ...data.Serie,
      ObssHydro: filteredObservations,
    },
  };
}

/**
 * Récupère et filtre les données d'aujourd'hui
 */
export async function getObservationsToday(codeStation, grandeurHydro = "H") {
  const data = await getObservationsVigicrues(codeStation, grandeurHydro);
  return filterObservationsToday(data);
}

/**
 * Récupère et filtre les données des dernières heures
 */
export async function getObservationsLastHours(
  codeStation,
  hours = 24,
  grandeurHydro = "H",
) {
  const data = await getObservationsVigicrues(codeStation, grandeurHydro);
  return filterObservationsLastHours(data, hours);
}
