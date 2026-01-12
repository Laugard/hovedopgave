import React, { useEffect, useMemo, useState } from "react";
import { apiGetGuides, apiGetFeedback, apiPostFeedback, apiGetSuggestions, apiPostSuggestion, apiApproveSuggestion } from "../data/api";
import { useAuth } from "../auth/AuthContext";

export function FeedbackPage() {
  const { user } = useAuth();

  const [guides, setGuides] = useState<any[]>([]);
  const [selectedGuideId, setSelectedGuideId] = useState<number | null>(null);

  const [feedback, setFeedback] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [fbText, setFbText] = useState("");
  const [sTitle, setSTitle] = useState("");
  const [sText, setSText] = useState("");

  const [busy, setBusy] = useState(false);
  const isApprover = useMemo(() => user?.role === "APPROVER" || user?.role === "ADMIN", [user]);

  useEffect(() => {
    (async () => {
      const res = await apiGetGuides();
      setGuides(res.guides);
      if (res.guides[0]) setSelectedGuideId(res.guides[0].id);
    })();
  }, []);

  async function reload(guideId: number) {
    const fb = await apiGetFeedback(guideId);
    const sg = await apiGetSuggestions(guideId);
    setFeedback(fb.feedback);
    setSuggestions(sg.suggestions);
  }

  useEffect(() => {
    if (!selectedGuideId) return;
    reload(selectedGuideId);
  }, [selectedGuideId]);

  return (
    <div>
      <h1>Forslag & feedback</h1>
      <p className="muted">
        Her kan medarbejdere sende feedback og ændringsforslag. Godkendere kan godkende/afvise forslag.
      </p>

      <div className="panel" style={{ display: "grid", gap: 14 }}>
        <div>
          <label className="field">
            <span>Vælg guide</span>
            <select
              value={selectedGuideId ?? ""}
              onChange={(e) => setSelectedGuideId(Number(e.target.value))}
            >
              {guides.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.category_slug} / {g.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="panel">
          <h2>Send feedback</h2>
          <label className="field">
            <span>Kommentar</span>
            <textarea value={fbText} onChange={(e) => setFbText(e.target.value)} rows={3} />
          </label>
          <button
            className="btn btn--primary"
            disabled={!selectedGuideId || !fbText.trim() || busy}
            onClick={async () => {
              if (!selectedGuideId) return;
              setBusy(true);
              try {
                await apiPostFeedback(selectedGuideId, fbText.trim());
                setFbText("");
                await reload(selectedGuideId);
              } finally {
                setBusy(false);
              }
            }}
          >
            Send feedback
          </button>

          <div style={{ marginTop: 12 }}>
            <h3>Seneste feedback</h3>
            {feedback.length === 0 ? <p className="muted">Ingen feedback endnu.</p> : null}
            <ul>
              {feedback.map((f) => (
                <li key={f.id}>
                  <strong>{f.payroll_number}</strong>: {f.message}{" "}
                  <span className="muted">({new Date(f.created_at).toLocaleString()})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel">
          <h2>Ændringsforslag</h2>

          <label className="field">
            <span>Titel</span>
            <input value={sTitle} onChange={(e) => setSTitle(e.target.value)} />
          </label>
          <label className="field">
            <span>Forslag</span>
            <textarea value={sText} onChange={(e) => setSText(e.target.value)} rows={4} />
          </label>

          <button
            className="btn btn--primary"
            disabled={!selectedGuideId || !sTitle.trim() || !sText.trim() || busy}
            onClick={async () => {
              if (!selectedGuideId) return;
              setBusy(true);
              try {
                await apiPostSuggestion(selectedGuideId, sTitle.trim(), sText.trim());
                setSTitle("");
                setSText("");
                await reload(selectedGuideId);
              } finally {
                setBusy(false);
              }
            }}
          >
            Send ændringsforslag
          </button>

          <div style={{ marginTop: 12 }}>
            <h3>Forslag (status)</h3>
            {suggestions.length === 0 ? <p className="muted">Ingen forslag endnu.</p> : null}

            <div style={{ display: "grid", gap: 10 }}>
              {suggestions.map((s) => (
                <div key={s.id} className="panel">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <strong>{s.title}</strong>{" "}
                      <span className="muted">({s.status})</span>
                      <div className="muted">
                        Af {s.payroll_number} — {new Date(s.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <pre style={{ whiteSpace: "pre-wrap", marginTop: 10 }}>{s.proposed_changes}</pre>

                  {isApprover && s.status === "OPEN" ? (
                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                      <button
                        className="btn btn--primary"
                        onClick={async () => {
                          setBusy(true);
                          try {
                            await apiApproveSuggestion(s.id, "APPROVED", "");
                            if (selectedGuideId) await reload(selectedGuideId);
                          } finally {
                            setBusy(false);
                          }
                        }}
                      >
                        Godkend
                      </button>
                      <button
                        className="btn btn--ghost"
                        onClick={async () => {
                          setBusy(true);
                          try {
                            await apiApproveSuggestion(s.id, "REJECTED", "");
                            if (selectedGuideId) await reload(selectedGuideId);
                          } finally {
                            setBusy(false);
                          }
                        }}
                      >
                        Afvis
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
