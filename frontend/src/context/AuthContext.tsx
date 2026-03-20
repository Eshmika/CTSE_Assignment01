"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/auth";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load token from localStorage on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getProfile(storedToken).then(setUser).catch((err: Error) => {
        const msg = err?.message?.toLowerCase() ?? "";
        if (msg.includes("401") || msg.includes("unauthorized") || msg.includes("forbidden")) {
          logout();
        }
        // Network or server errors: keep the token so in-flight requests still work
      });
    }
  }, []);

  const loginUser = (data: any) => {
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    setToken(data.accessToken);

    setUser({
      username: data.username,
      userId: data.userId,
      role: data.role,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);