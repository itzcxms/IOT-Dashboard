/**
 * Génère et exécute les requêtes HTTP vers l'API
 *
 * Fonction principale qui centralise tous les appels API du dashboard.
 * Elle gère automatiquement :
 * - L'authentification via token Bearer
 * - Les différentes méthodes HTTP (GET, POST, PUT, DELETE)
 * - La lecture unique du body (prevention des erreurs)
 * - Les erreurs HTTP avec redirections appropriées (401, 403, ACCOUNT_INACTIVE)
 *
 * @async
 * @param {string|null} token - Token JWT pour l'authentification Bearer. Si null, pas d'Authorization header
 * @param {string} type - Méthode HTTP : "GET", "POST", "PUT" ou "DELETE"
 * @param {string} route - Route relative de l'API (ex: "/users", "/api/v1/data")
 * @param {Object|null} [data=null] - Données à envoyer dans le body (pour POST, PUT, DELETE)
 * @returns {Promise<any|null>} Réponse parsée en JSON, ou texte brut si pas de JSON valide, ou null si vide
 * @throws {Error} Erreur enrichie avec propriétés {status, payload} en cas d'erreur HTTP
 *
 * @example
 * // GET sans authentification
 * const data = await generateCallsAPI(null, "GET", "/public/data");
 *
 * @example
 * // POST avec authentification
 * const result = await generateCallsAPI(token, "POST", "/api/users", {
 *   name: "John",
 *   email: "john@example.com"
 * });
 *
 * @example
 * // Gestion des erreurs
 * try {
 *   await generateCallsAPI(token, "GET", "/protected");
 * } catch (error) {
 *   console.log(error.status); // 401, 403, etc.
 *   console.log(error.payload); // réponse du serveur
 * }
 */
export default async function generateCallsAPI(
  token,
  type,
  route,
  data = null,
) {
  const url = import.meta.env.VITE_API_URL_LOC + route;

  let res = null;
  switch (type) {
    case "GET":
      res = await routeGet(token, type, url);
      break;
    case "POST":
      res = await routePost(token, type, url, data);
      break;
    case "PUT":
      res = await routePut(token, type, url, data);
      break;
    case "DELETE":
      res = await routeDelete(token, type, url, data);
      break;
    default:
      throw new Error(`Type HTTP non supporté: ${type}`);
  }

  if (!res) {
    throw new Error("Aucune réponse serveur (res=null)");
  }

  // Lire le body UNE SEULE FOIS
  const raw = await res.text();
  let payload = null;
  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {
    payload = raw; // parfois du texte/plain
  }

  if (res.ok) {
    return payload;
  }

  await handleErrors(res, payload);
}

/**
 * Exécute une requête GET
 *
 * @private
 * @async
 * @param {string} token - Token JWT pour l'authentification
 * @param {string} type - Type de requête HTTP ("GET")
 * @param {string} url - URL complète de la requête
 * @returns {Promise<Response>} Réponse brute de fetch
 */
async function routeGet(token, type, url) {
  return fetch(url, {
    method: type,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

/**
 * Exécute une requête POST
 *
 * @private
 * @async
 * @param {string} token - Token JWT pour l'authentification
 * @param {string} type - Type de requête HTTP ("POST")
 * @param {string} url - URL complète de la requête
 * @param {Object|null} data - Données à envoyer dans le body
 * @returns {Promise<Response>} Réponse brute de fetch
 */
async function routePost(token, type, url, data) {
  return fetch(url, {
    method: type,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: data !== null ? JSON.stringify(data) : null,
  });
}

/**
 * Exécute une requête PUT
 *
 * @private
 * @async
 * @param {string} token - Token JWT pour l'authentification
 * @param {string} type - Type de requête HTTP ("PUT")
 * @param {string} url - URL complète de la requête
 * @param {Object|null} data - Données à envoyer dans le body
 * @returns {Promise<Response>} Réponse brute de fetch
 */
async function routePut(token, type, url, data) {
  return fetch(url, {
    method: type,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: data !== null ? JSON.stringify(data) : null,
  });
}

/**
 * Exécute une requête DELETE
 *
 * @private
 * @async
 * @param {string} token - Token JWT pour l'authentification
 * @param {string} type - Type de requête HTTP ("DELETE")
 * @param {string} url - URL complète de la requête
 * @param {Object|null} data - Données à envoyer dans le body
 * @returns {Promise<Response>} Réponse brute de fetch
 */
async function routeDelete(token, type, url, data) {
  return fetch(url, {
    method: type,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: data !== null ? JSON.stringify(data) : null,
  });
}

/**
 * Gère les erreurs HTTP et effectue les redirections appropriées
 *
 * Cette fonction centralise la gestion des erreurs HTTP avec les redirections suivantes :
 * - ACCOUNT_INACTIVE : Redirige vers /compte-inactif
 * - 401 Unauthorized : Redirige vers /connexion (token invalide ou utilisateur introuvable)
 * - 403 Forbidden : Lance une erreur FORBIDDEN (permissions insuffisantes)
 * - Autres statuts : Lance une erreur générique
 *
 * @private
 * @async
 * @param {Response} res - Réponse brute de fetch
 * @param {Object|string|null} payload - Payload parsé de la réponse (JSON ou texte)
 * @throws {Error} Erreur enrichie avec {status, payload}
 */
async function handleErrors(res, payload) {
  // --- Gestion centralisée des erreurs / redirections ---
  const status = res.status;

  // Helper : détecter compte inactif (code OU message)
  const isAccountInactive =
    (payload &&
      typeof payload === "object" &&
      payload.code === "ACCOUNT_INACTIVE") ||
    (payload &&
      typeof payload === "object" &&
      typeof payload.message === "string" &&
      payload.message.toLowerCase().includes("inactif")) ||
    (typeof payload === "string" && payload.toLowerCase().includes("inactif"));

  if (isAccountInactive) {
    // Nettoyage auth
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirection
    window.location.href = "/compte-inactif";
    // On stoppe la chaîne d'appel côté JS
    throw Object.assign(new Error("ACCOUNT_INACTIVE"), { status, payload });
  }

  // 401 : non authentifié / token invalide / user introuvable
  if (status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/connexion";
    throw Object.assign(new Error("UNAUTHORIZED"), { status, payload });
  }

  // 403 : interdit (permissions)
  if (status === 403) {
    throw Object.assign(new Error("FORBIDDEN"), { status, payload });
  }

  // Autres erreurs
  throw Object.assign(
    new Error(
      (payload && typeof payload === "object" && payload.message) ||
        "Erreur API",
    ),
    { status, payload },
  );
}
