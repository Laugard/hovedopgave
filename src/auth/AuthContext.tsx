// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seedIfNeeded } from "../data/seed";
import { apiActivateAccount, apiLogin, apiLogout, apiMe } from "../data/api";
import type { AuthUser } from "../data/types";

type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  login: (payrollNumber: string, password: string) => Promise<void>;
  activate: (payrollNumber: string, password: string, repeatPassword: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    seedIfNeeded();
    // restore session
    const u = apiMe();
    setUser(u);
    setIsReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      login: async (payrollNumber, password) => {
        const u = await apiLogin(payrollNumber, password);
        setUser(u);
      },
      activate: async (payrollNumber, password, repeatPassword) => {
        const u = await apiActivateAccount(payrollNumber, password, repeatPassword);
        setUser(u);
      },
      logout: () => {
        apiLogout();
        setUser(null);
      },
    }),
    [user, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
