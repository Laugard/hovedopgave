// src/pages/free/ReparationFreePage.tsx
import React, { useMemo, useState } from "react";

type Step = 1 | 2 | 3 | 4;

export function ReparationFreePage() {
  const [step, setStep] = useState<Step>(1);

  const [brand, setBrand] = useState("OBH NORDICA");
  const [deviceType] = useState("HUSHOLDNINGSPRODUKT");
  const [modelNumber] = useState("5708642076982");

  // Kunde
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Apparat
  const [serial, setSerial] = useState("");
  const [productAt, setProductAt] = useState("Vælg…");
  const [faultCode, setFaultCode] = useState("Vælg…");
  const [faultText, setFaultText] = useState("");

  // Salg
  const [receiptNo, setReceiptNo] = useState("");
  const [soldDate] = useState("2025-12-19");
  const [salePrice] = useState("400");

  const canNext = useMemo(() => {
    if (step === 1) return true;
    if (step === 2) return !!customerName.trim() && !!phone.trim() && !!address.trim();
    if (step === 3) return !!serial.trim() && productAt !== "Vælg…" && faultCode !== "Vælg…" && !!faultText.trim();
    if (step === 4) return !!receiptNo.trim();
    return false;
  }, [step, customerName, phone, address, serial, productAt, faultCode, faultText, receiptNo]);

  const [completed, setCompleted] = useState(false);

  return (
    <div>
      <h1>Reparationer – fri træning</h1>
      <p className="muted">Digital “Registrer ny ordre” (mock) – du kan gennemføre flowet sikkert.</p>

      <div className="panel">
        <h2>Interaktiv del</h2>

        <div className="rep-wrap" aria-label="Reparation (Register ny ordre) UI mock">
          <div className="rep-head">
            <h3 className="rep-title">Registrer ny ordre</h3>
            <div className="rep-step">Trin {step}/4</div>
          </div>

          <div className="rep-box">
            {/* Top linje */}
            <div className="rep-grid rep-grid--top">
              <div className="rep-field">
                <label className="rep-label">Mærke</label>
                <select className="rep-input" value={brand} onChange={(e) => setBrand(e.target.value)}>
                  <option>OBH NORDICA</option>
                  <option>PHILIPS</option>
                  <option>SAMSUNG</option>
                </select>
              </div>

              <div className="rep-field">
                <label className="rep-label">Apparattype</label>
                <input className="rep-input rep-input--green" value={deviceType} readOnly />
              </div>

              <div className="rep-field">
                <label className="rep-label">Model</label>
                <input className="rep-input rep-input--green" value={modelNumber} readOnly />
              </div>

              <div className="rep-field rep-field--wide">
                <div className="rep-2col">
                  <div>
                    <div className="rep-mini-label">Leverandør</div>
                    <div className="rep-mini-value">OBH Nordica DK (XPOS) (XPOS - obhnordica)</div>
                  </div>
                  <div>
                    <div className="rep-mini-label">Forespurgt leverandør</div>
                    <div className="rep-mini-value">OBH Nordica DK (XPOS)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rep-info">
              <div className="rep-info-icon">i</div>
              <div>
                <div className="rep-info-title">Information om servicescenario fra XPOS</div>
                <div className="rep-info-sub">Direct exchange in shop.</div>
              </div>
            </div>

            {/* Trin 2: Kundeoplysninger */}
            <div className={"rep-section " + (step === 2 ? "rep-section--active" : "")}>
              <div className="rep-section-title">Kundeoplysninger</div>
              <div className="rep-grid">
                <div className="rep-field">
                  <label className="rep-label">Kundenavn</label>
                  <input
                    className={"rep-input " + (step >= 2 && !customerName.trim() ? "rep-input--required" : "")}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    disabled={step < 2}
                  />
                </div>
                <div className="rep-field">
                  <label className="rep-label">Telefon</label>
                  <input
                    className={"rep-input " + (step >= 2 && !phone.trim() ? "rep-input--required" : "")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={step < 2}
                  />
                </div>
                <div className="rep-field">
                  <label className="rep-label">Adresse</label>
                  <input
                    className={"rep-input " + (step >= 2 && !address.trim() ? "rep-input--required" : "")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={step < 2}
                  />
                </div>
                <div className="rep-field">
                  <label className="rep-label">Mobiltelefon</label>
                  <input className="rep-input" disabled={step < 2} />
                </div>
              </div>
            </div>

            {/* Trin 3: Apparatoplysninger */}
            <div className={"rep-section " + (step === 3 ? "rep-section--active" : "")}>
              <div className="rep-section-title">Apparatoplysninger</div>
              <div className="rep-grid">
                <div className="rep-field">
                  <label className="rep-label">Serienr.</label>
                  <input
                    className={"rep-input " + (step >= 3 && !serial.trim() ? "rep-input--required" : "")}
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    disabled={step < 3}
                  />
                </div>
                <div className="rep-field">
                  <label className="rep-label">Produktet står hos</label>
                  <select
                    className={"rep-input " + (step >= 3 && productAt === "Vælg…" ? "rep-input--required" : "")}
                    value={productAt}
                    onChange={(e) => setProductAt(e.target.value)}
                    disabled={step < 3}
                  >
                    <option>Vælg…</option>
                    <option>Kunde</option>
                    <option>Bilka</option>
                  </select>
                </div>

                <div className="rep-field">
                  <label className="rep-label">Fejlbeskrivelse (kode)</label>
                  <select
                    className={"rep-input " + (step >= 3 && faultCode === "Vælg…" ? "rep-input--required" : "")}
                    value={faultCode}
                    onChange={(e) => setFaultCode(e.target.value)}
                    disabled={step < 3}
                  >
                    <option>Vælg…</option>
                    <option>Tænder ikke</option>
                    <option>Lyder underligt</option>
                    <option>Skærm defekt</option>
                  </select>
                </div>

                <div className="rep-field rep-field--wide">
                  <label className="rep-label">Fejlbeskrivelse</label>
                  <textarea
                    className={"rep-textarea " + (step >= 3 && !faultText.trim() ? "rep-input--required" : "")}
                    rows={4}
                    value={faultText}
                    onChange={(e) => setFaultText(e.target.value)}
                    disabled={step < 3}
                  />
                </div>
              </div>
            </div>

            {/* Trin 4: Indkøbs- og salgsoplysninger */}
            <div className={"rep-section " + (step === 4 ? "rep-section--active" : "")}>
              <div className="rep-section-title">Indkøbs- og salgsoplysninger</div>
              <div className="rep-grid">
                <div className="rep-field">
                  <label className="rep-label">Solgt til forbruger</label>
                  <input className="rep-input rep-input--green" value={soldDate} readOnly />
                </div>
                <div className="rep-field">
                  <label className="rep-label">Salgspris (inkl. moms)</label>
                  <input className="rep-input rep-input--green" value={salePrice} readOnly />
                </div>

                <div className="rep-field">
                  <label className="rep-label">Kvitteringnr.</label>
                  <input
                    className={"rep-input " + (step >= 4 && !receiptNo.trim() ? "rep-input--required" : "")}
                    value={receiptNo}
                    onChange={(e) => setReceiptNo(e.target.value)}
                    disabled={step < 4}
                  />
                </div>
              </div>
            </div>

            <div className="rep-footer">
              <button className="btn btn--ghost" onClick={() => setStep((s) => Math.max(1, (s - 1) as Step) as Step)}>
                Tilbage
              </button>

              {step < 4 ? (
                <button className="btn btn--primary" disabled={!canNext} onClick={() => setStep((s) => (s + 1) as Step)}>
                  Næste
                </button>
              ) : (
                <button
                  className="btn btn--primary"
                  disabled={!canNext}
                  onClick={() => {
                    setCompleted(true);
                    // reset-ish
                    setTimeout(() => setCompleted(false), 2500);
                  }}
                >
                  Opret (træning)
                </button>
              )}
            </div>

            {completed ? (
              <div className="rep-done" role="status">
                Træning gennemført: Der er <b>ikke</b> oprettet en rigtig sag.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
