import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { authRouter } from "./routes/auth";
import { guidesRouter } from "./routes/guides";
import { feedbackRouter } from "./routes/feedback";
import { adminRouter } from "./routes/admin";

const app = express();

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api", guidesRouter);
app.use("/api", feedbackRouter);
app.use("/api/admin", adminRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
