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
) {
  try {
    const url = `${VIGICRUES_BASE_URL}/observations.json?CdStationHydro=${codeStation}&GrdSerie=${grandeurHydro}`;

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
  return aggregateObservationsByInterval(data, "hour", 1, "average");
}

/**
 * Agrège les données par jour (moyenne)
 * @param {Object} data - Données brutes de Vigicrues
 * @returns {Array} Données agrégées par jour
 */
export function aggregateByDay(data) {
  return aggregateObservationsByInterval(data, "day", 1, "average");
}

/**
 * Agrège les données par tranche de 15 minutes (moyenne)
 * @param {Object} data - Données brutes de Vigicrues
 * @returns {Array} Données agrégées par 15 minutes
 */
export function aggregateBy15Minutes(data) {
  return aggregateObservationsByInterval(data, "minute", 15, "average");
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
 * Agrège les données par intervalle avec min, moyenne et max
 * Utile pour afficher une bande min/max avec la courbe moyenne
 * @param {Object} data - Données brutes de Vigicrues
 * @param {string} interval - Unité d'intervalle ('hour', 'day', 'minute', 'month')
 * @param {number} amount - Quantité d'unités
 * @returns {Array} Données avec min, moyenne, max
 */
export function aggregateObservationsByIntervalWithMinMax(
  data,
  interval = "hour",
  amount = 1,
) {
  if (!data?.Serie?.ObssHydro) {
    return [];
  }

  // Fonction pour obtenir la clé d'intervalle
  const getIntervalKey = (date, interval, amount) => {
    const d = new Date(date);

    switch (interval) {
      case "hour": {
        const hours = Math.floor(d.getHours() / amount) * amount;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(hours).padStart(2, "0")}:00`;
      }

      case "day": {
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        return dateStr;
      }

      case "month": {
        const months = Math.floor(d.getMonth() / amount) * amount;
        return `${d.getFullYear()}-${String(months + 1).padStart(2, "0")}`;
      }

      case "minute": {
        const minutes = Math.floor(d.getMinutes() / amount) * amount;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      }

      default:
        return date;
    }
  };

  // Fonction pour formater l'affichage selon l'intervalle
  const formatDisplayLabel = (timestamp, interval, amount) => {
    const d = new Date(timestamp);

    switch (interval) {
      case "hour": {
        if (amount === 1) {
          return `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`;
        } else {
          const endHour = (d.getHours() + amount) % 24;
          return `${String(d.getHours()).padStart(2, "0")}h-${String(endHour).padStart(2, "0")}h`;
        }
      }

      case "day": {
        if (amount === 1) {
          return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
        } else {
          const endDate = new Date(d);
          endDate.setDate(endDate.getDate() + amount - 1);
          const startDay = String(d.getDate()).padStart(2, "0");
          const startMonth = String(d.getMonth() + 1).padStart(2, "0");
          const endDay = String(endDate.getDate()).padStart(2, "0");
          const endMonth = String(endDate.getMonth() + 1).padStart(2, "0");

          if (startMonth !== endMonth) {
            return `${startDay}/${startMonth}-${endDay}/${endMonth}`;
          } else {
            return `${startDay}-${endDay}/${startMonth}`;
          }
        }
      }

      case "month": {
        if (amount === 1) {
          return String(d.getMonth() + 1).padStart(2, "0");
        } else {
          const endMonth = ((d.getMonth() + amount - 1) % 12) + 1;
          return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(endMonth).padStart(2, "0")}`;
        }
      }

      case "minute": {
        if (amount === 1) {
          return `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`;
        } else {
          const endMinutes = (d.getMinutes() + amount) % 60;
          const endHour =
            d.getHours() + Math.floor((d.getMinutes() + amount) / 60);
          return `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}-${String(endHour).padStart(2, "0")}h${String(endMinutes).padStart(2, "0")}`;
        }
      }

      default:
        return d.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
    }
  };

  // Grouper par intervalle
  const grouped = data.Serie.ObssHydro.reduce((acc, obs) => {
    const key = getIntervalKey(obs.DtObsHydro, interval, amount);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push({
      value: parseFloat(obs.ResObsHydro),
      timestamp: obs.DtObsHydro,
    });

    return acc;
  }, {});

  // Calculer min, moyenne et max pour chaque intervalle
  const aggregated = Object.entries(grouped).map(([key, values]) => {
    // Trier par timestamp
    values.sort((a, b) => a.timestamp - b.timestamp);

    // Calculer min, moyenne, max
    const min = Math.min(...values.map((v) => v.value));
    const max = Math.max(...values.map((v) => v.value));
    const average = values.reduce((sum, v) => sum + v.value, 0) / values.length;

    return {
      heure: formatDisplayLabel(values[0].timestamp, interval, amount),
      max: Number(max.toFixed(2)),
      moyenne: Number(average.toFixed(2)),
      min: Number(min.toFixed(2)),
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
 * Agrège les données par intervalle de temps
 * @param {Object} data - Données brutes de Vigicrues
 * @param {string} interval - Unité d'intervalle ('hour', 'day', 'minute', 'month')
 * @param {number} amount - Quantité d'unités (ex: 30 pour 30 minutes, 2 pour 2 heures)
 * @param {string} aggregationType - Type d'agrégation ('average', 'min', 'max', 'first', 'last')
 * @returns {Array} Données agrégées
 */
export function aggregateObservationsByInterval(
  data,
  interval = "hour",
  amount = 1,
  aggregationType = "average",
) {
  if (!data?.Serie?.ObssHydro) {
    return [];
  }

  // Fonction pour obtenir la clé d'intervalle (pour le regroupement)
  const getIntervalKey = (date, interval, amount) => {
    const d = new Date(date);

    switch (interval) {
      case "hour": {
        const hours = Math.floor(d.getHours() / amount) * amount;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(hours).padStart(2, "0")}:00`;
      }

      case "day": {
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        return dateStr;
      }

      case "month": {
        const months = Math.floor(d.getMonth() / amount) * amount;
        return `${d.getFullYear()}-${String(months + 1).padStart(2, "0")}`;
      }

      case "minute": {
        const minutes = Math.floor(d.getMinutes() / amount) * amount;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      }

      default:
        return date; // Pas d'agrégation
    }
  };

  // Fonction pour formater l'affichage selon l'intervalle
  const formatDisplayLabel = (key, interval, amount, timestamp) => {
    const d = new Date(timestamp);

    switch (interval) {
      case "hour": {
        // Format: "14h00" ou "14h00-16h00" si amount > 1
        if (amount === 1) {
          return `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`;
        } else {
          const endHour = (d.getHours() + amount) % 24;
          return `${String(d.getHours()).padStart(2, "0")}h-${String(endHour).padStart(2, "0")}h`;
        }
      }

      case "day": {
        // Format: "24/03" ou "24/03-26/03" si amount > 1 (avec gestion des mois différents)
        if (amount === 1) {
          return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
        } else {
          // Calculer la date de fin correctement en ajoutant les jours
          const endDate = new Date(d);
          endDate.setDate(endDate.getDate() + amount - 1);

          const startDay = String(d.getDate()).padStart(2, "0");
          const startMonth = String(d.getMonth() + 1).padStart(2, "0");
          const endDay = String(endDate.getDate()).padStart(2, "0");
          const endMonth = String(endDate.getMonth() + 1).padStart(2, "0");

          // Si les mois sont différents, afficher les deux
          if (startMonth !== endMonth) {
            return `${startDay}/${startMonth}-${endDay}/${endMonth}`;
          } else {
            // Sinon, afficher juste une plage de jours pour le même mois
            return `${startDay}-${endDay}/${startMonth}`;
          }
        }
      }

      case "month": {
        // Format: "03" ou "03-04" si amount > 1
        if (amount === 1) {
          return String(d.getMonth() + 1).padStart(2, "0");
        } else {
          const endMonth = ((d.getMonth() + amount - 1) % 12) + 1;
          return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(endMonth).padStart(2, "0")}`;
        }
      }

      case "minute": {
        // Format: "14h15" ou "14h15-14h45" si amount > 1
        if (amount === 1) {
          return `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`;
        } else {
          const endMinutes = (d.getMinutes() + amount) % 60;
          const endHour =
            d.getHours() + Math.floor((d.getMinutes() + amount) / 60);
          return `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}-${String(endHour).padStart(2, "0")}h${String(endMinutes).padStart(2, "0")}`;
        }
      }

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
    const key = getIntervalKey(obs.DtObsHydro, interval, amount);

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
    // Trier les valeurs par timestamp pour s'assurer que values[0] est le plus ancien
    values.sort((a, b) => a.timestamp - b.timestamp);

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
      heure: formatDisplayLabel(key, interval, amount, values[0].timestamp),
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

/**
 * Filtre les observations entre deux dates
 * @param {Object} data - Données brutes de Vigicrues
 * @param {Date|string} dateDebut - Date de début (Date object ou string ISO)
 * @param {Date|string} dateFin - Date de fin (Date object ou string ISO)
 * @returns {Object} Données filtrées
 */
export function filterObservations(data, dateDebut, dateFin) {
  if (!data?.Serie?.ObssHydro) {
    return data;
  }

  // Conversion en objets Date si nécessaire
  const startDate = dateDebut instanceof Date ? dateDebut : new Date(dateDebut);
  const endDate = dateFin instanceof Date ? dateFin : new Date(dateFin);

  // Vérification de la validité des dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error("Dates invalides fournies à filterObservations");
    return data;
  }

  // S'assurer que la date de début est antérieure à la date de fin
  if (startDate > endDate) {
    console.warn(
      "La date de début est postérieure à la date de fin, inversion automatique",
    );
    [startDate, endDate] = [endDate, startDate];
  }

  // Filtrage des observations
  const filteredObservations = data.Serie.ObssHydro.filter((obs) => {
    const obsDate = new Date(obs.DtObsHydro);
    return obsDate >= startDate && obsDate <= endDate;
  });

  // Retourner les données avec les observations filtrées
  return {
    ...data,
    Serie: {
      ...data.Serie,
      ObssHydro: filteredObservations,
    },
  };
}

/**
 * Filtre les observations pour une date spécifique (toute la journée)
 * @param {Object} data - Données brutes de Vigicrues
 * @param {Date|string} date - Date à filtrer (Date object ou string ISO)
 * @returns {Object} Données filtrées
 */
export function filterObservationsByDate(data, date) {
  const targetDate = date instanceof Date ? date : new Date(date);

  // Début de la journée (00:00:00)
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  // Fin de la journée (23:59:59.999)
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  return filterObservations(data, startOfDay, endOfDay);
}

/**
 * Filtre les observations pour les X derniers jours
 * @param {Object} data - Données brutes de Vigicrues
 * @param {number} days - Nombre de jours
 * @returns {Object} Données filtrées
 */
export function filterObservationsLastDays(data, days = 7) {
  const endDate = new Date();
  let startDate = new Date(new Date().setHours(0, 0, 0, 0));
  startDate.setDate(startDate.getDate() - days);

  return filterObservations(data, startDate, endDate);
}
