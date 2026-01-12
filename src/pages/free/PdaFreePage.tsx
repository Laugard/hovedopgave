// src/pages/free/PdaFreePage.tsx
import React, { useMemo, useState } from "react";

type Item = { name: string; sku: string };

const SEED_ITEM: Item = { name: "ORLANDO LOUNGESET, GREY", sku: "10580491" };

export function PdaFreePage() {
  const [query, setQuery] = useState("1550701336");
  const [found, setFound] = useState<Item | null>(SEED_ITEM);
  const [status, setStatus] = useState("CPUC · Vareudlevering");

  const canSearch = useMemo(() => query.trim().length > 0, [query]);

  return (
    <div>
      <h1>PDA – fri træning</h1>
      <p className="muted">Digital PDA-skærm (mock) – scan/indtast voucher.</p>

      <div className="panel">
        <h2>Interaktiv del</h2>

        <div className="pda-frame" aria-label="PDA UI mock">
          <div className="pda-statusbar">
            <div>21.08</div>
            <div className="pda-icons" aria-hidden="true">
              ⟳ ⌁ ᯤ ● ◔ ▾ ▮ 86%
            </div>
          </div>

          <div className="pda-top">
            <button className="pda-burger" aria-label="Menu">
              ☰
            </button>
            <div className="pda-title">CPUC</div>
          </div>

          <div className="pda-body">
            <div className="pda-subtitle">Vareudlevering</div>
            <div className="muted pda-hint">Scan eller indtast voucher</div>

            <div className="pda-search">
              <input value={query} onChange={(e) => setQuery(e.target.value)} />
              <button
                disabled={!canSearch}
                onClick={() => {
                  // UI-only: meget simpel “find”
                  if (query.trim() === "1550701336") {
                    setFound(SEED_ITEM);
                    setStatus("Fundet 1 vare");
                  } else {
                    setFound(null);
                    setStatus("Ingen resultater");
                  }
                }}
              >
                Søg
              </button>
            </div>

            {found ? (
              <div className="pda-item">
                <div className="pda-item-left">
                  <div className="pda-item-name">{found.name}</div>
                  <div className="pda-item-sku">{found.sku}</div>
                </div>
                <div className="pda-item-right">1|1</div>
              </div>
            ) : (
              <div className="pda-empty muted">Ingen varer</div>
            )}
          </div>

          <div className="pda-footer muted">{status}</div>
        </div>
      </div>
    </div>
  );
}
