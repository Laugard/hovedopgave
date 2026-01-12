// src/pages/NotFoundPage.tsx
import React from "react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="page">
      <div className="panel">
        <h1>404</h1>
        <p className="muted">Siden findes ikke.</p>
        <Link className="btn btn--primary" to="/app">
          Til forsiden
        </Link>
      </div>
    </div>
  );
}
