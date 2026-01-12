import { Router } from "express";
import { dbQuery } from "../db";
import { requireAuth, requireRole } from "../middleware/auth";

export const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.use(requireRole(["ADMIN"]));

adminRouter.get("/allowlist", async (_req, res) => {
  const rows = await dbQuery(
    `SELECT id, payroll_number, role, is_approved, is_activated, created_at
     FROM payroll_allowlist
     ORDER BY created_at DESC`
  );
  res.json({ allowlist: rows.rows });
});

adminRouter.post("/allowlist", async (req, res) => {
  const { payrollNumber, role } = req.body as { payrollNumber: string; role?: string };
  const pn = (payrollNumber || "").trim();
  if (!pn || !/^\d{4,10}$/.test(pn)) return res.status(400).json({ error: "Invalid payrollNumber" });

  const r = (role || "EMPLOYEE").toUpperCase();
  if (!["EMPLOYEE", "APPROVER", "ADMIN"].includes(r)) return res.status(400).json({ error: "Invalid role" });

  await dbQuery(
    `INSERT INTO payroll_allowlist (payroll_number, role, is_approved, is_activated)
     VALUES ($1, $2, false, false)
     ON CONFLICT (payroll_number) DO NOTHING`,
    [pn, r]
  );

  res.json({ ok: true });
});

adminRouter.patch("/allowlist/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { isApproved, role } = req.body as { isApproved?: boolean; role?: string };

  if (!id) return res.status(400).json({ error: "Invalid id" });

  if (role && !["EMPLOYEE", "APPROVER", "ADMIN"].includes(role.toUpperCase())) {
    return res.status(400).json({ error: "Invalid role" });
  }

  await dbQuery(
    `UPDATE payroll_allowlist
     SET is_approved = COALESCE($2, is_approved),
         role = COALESCE($3, role)
     WHERE id = $1`,
    [id, typeof isApproved === "boolean" ? isApproved : null, role ? role.toUpperCase() : null]
  );

  res.json({ ok: true });
});

adminRouter.get("/users", async (_req, res) => {
  const rows = await dbQuery(
    `SELECT id, payroll_number, role, is_active, created_at
     FROM users
     ORDER BY created_at DESC`
  );
  res.json({ users: rows.rows });
});

adminRouter.patch("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { isActive, role } = req.body as { isActive?: boolean; role?: string };

  if (!id) return res.status(400).json({ error: "Invalid id" });

  if (role && !["EMPLOYEE", "APPROVER", "ADMIN"].includes(role.toUpperCase())) {
    return res.status(400).json({ error: "Invalid role" });
  }

  await dbQuery(
    `UPDATE users
     SET is_active = COALESCE($2, is_active),
         role = COALESCE($3, role)
     WHERE id = $1`,
    [id, typeof isActive === "boolean" ? isActive : null, role ? role.toUpperCase() : null]
  );

  res.json({ ok: true });
});
