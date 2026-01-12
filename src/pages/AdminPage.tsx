import React, { useEffect, useState } from "react";
import { apiAdminAddAllowlist, apiAdminGetAllowlist, apiAdminGetUsers, apiAdminPatchAllowlist, apiAdminPatchUser } from "../data/api";
import { useAuth } from "../auth/AuthContext";

export function AdminPage() {
  const { user } = useAuth();
  const [allowlist, setAllowlist] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [newPn, setNewPn] = useState("");
  const [newRole, setNewRole] = useState<"EMPLOYEE" | "APPROVER" | "ADMIN">("EMPLOYEE");

  async function reload() {
    const a = await apiAdminGetAllowlist();
    const u = await apiAdminGetUsers();
    setAllowlist(a.allowlist);
    setUsers(u.users);
  }

  useEffect(() => {
    reload();
  }, []);

  if (user?.role !== "ADMIN") {
    return (
      <div>
        <h1>Admin</h1>
        <p className="muted">Du har ikke adgang til denne side.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin</h1>
      <p className="muted">Styr adgang: allowlist, roller og aktive brugere.</p>

      <div className="panel">
        <h2>Tilføj lønnummer til allowlist</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "end", flexWrap: "wrap" }}>
          <label className="field" style={{ minWidth: 220 }}>
            <span>Lønnummer</span>
            <input value={newPn} onChange={(e) => setNewPn(e.target.value)} placeholder="fx 123456" />
          </label>

          <label className="field" style={{ minWidth: 220 }}>
            <span>Rolle</span>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value as any)}>
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="APPROVER">APPROVER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>

          <button
            className="btn btn--primary"
            disabled={!newPn.trim()}
            onClick={async () => {
              await apiAdminAddAllowlist(newPn.trim(), newRole);
              setNewPn("");
              setNewRole("EMPLOYEE");
              await reload();
            }}
          >
            Tilføj
          </button>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 14 }}>
        <h2>Allowlist</h2>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Lønnummer</th>
                <th>Rolle</th>
                <th>Godkendt</th>
                <th>Aktiveret</th>
                <th>Handling</th>
              </tr>
            </thead>
            <tbody>
              {allowlist.map((a) => (
                <tr key={a.id}>
                  <td>{a.payroll_number}</td>
                  <td>
                    <select
                      value={a.role}
                      onChange={async (e) => {
                        await apiAdminPatchAllowlist(a.id, { role: e.target.value });
                        await reload();
                      }}
                    >
                      <option value="EMPLOYEE">EMPLOYEE</option>
                      <option value="APPROVER">APPROVER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>{a.is_approved ? "Ja" : "Nej"}</td>
                  <td>{a.is_activated ? "Ja" : "Nej"}</td>
                  <td>
                    <button
                      className="btn btn--ghost"
                      onClick={async () => {
                        await apiAdminPatchAllowlist(a.id, { isApproved: !a.is_approved });
                        await reload();
                      }}
                    >
                      {a.is_approved ? "Fjern godkendelse" : "Godkend"}
                    </button>
                  </td>
                </tr>
              ))}
              {allowlist.length === 0 ? (
                <tr><td colSpan={5} className="muted">Ingen allowlist entries</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 14 }}>
        <h2>Brugere</h2>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Lønnummer</th>
                <th>Rolle</th>
                <th>Aktiv</th>
                <th>Handling</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.payroll_number}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={async (e) => {
                        await apiAdminPatchUser(u.id, { role: e.target.value });
                        await reload();
                      }}
                    >
                      <option value="EMPLOYEE">EMPLOYEE</option>
                      <option value="APPROVER">APPROVER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>{u.is_active ? "Ja" : "Nej"}</td>
                  <td>
                    <button
                      className="btn btn--ghost"
                      onClick={async () => {
                        await apiAdminPatchUser(u.id, { isActive: !u.is_active });
                        await reload();
                      }}
                    >
                      {u.is_active ? "Deaktivér" : "Aktivér"}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 ? (
                <tr><td colSpan={4} className="muted">Ingen brugere</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}