import { api } from "./api";

export const chargePayment = (data: any, token: string) =>
  api("/payments/charge", "POST", data, token);