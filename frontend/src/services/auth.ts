import { api } from "./api";

export const login = (data: { email: string; password: string }) =>
  api("/auth/login", "POST", data);

export const register = (data: any) =>
  api("/auth/register", "POST", data);

export const getProfile = (token: string) =>
  api("/auth/users/me", "GET", null, token);