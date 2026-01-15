/**
 * Num -> Mois
 *
 * @param num number|string
 * @returns {*}
 * @constructor
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
 * Mois -> Num
 *
 * @param mois string
 * @returns {*}
 * @constructor
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
