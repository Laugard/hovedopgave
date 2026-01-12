// src/pages/GuidesPage.tsx
import React, { useEffect, useState } from "react";
import { CardLink } from "../components/CardLink";
import { apiListGuidesByArea } from "../data/api";
import type { AreaKey, Guide } from "../data/types";

const AREAS: Array<{ key: AreaKey; title: string; desc: string }> = [
  { key: "kasse", title: "Kasse", desc: "Retur, manuel retur, print boner m.m." },
  { key: "reparation", title: "Reparationer", desc: "Opret reparationssag (formularflow)." },
  { key: "returemballage", title: "Returemballage", desc: "Book returemballage (booking-flow)." },
  { key: "pda", title: "PDA", desc: "Vareudlevering (scan/handlinger)." },
];

export function GuidesPage() {
  const [guidesByArea, setGuidesByArea] = useState<Record<string, Guide[]>>({});

  useEffect(() => {
    const out: Record<string, Guide[]> = {};
    for (const a of AREAS) out[a.key] = apiListGuidesByArea(a.key);
    setGuidesByArea(out);
  }, []);

  return (
    <div>
      <h1>Guides</h1>
      <p className="muted">Listerne er UI + mock-data (til rapport/demo).</p>

      {AREAS.map((a) => (
        <section key={a.key} className="section">
          <div className="section__head">
            <h2>{a.title}</h2>
            <p className="muted">{a.desc}</p>
          </div>

          <div className="cards">
            {(guidesByArea[a.key] ?? []).map((g) => (
              <CardLink
                key={g.id}
                title={g.title}
                description={g.shortDescription}
                to={`/app/guides/${g.area}/${g.slug}`}
                rightTag="Guide"
              />
            ))}

            {/* Fri træning card */}
            <CardLink
              title="Fri træning"
              description="Klik frit rundt i simulatoren (uden trin)."
              to={`/app/guides/${a.key}/free`}
              rightTag="Træning"
            />
          </div>
        </section>
      ))}
    </div>
  );
}
