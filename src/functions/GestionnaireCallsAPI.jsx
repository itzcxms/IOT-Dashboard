/**
 * Génère et execute les calls à l'API
 *
 * @param token string
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
  const Route = import.meta.env.VITE_API_URL_LOC + route;
  let res = null;
  switch (type) {
    case "GET":
      res = await routeGet(token, type, Route);
      break;
    case "POST":
      res = await routePost(token, type, Route, data);
      break;
    case "PUT":
      res = await routePut(token, type, Route, data);
      break;
    case "DELETE":
      res = await routeDelete(token, type, Route, data);
      break;
  }

  if (res !== null) {
    return JSON.parse(await res.text());
  }
  return JSON.parse("Erreur generateCallsApi()");
}

/**
 * Route GET
 *
 * @param token string
 * @param type string GET
 * @param route string
 * @returns {Promise<Response|null>}
 */
async function routeGet(token, type, route) {
  try {
    return await fetch(route, {
      method: type,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(error);
    return JSON.parse("Erreur routeGet()");
  }
}

/**
 * Route POST
 *
 * @param token string
 * @param type string POST
 * @param route string
 * @param data object|null
 * @returns {Promise<Response|null>}
 */
async function routePost(token, type, route, data) {
  try {
    const headerToken = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const header = {
      "Content-Type": "application/json",
    };

    return await fetch(route, {
      method: type,
      headers: token ? headerToken : header,
      body: data !== null ? JSON.stringify(data) : data,
    });
  } catch (error) {
    console.error(error);
    return JSON.parse("Erreur routePost()");
  }
}

/**
 * Route PUT
 *
 * @param token string
 * @param type string PUT
 * @param route string
 * @param data object|null
 * @returns {Promise<Response|null>}
 */
async function routePut(token, type, route, data) {
  try {
    return await fetch(route, {
      method: type,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data !== null ? JSON.stringify(data) : data,
    });
  } catch (error) {
    console.error(error);
    return JSON.parse("Erreur routePut()");
  }
}

/**
 * Route DELETE
 *
 * @param token string
 * @param type string DELETE
 * @param route string
 * @param data object|null
 * @returns {Promise<Response|null>}
 */
async function routeDelete(token, type, route, data) {
  try {
    return await fetch(route, {
      method: type,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data !== null ? JSON.stringify(data) : data,
    });
  } catch (error) {
    console.error(error);
    return JSON.parse("Erreur routeDetete()");
  }
}
