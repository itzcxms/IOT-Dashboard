/**
 * Génère et exécute les calls à l'API
 *
 * @param token string|null
 * @param type string GET|POST|PUT|DELETE
 * @param route string
 * @param data object|null
 * @returns {Promise<any|null>}
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

/**
 * Route GET
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
 * Route POST
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
 * Route PUT
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
 * Route DELETE
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
