import { Router } from "express";
import { dbQuery } from "../db";
import { requireAuth, requireRole } from "../middleware/auth";

export const feedbackRouter = Router();
feedbackRouter.use(requireAuth);

feedbackRouter.get("/feedback", async (req, res) => {
  const { guideId } = req.query as any;
  if (!guideId) return res.status(400).json({ error: "Missing guideId" });

  const rows = await dbQuery(
    `SELECT f.id, f.message, f.created_at, u.payroll_number
     FROM feedback f
     JOIN users u ON u.id = f.user_id
     WHERE f.guide_id = $1
     ORDER BY f.created_at DESC`,
    [Number(guideId)]
  );
  res.json({ feedback: rows.rows });
});

feedbackRouter.post("/feedback", async (req, res) => {
  const user = (req as any).user as any;
  const { guideId, message } = req.body as { guideId: number; message: string };

  if (!guideId || !message?.trim()) return res.status(400).json({ error: "Missing fields" });

  await dbQuery(
    `INSERT INTO feedback (guide_id, user_id, message) VALUES ($1, $2, $3)`,
    [Number(guideId), Number(user.sub), message.trim()]
  );

  res.json({ ok: true });
});

feedbackRouter.get("/suggestions", async (req, res) => {
  const { guideId } = req.query as any;

  const rows = await dbQuery(
    `SELECT s.id, s.title, s.proposed_changes, s.status, s.created_at, u.payroll_number
     FROM suggestions s
     JOIN users u ON u.id = s.user_id
     ${guideId ? "WHERE s.guide_id = $1" : ""}
     ORDER BY s.created_at DESC`,
    guideId ? [Number(guideId)] : []
  );

  res.json({ suggestions: rows.rows });
});

feedbackRouter.post("/suggestions", async (req, res) => {
  const user = (req as any).user as any;
  const { guideId, title, proposedChanges } = req.body as {
    guideId: number;
    title: string;
    proposedChanges: string;
  };

  if (!guideId || !title?.trim() || !proposedChanges?.trim()) {
    return res.status(400).json({ error: "Missing fields" });
  }

  await dbQuery(
    `INSERT INTO suggestions (guide_id, user_id, title, proposed_changes)
     VALUES ($1, $2, $3, $4)`,
    [Number(guideId), Number(user.sub), title.trim(), proposedChanges.trim()]
  );

  res.json({ ok: true });
});

feedbackRouter.post("/approvals", requireRole(["APPROVER", "ADMIN"]), async (req, res) => {
  const approver = (req as any).user as any;
  const { suggestionId, decision, comment } = req.body as {
    suggestionId: number;
    decision: "APPROVED" | "REJECTED";
    comment?: string;
  };

  if (!suggestionId || !["APPROVED", "REJECTED"].includes(decision)) {
    return res.status(400).json({ error: "Invalid approval" });
  }

  // Ensure open
  const s = await dbQuery("SELECT status FROM suggestions WHERE id = $1 LIMIT 1", [Number(suggestionId)]);
  if (s.rowCount === 0) return res.status(404).json({ error: "Suggestion not found" });
  if ((s.rows[0] as any).status !== "OPEN") return res.status(409).json({ error: "Already decided" });

  await dbQuery(
    `INSERT INTO approvals (suggestion_id, approver_user_id, decision, comment)
     VALUES ($1, $2, $3, $4)`,
    [Number(suggestionId), Number(approver.sub), decision, (comment || "").trim()]
  );

  await dbQuery(
    `UPDATE suggestions SET status = $1 WHERE id = $2`,
    [decision === "APPROVED" ? "APPROVED" : "REJECTED", Number(suggestionId)]
  );

  res.json({ ok: true });
});
