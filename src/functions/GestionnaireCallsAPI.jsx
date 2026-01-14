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
    const res2 = JSON.parse(await res.text());
    console.log(res2);
    return res2;
  }
  return null;
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
    console.log(error);
    return null;
  }
}

async function routePost(token, type, route, data) {
  try {
    return await fetch(route, {
      method: type,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data !== null ? JSON.stringify(data) : null,
    });
  } catch (error) {
    console.log(error);
    return null;
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
      body: data !== null ? JSON.stringify(data) : null,
    });
  } catch (error) {
    console.log(error);
    return null;
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
      body: data !== null ? JSON.stringify(data) : null,
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}
