import { api } from "./api";

export const login = (data: { email: string; password: string }) =>
  api("/auth/login", "POST", data);

export const register = (data: any) =>
  api("/auth/register", "POST", data);

export const getProfile = (token: string) =>
  api("/auth/users/me", "GET", null, token);

export const updateProfile = (data: any, token: string) =>
  api("/auth/users/profile", "PUT", data, token);

export const changePassword = (data: any, token: string) =>
  api("/auth/change-password", "POST", data, token);

export const forgotPassword = (data: { email: string }) =>
  api("/auth/forgot-password", "POST", data);

export const resetPassword = (data: { token: string; newPassword: string }) =>
  api("/auth/reset-password", "POST", data);

export const getAddresses = (token: string) =>
  api("/auth/users/addresses", "GET", null, token);

export const addAddress = (data: any, token: string) =>
  api("/auth/users/addresses", "POST", data, token);

export const updateAddress = (id: string, data: any, token: string) =>
  api(`/auth/users/addresses/${id}`, "PUT", data, token);

export const deleteAddress = (id: string, token: string) =>
  api(`/auth/users/addresses/${id}`, "DELETE", null, token);