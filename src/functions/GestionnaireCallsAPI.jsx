export default async function generateCallsAPI(
  token,
  type,
  route,
  data = null,
) {
  const Route = import.meta.env.VITE_API_URL + route;
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
