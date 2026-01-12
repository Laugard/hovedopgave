// src/pages/GuideDetailPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGetGuideByAreaSlug } from "../data/api";
import type { GuideWithVersion } from "../data/types";

export function GuideDetailPage() {
  const { area, slug } = useParams();

  const [data, setData] = useState<GuideWithVersion | null>(null);

  useEffect(() => {
    if (!area || !slug) return;
    const g = apiGetGuideByAreaSlug(area as any, slug);
    setData(g);
  }, [area, slug]);

  const title = useMemo(() => {
    if (!data) return "Guide";
    return `${capitalize(data.area)} – ${data.title}`;
  }, [data]);

  if (!data) {
    return (
      <div className="panel">
        <h1>Guide</h1>
        <p className="muted">Kunne ikke finde guide (mock-data).</p>
        <Link className="btn btn--ghost" to="/app/guides">
          Tilbage
        </Link>
      </div>
    );
  }

  const v = data.latestVersion;

  return (
    <div>
      <h1>{title}</h1>
      <p className="muted">
        Version {v.versionNumber} · Sidst opdateret: {v.updatedAt}
      </p>

      <div className="panel">
        <div className="guide-head-actions">
          <Link className="btn btn--primary" to={`/app/guides/${data.area}/free`}>
            Start fri træning
          </Link>
          <Link className="btn btn--ghost" to="/app/guides">
            Tilbage til guides
          </Link>
        </div>

        <div className="guide-sections">
          <section className="guide-section">
            <h2>Hurtigt svar</h2>
            <div className="callout">{v.quickAnswer}</div>
          </section>

          <section className="guide-section">
            <h2>Trin-for-trin</h2>
            <ol className="steps">
              {v.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </section>

          <section className="guide-section">
            <h2>Fejlhåndtering</h2>
            <ul className="bullets">
              {v.troubleshooting.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </section>

          <section className="guide-section">
            <h2>Eskalering</h2>
            <ul className="bullets">
              {v.escalation.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
