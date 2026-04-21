const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-gateway.whitedesert-d216bdbd.southeastasia.azurecontainerapps.io";

const getErrorMessage = (responseBody: any, status: number): string => {
  if (
    responseBody &&
    typeof responseBody === "object" &&
    "message" in responseBody &&
    typeof responseBody.message === "string"
  ) {
    return responseBody.message;
  }

  if (typeof responseBody === "string" && responseBody.trim().length > 0) {
    return responseBody;
  }

  return `Request failed with status ${status}`;
};

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
    const message = getErrorMessage(responseBody, res.status);
    throw new Error(message);
  }

  return responseBody;
};
