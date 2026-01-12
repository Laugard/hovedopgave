// src/data/mockDb.ts
const KEY = "bilka_howto_mockdb_v1";

export type DbShape = {
  allowlist: any[];
  users: any[];
  sessions: any[];
  guides: any[];
  versions: any[];
};

export function dbRead(): DbShape | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function dbWrite(next: DbShape) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function dbReset(next: DbShape) {
  dbWrite(next);
}

export function dbKey() {
  return KEY;
}
