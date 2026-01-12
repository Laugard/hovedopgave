// src/pages/HomePage.tsx
import React from "react";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div>
      <h1>Forside</h1>
      <p className="muted">
        Vælg Guides for at finde læseguides eller starte fri træning.
      </p>

      <div className="panel">
        <h2>Genveje</h2>
        <div className="grid">
          <Link className="btn btn--primary" to="/app/guides">
            Gå til guides
          </Link>
          <Link className="btn btn--ghost" to="/app/guides/kasse/free">
            Start kasse – fri træning
          </Link>
          <Link className="btn btn--ghost" to="/app/guides/pda/free">
            Start PDA – fri træning
          </Link>
        </div>
      </div>
    </div>
  );
}
