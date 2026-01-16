/**
 * Converts a numeric value representing a month into its corresponding French month name.
 *
 * @param {number|string} num - The numeric representation of a month (1 to 12). Can be passed as a number or a string.
 * @return {string|undefined} The French name of the month if the input is valid, otherwise undefined.
 */
export function NumToMois(num) {
  num = parseInt(num);
  const mois = {
    1: "Janvier",
    2: "Février",
    3: "Mars",
    4: "Avril",
    5: "Mai",
    6: "Juin",
    7: "Juillet",
    8: "Août",
    9: "Septembre",
    10: "Octobre",
    11: "Novembre",
    12: "Décembre",
  };
  return mois[num];
}

/**
 * Converts a French month name to its corresponding numerical representation.
 *
 * @param {string} mois The name of the month in French (e.g., "Janvier", "Février").
 * @return {string | undefined} The two-digit numerical representation of the month (e.g., "01" for "Janvier"),
 * or undefined if the input does not match any French month name.
 */
export function MoisToNum(mois) {
  const num = {
    Janvier: "01",
    Février: "02",
    Mars: "03",
    Avril: "04",
    Mai: "05",
    Juin: "06",
    Juillet: "07",
    Août: "08",
    Septembre: "09",
    Octobre: "10",
    Novembre: "11",
    Décembre: "12",
  };
  return num[mois];
}
