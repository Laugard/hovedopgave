// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [payrollNumber, setPayrollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-badge">Bilka</div>
          <h1>Log ind</h1>
          <p className="muted">Intern “How To Guide” til vareudlevering</p>
        </div>

        <label className="field">
          <span>Lønnummer</span>
          <input
            value={payrollNumber}
            onChange={(e) => setPayrollNumber(e.target.value)}
            placeholder="fx 123456"
            inputMode="numeric"
          />
        </label>

        <label className="field">
          <span>Adgangskode</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
          />
        </label>

        {error ? (
          <div className="form-error" role="alert">
            {error}
          </div>
        ) : null}

        <button
          className="btn btn--primary"
          onClick={async () => {
            try {
              setError("");
              await login(payrollNumber.trim(), password);
              navigate("/app");
            } catch (e: any) {
              setError(e?.message ?? "Login fejlede.");
            }
          }}
          disabled={!payrollNumber.trim() || !password}
        >
          Log ind
        </button>

        <button className="btn btn--ghost" onClick={() => navigate("/activate")}>
          Aktivér ny konto
        </button>

        <div className="login-hint muted">
          (UI-only: data gemmes lokalt i browseren, så du kan klikke rundt og teste flows)
        </div>
      </div>
    </div>
  );
}
