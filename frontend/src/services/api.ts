const BASE_URL = "http://localhost:8080";

const parseResponseBody = async (res: Response) => {
  if (res.status === 204) {
    return null;
  }

  const text = await res.text();
  if (!text) {
    return null;
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
};

export const api = async (
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string
) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseBody = await parseResponseBody(res);

  if (!res.ok) {
    const message =
      responseBody &&
      typeof responseBody === "object" &&
      "message" in responseBody &&
      typeof responseBody.message === "string"
        ? responseBody.message
        : typeof responseBody === "string" && responseBody.trim().length > 0
          ? responseBody
          : `Request failed with status ${res.status}`;

    throw new Error(message);
  }

  return responseBody;
};