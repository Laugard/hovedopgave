import { Router } from "express";
import { dbQuery } from "../db";
import { requireAuth } from "../middleware/auth";

export const guidesRouter = Router();
guidesRouter.use(requireAuth);

guidesRouter.get("/categories", async (_req, res) => {
  const cats = await dbQuery("SELECT id, slug, title FROM categories ORDER BY id ASC");
  res.json({ categories: cats.rows });
});

guidesRouter.get("/guides", async (req, res) => {
  const { categorySlug } = req.query as any;

  if (categorySlug) {
    const data = await dbQuery(
      `SELECT g.id, g.slug, g.title, c.slug as category_slug
       FROM guides g
       JOIN categories c ON c.id = g.category_id
       WHERE c.slug = $1
       ORDER BY g.title ASC`,
      [categorySlug]
    );
    return res.json({ guides: data.rows });
  }

  const all = await dbQuery(
    `SELECT g.id, g.slug, g.title, c.slug as category_slug
     FROM guides g
     JOIN categories c ON c.id = g.category_id
     ORDER BY c.slug, g.title ASC`
  );
  return res.json({ guides: all.rows });
});

guidesRouter.get("/guides/:area/:slug", async (req, res) => {
  const { area, slug } = req.params;

  const guide = await dbQuery(
    `SELECT g.id, g.slug, g.title, c.slug as category_slug
     FROM guides g
     JOIN categories c ON c.id = g.category_id
     WHERE c.slug = $1 AND g.slug = $2
     LIMIT 1`,
    [area, slug]
  );

  if (guide.rowCount === 0) return res.status(404).json({ error: "Guide not found" });

  const guideRow = guide.rows[0] as any;

  const version = await dbQuery(
    `SELECT id, version_no, quick_answer, steps, troubleshooting, escalation, created_at
     FROM guide_versions
     WHERE guide_id = $1
     ORDER BY version_no DESC
     LIMIT 1`,
    [guideRow.id]
  );

  const v = version.rows[0] as any;

  return res.json({
    guide: {
      id: guideRow.id,
      area: guideRow.category_slug,
      slug: guideRow.slug,
      title: guideRow.title,
      latestVersion: v ? {
        id: v.id,
        versionNo: v.version_no,
        quickAnswer: v.quick_answer,
        steps: v.steps,
        troubleshooting: v.troubleshooting,
        escalation: v.escalation,
        createdAt: v.created_at,
      } : null,
    },
  });
});
