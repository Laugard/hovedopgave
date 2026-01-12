// src/pages/free/ReturEmballageFreePage.tsx
import React, { useMemo, useState } from "react";

type Row = {
  itemNo: string;
  qty: string;
  unit: string;
  apk: string;
  text: string;
};

const SEED_ROWS: Row[] = [
  { itemNo: "149287", qty: "0,000", unit: "EA", apk: "1", text: "PANT KASSE T/30 STK 33CL (25+33CL)" },
  { itemNo: "149289", qty: "0,000", unit: "EA", apk: "1", text: "KASSE 24 STK 33 CL" },
  { itemNo: "149291", qty: "0,000", unit: "EA", apk: "1", text: "KASSE 24 STK 50 CL" },
  { itemNo: "149308", qty: "0,000", unit: "EA", apk: "1", text: "BAKKE TIL SODAVAND 2 L + 1 L" },
  { itemNo: "150528", qty: "0,000", unit: "EA", apk: "1", text: "COOP KASSE 30STK" },
];

export function ReturEmballageFreePage() {
  const [lager, setLager] = useState("9026 TERMINAL ISHØJ");
  const [text, setText] = useState("");

  const [rows, setRows] = useState<Row[]>(SEED_ROWS);
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = text.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.itemNo.includes(q) || r.text.toLowerCase().includes(q));
  }, [rows, text]);

  return (
    <div>
      <h1>Returemballage – fri træning</h1>
      <p className="muted">Digital “booking/udskriv” liste (mock) – layout som systemskærm.</p>

      <div className="panel">
        <h2>Interaktiv del</h2>

        <div className="retur-wrap" aria-label="Returemballage (UI mock)">
          <div className="retur-top">
            <div className="retur-topline muted">
              Butik: 1657 / BILKA NÆSTVED / NÆSTVED STORCENTER 1 / 4700 NÆSTVED · Bruger: Nikolaj Frederik Brandstrup
            </div>

            <div className="retur-form">
              <div className="retur-field">
                <label>* Lager:</label>
                <select value={lager} onChange={(e) => setLager(e.target.value)}>
                  <option>9026 TERMINAL ISHØJ</option>
                  <option>1657 TERMINAL NÆSTVED</option>
                </select>
              </div>

              <div className="retur-field">
                <label>Text:</label>
                <input value={text} onChange={(e) => setText(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="retur-grid">
            <div className="retur-grid-head">
              <div className="retur-actions">
                <span className="pill pill--soft">View: Standard</span>
                <button className="btn btn--ghost" onClick={() => setSelected(null)}>
                  Slet række
                </button>
                <span className="pill pill--soft">Materiale-ID: Varenummer</span>
              </div>
            </div>

            <div className="retur-table">
              <div className="retur-tr retur-th">
                <div className="retur-td retur-td--check" />
                <div className="retur-td">Varenummer</div>
                <div className="retur-td">Mængde</div>
                <div className="retur-td">Enhed</div>
                <div className="retur-td">APK</div>
                <div className="retur-td">Varetekst</div>
              </div>

              {filtered.map((r, idx) => {
                const realIndex = rows.findIndex((x) => x.itemNo === r.itemNo && x.text === r.text);
                const isSel = selected === realIndex;

                return (
                  <div
                    key={idx}
                    className={"retur-tr " + (isSel ? "retur-tr--sel" : "")}
                    onClick={() => setSelected(realIndex)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="retur-td retur-td--check">
                      <input type="checkbox" checked={isSel} readOnly />
                    </div>
                    <div className="retur-td">{r.itemNo}</div>
                    <div className="retur-td">{r.qty}</div>
                    <div className="retur-td">{r.unit}</div>
                    <div className="retur-td">{r.apk}</div>
                    <div className="retur-td">{r.text}</div>
                  </div>
                );
              })}
            </div>

            <div className="retur-footer">
              <div className="muted">Total: {filtered.length}</div>
              <button
                className="btn btn--primary"
                onClick={() => alert("UI-only: Gem og Udskriv (ingen rigtige data)")}
              >
                Gem og Udskriv
              </button>
            </div>
          </div>
        </div>

        <p className="muted" style={{ marginTop: 12 }}>
          (UI-only: Filtrering + række-valg er client-side.)
        </p>
      </div>
    </div>
  );
}
