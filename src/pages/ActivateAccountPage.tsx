import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function ActivateAccountPage() {
  const { activate } = useAuth();
  const navigate = useNavigate();

  const [payrollNumber, setPayrollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const disabled =
    !payrollNumber.trim() ||
    !password ||
    password.length < 6 ||
    !repeatPassword ||
    password !== repeatPassword;

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-badge">Bilka</div>
          <h1>Aktivér konto</h1>
          <p className="muted">
            Første gang du logger ind: indtast lønnummer og vælg adgangskode
          </p>
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

        <label className="field">
          <span>Gentag adgangskode</span>
          <input
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
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
              await activate(payrollNumber.trim(), password);
              navigate("/app", { replace: true });
            } catch {
              setError("Aktivering fejlede. Er dit lønnummer godkendt af admin?");
            } finally {
              setBusy(false);
            }
          }}
          disabled={busy || disabled}
        >
          {busy ? "Aktiverer..." : "Aktivér konto"}
        </button>

        <button className="btn btn--ghost" onClick={() => navigate("/login")} style={{ marginTop: 10 }}>
          Tilbage til login
        </button>
      </div>
    </div>
  );
}
