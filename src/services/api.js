export const API_DEFAULT = "https://donetskwaterhope.onrender.com";

export async function apiRequest({ baseUrl, token, path, method = "GET", body, fallbackError }) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch (error) {
    throw new Error(fallbackError || error.message);
  }

  const text = await response.text();
  const payload = text ? parseResponse(text) : null;

  if (!response.ok) {
    const message = typeof payload === "object" && payload
      ? payload.error || payload.message || payload.title || fallbackError
      : payload || fallbackError;
    throw new Error(message);
  }

  return payload;
}

function parseResponse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
