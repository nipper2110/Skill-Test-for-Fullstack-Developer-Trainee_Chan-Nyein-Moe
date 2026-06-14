import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import categoryRoutes from "./routes/categories.js";
import dashboardRoutes from "./routes/dashboard.js";
import invitationRoutes, { inviteRouter } from "./routes/invitations.js";
import profileRoutes from "./routes/profile.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: [
      "https://taskflow-frontend-bxpd.onrender.com", // Render URL
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "TaskFlow API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/users", inviteRouter);
app.use("/api/profile", profileRoutes);

app.use(errorHandler);

export default app;
