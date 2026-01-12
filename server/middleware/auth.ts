import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type JwtPayload = {
  sub: string; // userId
  payrollNumber: string;
  role: "EMPLOYEE" | "APPROVER" | "ADMIN";
};

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(roles: Array<JwtPayload["role"]>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtPayload | undefined;
    if (!user) return res.status(401).json({ error: "Missing auth" });
    if (!roles.includes(user.role)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
