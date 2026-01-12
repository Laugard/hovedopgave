import { Router } from "express";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import { dbQuery } from "../db";
import { signToken } from "../middleware/auth";

export const authRouter = Router();

const authLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post("/activate", authLimiter, async (req, res) => {
  const { payrollNumber, password } = req.body as { payrollNumber: string; password: string };
  const pn = (payrollNumber || "").trim();

  if (!pn || !/^\d{4,10}$/.test(pn)) return res.status(400).json({ error: "Invalid payrollNumber" });
  if (!password || password.length < 6) return res.status(400).json({ error: "Invalid password" });

  const allow = await dbQuery(
    "SELECT * FROM payroll_allowlist WHERE payroll_number = $1 LIMIT 1",
    [pn]
  );

  if (allow.rowCount === 0) return res.status(403).json({ error: "Not allowlisted" });
  const a = allow.rows[0] as any;

  if (!a.is_approved) return res.status(403).json({ error: "Not approved yet" });
  if (a.is_activated) return res.status(409).json({ error: "Already activated" });

  const existingUser = await dbQuery("SELECT id FROM users WHERE payroll_number = $1 LIMIT 1", [pn]);
  if (existingUser.rowCount > 0) {
    await dbQuery("UPDATE payroll_allowlist SET is_activated = true WHERE payroll_number = $1", [pn]);
    return res.status(409).json({ error: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const userInsert = await dbQuery(
    "INSERT INTO users (payroll_number, password_hash, role) VALUES ($1, $2, $3) RETURNING id, payroll_number, role, is_active",
    [pn, passwordHash, a.role]
  );

  await dbQuery("UPDATE payroll_allowlist SET is_activated = true WHERE payroll_number = $1", [pn]);

  const user = userInsert.rows[0] as any;
  const token = signToken({
    sub: String(user.id),
    payrollNumber: user.payroll_number,
    role: user.role,
  });

  return res.json({ token, user: { id: user.id, payrollNumber: user.payroll_number, role: user.role } });
});

authRouter.post("/login", authLimiter, async (req, res) => {
  const { payrollNumber, password } = req.body as { payrollNumber: string; password: string };
  const pn = (payrollNumber || "").trim();

  if (!pn || !password) return res.status(400).json({ error: "Missing credentials" });

  const found = await dbQuery(
    "SELECT id, payroll_number, password_hash, role, is_active FROM users WHERE payroll_number = $1 LIMIT 1",
    [pn]
  );

  if (found.rowCount === 0) return res.status(401).json({ error: "Invalid credentials" });

  const user = found.rows[0] as any;
  if (!user.is_active) return res.status(403).json({ error: "User inactive" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken({
    sub: String(user.id),
    payrollNumber: user.payroll_number,
    role: user.role,
  });

  return res.json({ token, user: { id: user.id, payrollNumber: user.payroll_number, role: user.role } });
});
