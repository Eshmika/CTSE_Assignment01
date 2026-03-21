import { api } from "./api";

export const chargePayment = (data: any, token: string) =>
  api("/payments/charge", "POST", data, token);

export const getPaymentByOrderId = (orderId: string, token: string) =>
  api(`/payments/${orderId}`, "GET", null, token);