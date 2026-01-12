// src/components/TopBar.tsx
import React from "react";
import { useAuth } from "../auth/AuthContext";

export function TopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar__left">
        <span className="dot" aria-hidden="true" />
        <span className="topbar__title">How To Guide – Vareudlevering</span>
      </div>

      <div className="topbar__right">
        <div className="pill pill--soft">Lønnummer: {user?.payrollNumber ?? "—"}</div>
        <button className="btn btn--ghost" onClick={logout}>
          Log ud
        </button>
      </div>
    </header>
  );
}
