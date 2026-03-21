import { api } from "./api";

export const createOrder = (data: any, token: string) =>
  api("/orders", "POST", data, token);

export const updateOrderStatus = (
  id: string,
  status: string,
  token: string
) => api(`/orders/${id}/status?status=${encodeURIComponent(status)}`, "PATCH", null, token);

export const getMyOrders = (token: string) =>
  api("/orders/my", "GET", null, token);

export const getOrderById = (id: string, token: string) =>
  api(`/orders/${id}`, "GET", null, token);