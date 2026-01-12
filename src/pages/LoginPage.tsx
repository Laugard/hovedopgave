import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [payrollNumber, setPayrollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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
              setBusy(true);
              setError("");
              await login(payrollNumber.trim(), password);
              navigate("/app", { replace: true });
            } catch (e: any) {
              setError("Login fejlede. Tjek lønnummer/adgangskode eller om du er aktiv.");
            } finally {
              setBusy(false);
            }
          }}
          disabled={busy || !payrollNumber.trim() || !password}
        >
          {busy ? "Logger ind..." : "Log ind"}
        </button>

        <button
          className="btn btn--ghost"
          onClick={() => navigate("/activate")}
          style={{ marginTop: 10 }}
        >
          Aktivér ny konto
        </button>

        <div className="login-hint muted">
          (Nu kører login/aktivering via backend + database)
        </div>
      </div>
    </div>
  );
}
