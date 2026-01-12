// src/data/api.ts
import { dbRead, dbWrite } from "./mockDb";
import { hashPasswordUIOnly } from "./seed";
import type { AllowlistEntry, AreaKey, AuthUser, Guide, GuideVersion, GuideWithVersion, SessionRow, UserRow } from "./types";

function requireDb() {
  const db = dbRead();
  if (!db) throw new Error("DB ikke initialiseret. Genindlæs siden.");
  return db;
}

function save(db: any) {
  dbWrite(db);
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function setToken(token: string) {
  localStorage.setItem("bilka_auth_token", token);
}
function getToken() {
  return localStorage.getItem("bilka_auth_token") || "";
}
function clearToken() {
  localStorage.removeItem("bilka_auth_token");
}

export function apiMe(): AuthUser | null {
  const token = getToken();
  if (!token) return null;

  const db = requireDb();
  const session = (db.sessions as SessionRow[]).find((s) => s.token === token);
  if (!session) return null;

  const user = (db.users as UserRow[]).find((u) => u.id === session.userId);
  if (!user || !user.isActive) return null;

  return { id: user.id, payrollNumber: user.payrollNumber, role: user.role };
}

export async function apiLogin(payrollNumber: string, password: string): Promise<AuthUser> {
  const db = requireDb();
  const pn = payrollNumber.trim();

  const user = (db.users as UserRow[]).find((u) => u.payrollNumber === pn);
  if (!user) throw new Error("Ugyldigt lønnummer eller adgangskode.");
  if (!user.isActive) throw new Error("Bruger er deaktiveret.");

  const hash = hashPasswordUIOnly(password);
  if (hash !== user.passwordHash) throw new Error("Ugyldigt lønnummer eller adgangskode.");

  const token = id("t");
  (db.sessions as SessionRow[]).push({ token, userId: user.id, createdAt: new Date().toISOString() });
  save(db);
  setToken(token);

  return { id: user.id, payrollNumber: user.payrollNumber, role: user.role };
}

export function apiLogout() {
  const token = getToken();
  if (!token) return;

  const db = requireDb();
  db.sessions = (db.sessions as SessionRow[]).filter((s) => s.token !== token);
  save(db);
  clearToken();
}

export async function apiActivateAccount(payrollNumber: string, password: string, repeatPassword: string): Promise<AuthUser> {
  const db = requireDb();
  const pn = payrollNumber.trim();

  if (!/^\d{4,10}$/.test(pn)) throw new Error("Lønnummer skal være tal (4-10 cifre).");
  if (!password || password.length < 6) throw new Error("Adgangskode skal være mindst 6 tegn.");
  if (password !== repeatPassword) throw new Error("Adgangskoderne matcher ikke.");

  const allow = (db.allowlist as AllowlistEntry[]).find((a) => a.payrollNumber === pn);
  if (!allow || !allow.isApproved) throw new Error("Lønnummer er ikke godkendt endnu.");
  if (allow.isActivated) throw new Error("Lønnummer er allerede aktiveret.");

  const exists = (db.users as UserRow[]).some((u) => u.payrollNumber === pn);
  if (exists) throw new Error("Der findes allerede en konto til dette lønnummer.");

  const newUser: UserRow = {
    id: id("u"),
    payrollNumber: pn,
    role: allow.role,
    passwordHash: hashPasswordUIOnly(password),
    isActive: true,
  };

  (db.users as UserRow[]).push(newUser);
  allow.isActivated = true;
  save(db);

  const token = id("t");
  (db.sessions as SessionRow[]).push({ token, userId: newUser.id, createdAt: new Date().toISOString() });
  save(db);
  setToken(token);

  return { id: newUser.id, payrollNumber: newUser.payrollNumber, role: newUser.role };
}

export function apiListGuidesByArea(area: AreaKey): Guide[] {
  const db = requireDb();
  return (db.guides as Guide[]).filter((g) => g.area === area);
}

export function apiGetGuideByAreaSlug(area: AreaKey, slug: string): GuideWithVersion | null {
  const db = requireDb();
  const guide = (db.guides as Guide[]).find((g) => g.area === area && g.slug === slug);
  if (!guide) return null;

  const versions = (db.versions as GuideVersion[]).filter((v) => v.guideId === guide.id);
  const latest = versions.sort((a, b) => b.versionNumber - a.versionNumber)[0];
  if (!latest) return null;

  return { ...guide, latestVersion: latest };
}
