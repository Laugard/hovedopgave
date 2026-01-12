// src/data/seed.ts
import { dbRead, dbWrite } from "./mockDb";
import type { AreaKey, Guide, GuideVersion, Role, UserRow } from "./types";

// UI-only “hash” (ikke sikker kryptografi) – nok til demo uden klartekst.
function pseudoHash(s: string) {
  let out = 0;
  for (let i = 0; i < s.length; i++) out = (out * 31 + s.charCodeAt(i)) >>> 0;
  return "h_" + out.toString(16) + "_" + s.length;
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function now() {
  return new Date().toISOString().slice(0, 10);
}

export function seedIfNeeded() {
  const existing = dbRead();
  if (existing) return;

  const allowlist = [
    { payrollNumber: "123456", role: "EMPLOYEE" as Role, isApproved: true, isActivated: false },
    { payrollNumber: "222222", role: "APPROVER" as Role, isApproved: true, isActivated: false },
    { payrollNumber: "999999", role: "ADMIN" as Role, isApproved: true, isActivated: false },
  ];

  // Seed en admin-konto så du altid kan logge ind uden aktivering i demo:
  const adminUser: UserRow = {
    id: id("u"),
    payrollNumber: "999999",
    role: "ADMIN",
    passwordHash: pseudoHash("admin123"),
    isActive: true,
  };
  allowlist.find((a) => a.payrollNumber === "999999")!.isActivated = true;

  const guides: Guide[] = [];
  const versions: GuideVersion[] = [];

  function addGuide(area: AreaKey, title: string, slug: string, shortDescription: string, tags: string[], v: Omit<GuideVersion, "id" | "guideId">) {
    const gid = id("g");
    guides.push({ id: gid, area, title, slug, shortDescription, tags });
    versions.push({
      id: id("gv"),
      guideId: gid,
      ...v,
    });
  }

  addGuide("kasse", "Retur via original bon", "retur-via-original-bon", "Træn returflowet med original bon.", ["retur", "bon", "kasse"], {
    versionNumber: 1,
    updatedAt: now(),
    quickAnswer: "Retur funktioner → Retur via original bon → Scan bon → Vælg vare → Bekræft retur.",
    steps: [
      "Åbn Retur funktioner i højre menu.",
      "Vælg Retur via original bon.",
      "Scan/indtast bonnummer (træning).",
      "Vælg varen der returneres.",
      "Bekræft retur og afslut.",
    ],
    troubleshooting: [
      "Hvis bon ikke kan findes: prøv igen eller brug Manuel retur (hvis relevant).",
      "Hvis varen ikke står på bon: tjek om det er korrekt bon/kvittering.",
    ],
    escalation: [
      "Hvis retur ikke kan gennemføres: kontakt nøgleperson/leder.",
      "Ved systemfejl: følg lokal procedure for driftstop.",
    ],
  });

  addGuide("kasse", "Manuel retur", "manuel-retur", "Træn manuel retur når bon mangler.", ["retur", "manuel"], {
    versionNumber: 1,
    updatedAt: now(),
    quickAnswer: "Retur funktioner → Manuel retur → Indtast/scan vare → Årsag → Bekræft.",
    steps: [
      "Åbn Retur funktioner.",
      "Vælg Manuel retur.",
      "Scan/indtast varen (træning).",
      "Vælg årsag og udfyld nødvendige felter.",
      "Bekræft og afslut.",
    ],
    troubleshooting: [
      "Hvis varen ikke kan findes: tjek varenummer/scan igen.",
      "Hvis du er i tvivl om returret: eskalér til godkender.",
    ],
    escalation: ["Kontakt godkender ved tvivl om retur/regler.", "Kontakt leder ved gentagne systemproblemer."],
  });

  addGuide("reparation", "Opret reparationssag", "opret-reparationssag", "Træn ‘Registrer ny ordre’ i reparation.", ["reparation", "serienr", "fejl"], {
    versionNumber: 1,
    updatedAt: now(),
    quickAnswer: "Indsaml kundenavn/telefon/adresse → Serienr. → Fejlbeskrivelse → Kvitteringsnr. → Opret.",
    steps: [
      "Udfyld kundeoplysninger (kundenavn, telefon, adresse).",
      "Indtast serienummer og vælg hvor produktet står.",
      "Vælg fejltype og skriv en præcis fejlbeskrivelse.",
      "Indtast kvitteringsnummer og ‘opret’ (træning).",
    ],
    troubleshooting: [
      "Manglende serienummer: bed kunden finde mærkat/emballage.",
      "Uklart problem: få kunden til at beskrive symptomer (hvornår sker det?).",
    ],
    escalation: ["Tvivl om type: kontakt nøgleperson.", "Hvis XPOS-data ikke matcher: eskalér til leder/support."],
  });

  addGuide("returemballage", "Book returemballage", "book-returemballage", "Træn booking/listeskærm for returemballage.", ["returemballage", "booking"], {
    versionNumber: 1,
    updatedAt: now(),
    quickAnswer: "Vælg lager → Find varelinje → Gem og Udskriv (træning).",
    steps: [
      "Vælg korrekt lager/terminal.",
      "Find relevante varenummer-linjer.",
      "Kontrollér antal/type og afslut med ‘Gem og Udskriv’.",
    ],
    troubleshooting: [
      "Forkert type valgt: nulstil og vælg igen.",
      "Hvis du ikke kan finde varenummer: brug søgefelt (Text).",
    ],
    escalation: ["Kontakt nøgleperson ved gentagne fejl.", "Kontakt leder hvis workflow stopper."],
  });

  addGuide("pda", "Udlever vare", "udlever-vare", "Træn voucher-søgning og vare-kort.", ["pda", "udlevering", "scan"], {
    versionNumber: 1,
    updatedAt: now(),
    quickAnswer: "Scan/indtast voucher → Søg → Kontrollér vare → Afslut (træning).",
    steps: [
      "Åbn Vareudlevering i PDA.",
      "Scan eller indtast voucher.",
      "Tryk Søg og kontrollér varelinjen.",
      "Afslut flow (træning).",
    ],
    troubleshooting: [
      "Ingen resultater: tjek voucher/scan igen.",
      "Forkert vare: tjek at du står i korrekt modul.",
    ],
    escalation: ["Kontakt nøgleperson hvis ordre ikke kan findes.", "Kontakt leder ved systemfejl."],
  });

  dbWrite({
    allowlist,
    users: [adminUser],
    sessions: [],
    guides,
    versions,
  });
}

export function hashPasswordUIOnly(password: string) {
  return pseudoHash(password);
}
