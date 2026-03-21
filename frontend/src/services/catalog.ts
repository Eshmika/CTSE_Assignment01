import { api } from "./api";

export const getItems = () => api("/catalog/items");

export const getItemById = (id: string) =>
  api(`/catalog/items/${id}`);

export const createItem = (data: any, token: string) =>
  api("/catalog/items", "POST", data, token);

export const deleteItem = (id: string, token: string) =>
  api(`/catalog/items/${id}`, "DELETE", null, token);

export const updateAvailability = (
  id: string,
  availability: string,
  token: string
) =>
  api(
    `/catalog/items/${id}/availability?availability=${availability}`,
    "PATCH",
    null,
    token
  );