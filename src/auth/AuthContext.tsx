import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiActivate, apiLogin } from "../data/api";

type Role = "EMPLOYEE" | "APPROVER" | "ADMIN";

type AuthUser = {
  id: number;
  payrollNumber: string;
  role: Role;
};

type AuthCtx = {
  user: AuthUser | null;
  token: string;
  login: (payrollNumber: string, password: string) => Promise<void>;
  activate: (payrollNumber: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string>(() => localStorage.getItem("auth_token") || "");
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem("auth_user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem("auth_token", token);
    else localStorage.removeItem("auth_token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    else localStorage.removeItem("auth_user");
  }, [user]);

  const value = useMemo<AuthCtx>(() => {
    return {
      user,
      token,
      login: async (payrollNumber, password) => {
        const res = await apiLogin(payrollNumber, password);
        setToken(res.token);
        setUser(res.user);
      },
      activate: async (payrollNumber, password) => {
        const res = await apiActivate(payrollNumber, password);
        setToken(res.token);
        setUser(res.user);
      },
      logout: () => {
        setToken("");
        setUser(null);
      },
    };
  }, [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
